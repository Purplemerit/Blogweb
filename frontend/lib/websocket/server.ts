/**
 * WebSocket Server for Real-time Collaboration
 * Handles collaborative editing, cursor positions, and live updates
 */

import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import prisma from '@/lib/prisma';

export interface CollaborationEvent {
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface TextSelection {
  start: CursorPosition;
  end: CursorPosition;
}

export interface UserPresence extends CollaborationEvent {
  cursor?: CursorPosition;
  selection?: TextSelection;
  color: string;
}

export interface ContentChange {
  articleId: string;
  userId: string;
  operations: any[]; // Yjs operations
  version: number;
}

let io: SocketIOServer | null = null;

export function initializeWebSocket(httpServer: HTTPServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
  });

  // Store active sessions
  const activeSessions = new Map<string, Set<string>>(); // articleId -> Set of socketIds

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join article room
    socket.on('join-article', async (data: { articleId: string; userId: string; userName: string; userAvatar?: string }) => {
      const { articleId, userId, userName, userAvatar } = data;

      try {
        // Verify user has access to the article
        const article = await prisma.article.findFirst({
          where: {
            id: articleId,
            OR: [
              { userId },
              {
                collaborators: {
                  some: {
                    userId,
                    status: 'ACCEPTED',
                  },
                },
              },
            ],
          },
        });

        if (!article) {
          socket.emit('error', { message: 'Access denied to this article' });
          return;
        }

        // Join the room
        socket.join(`article:${articleId}`);

        // Track this session
        if (!activeSessions.has(articleId)) {
          activeSessions.set(articleId, new Set());
        }
        activeSessions.get(articleId)!.add(socket.id);

        // Create or update session in database
        await prisma.collaborationSession.create({
          data: {
            articleId,
            userId,
            socketId: socket.id,
            lastActiveAt: new Date(),
          },
        });

        // Get all active users in this article
        const sessions = await prisma.collaborationSession.findMany({
          where: {
            articleId,
            lastActiveAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000), // Active in last 5 minutes
            },
          },
        });

        // Notify others that a new user joined
        socket.to(`article:${articleId}`).emit('user-joined', {
          articleId,
          userId,
          userName,
          userAvatar,
          socketId: socket.id,
        });

        // Send list of active users to the joining user
        socket.emit('active-users', {
          articleId,
          users: sessions.map(s => ({
            userId: s.userId,
            socketId: s.socketId,
            cursor: s.cursor,
            selection: s.selection,
          })),
        });

        console.log(`User ${userName} joined article ${articleId}`);
      } catch (error) {
        console.error('Error joining article:', error);
        socket.emit('error', { message: 'Failed to join article' });
      }
    });

    // Handle cursor position updates
    socket.on('cursor-update', async (data: { articleId: string; userId: string; cursor: CursorPosition }) => {
      const { articleId, userId, cursor } = data;

      try {
        // Update cursor in database
        await prisma.collaborationSession.updateMany({
          where: {
            articleId,
            userId,
            socketId: socket.id,
          },
          data: {
            cursor: cursor as any, // Cast to any to satisfy Prisma JSON type
            lastActiveAt: new Date(),
          },
        });

        // Broadcast cursor position to others
        socket.to(`article:${articleId}`).emit('cursor-moved', {
          userId,
          socketId: socket.id,
          cursor,
        });
      } catch (error) {
        console.error('Error updating cursor:', error);
      }
    });

    // Handle text selection updates
    socket.on('selection-update', async (data: { articleId: string; userId: string; selection: TextSelection | null }) => {
      const { articleId, userId, selection } = data;

      try {
        // Update selection in database
        await prisma.collaborationSession.updateMany({
          where: {
            articleId,
            userId,
            socketId: socket.id,
          },
          data: {
            selection: selection as any, // Cast to any to satisfy Prisma JSON type
            lastActiveAt: new Date(),
          },
        });

        // Broadcast selection to others
        socket.to(`article:${articleId}`).emit('selection-changed', {
          userId,
          socketId: socket.id,
          selection,
        });
      } catch (error) {
        console.error('Error updating selection:', error);
      }
    });

    // Handle content changes (Yjs syncing)
    socket.on('content-change', async (data: ContentChange) => {
      const { articleId, userId, operations, version } = data;

      try {
        // Broadcast changes to others in the room
        socket.to(`article:${articleId}`).emit('content-updated', {
          userId,
          socketId: socket.id,
          operations,
          version,
        });

        // Update last active time
        await prisma.collaborationSession.updateMany({
          where: {
            articleId,
            userId,
            socketId: socket.id,
          },
          data: {
            lastActiveAt: new Date(),
          },
        });
      } catch (error) {
        console.error('Error syncing content:', error);
      }
    });

    // Handle article save
    socket.on('save-article', async (data: { articleId: string; userId: string; content: string; title: string }) => {
      const { articleId, userId, content, title } = data;

      try {
        // Update article in database
        const article = await prisma.article.findFirst({
          where: {
            id: articleId,
            OR: [
              { userId },
              {
                collaborators: {
                  some: {
                    userId,
                    role: { in: ['OWNER', 'EDITOR'] },
                    status: 'ACCEPTED',
                  },
                },
              },
            ],
          },
        });

        if (!article) {
          socket.emit('error', { message: 'Cannot save: Access denied' });
          return;
        }

        // Save the article
        await prisma.article.update({
          where: { id: articleId },
          data: {
            content,
            title,
            updatedAt: new Date(),
          },
        });

        // Create version
        const latestVersion = await prisma.articleVersion.findFirst({
          where: { articleId },
          orderBy: { version: 'desc' },
        });

        await prisma.articleVersion.create({
          data: {
            articleId,
            version: (latestVersion?.version || 0) + 1,
            content,
            title,
            createdBy: userId,
          },
        });

        // Notify all users that article was saved
        io!.to(`article:${articleId}`).emit('article-saved', {
          articleId,
          userId,
          timestamp: new Date(),
        });

        console.log(`Article ${articleId} saved by user ${userId}`);
      } catch (error) {
        console.error('Error saving article:', error);
        socket.emit('error', { message: 'Failed to save article' });
      }
    });

    // Handle leaving article
    socket.on('leave-article', async (data: { articleId: string; userId: string }) => {
      const { articleId, userId } = data;

      try {
        socket.leave(`article:${articleId}`);

        // Remove from active sessions
        if (activeSessions.has(articleId)) {
          activeSessions.get(articleId)!.delete(socket.id);
          if (activeSessions.get(articleId)!.size === 0) {
            activeSessions.delete(articleId);
          }
        }

        // Delete session from database
        await prisma.collaborationSession.deleteMany({
          where: {
            articleId,
            userId,
            socketId: socket.id,
          },
        });

        // Notify others that user left
        socket.to(`article:${articleId}`).emit('user-left', {
          articleId,
          userId,
          socketId: socket.id,
        });

        console.log(`User left article ${articleId}`);
      } catch (error) {
        console.error('Error leaving article:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);

      try {
        // Find all sessions for this socket
        const sessions = await prisma.collaborationSession.findMany({
          where: { socketId: socket.id },
        });

        // Notify all articles that this user left
        for (const session of sessions) {
          socket.to(`article:${session.articleId}`).emit('user-left', {
            articleId: session.articleId,
            userId: session.userId,
            socketId: socket.id,
          });

          // Remove from active sessions
          if (activeSessions.has(session.articleId)) {
            activeSessions.get(session.articleId)!.delete(socket.id);
            if (activeSessions.get(session.articleId)!.size === 0) {
              activeSessions.delete(session.articleId);
            }
          }
        }

        // Delete all sessions for this socket
        await prisma.collaborationSession.deleteMany({
          where: { socketId: socket.id },
        });
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });

  console.log('WebSocket server initialized');
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('WebSocket server not initialized');
  }
  return io;
}
