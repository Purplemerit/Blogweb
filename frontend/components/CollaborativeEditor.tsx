'use client';

/**
 * Collaborative Article Editor
 * Real-time collaborative editing with cursor tracking and presence indicators
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { marked } from 'marked';
import { theme } from '@/lib/theme';
import {
  Users,
  MessageSquare,
  Save,
  Clock,
  UserPlus,
  Eye,
  Edit3,
  CheckCircle,
  XCircle,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Quote,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Collaborator {
  id: string;
  userId: string;
  role: string;
  status: string;
  user: User;
  invitedAt: string;
  joinedAt?: string;
}

interface ActiveUser {
  userId: string;
  socketId: string;
  cursor?: { line: number; column: number };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

interface Comment {
  id: string;
  userId?: string;
  content: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface CollaborativeEditorProps {
  articleId: string;
  initialTitle: string;
  initialContent: string;
  currentUser: User;
  onSave?: (title: string, content: string) => void;
}

// Helper function to check if content is markdown
const isMarkdown = (content: string): boolean => {
  // Check for common markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/m,           // Headers
    /\*\*.*\*\*/,           // Bold
    /\*.*\*/,               // Italic
    /^\s*[-*+]\s/m,         // Unordered lists
    /^\s*\d+\.\s/m,         // Ordered lists
    /\[.*\]\(.*\)/,         // Links
    /```[\s\S]*```/,        // Code blocks
    /^\>/m,                 // Blockquotes
  ];

  return markdownPatterns.some(pattern => pattern.test(content));
};

// Helper function to convert markdown to HTML
const markdownToHtml = async (markdown: string): Promise<string> => {
  try {
    const html = await marked.parse(markdown);
    return html;
  } catch (error) {
    console.error('Error converting markdown:', error);
    return markdown;
  }
};

export default function CollaborativeEditor({
  articleId,
  initialTitle,
  initialContent,
  currentUser,
  onSave,
}: CollaborativeEditorProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('VIEWER');
  const [newComment, setNewComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [connected, setConnected] = useState(false);
  const [processedContent, setProcessedContent] = useState<string>('');

  // Process initial content (convert markdown to HTML if needed)
  useEffect(() => {
    const processContent = async () => {
      // Handle empty or undefined content
      if (!initialContent || initialContent.trim() === '') {
        setProcessedContent('');
        return;
      }

      if (isMarkdown(initialContent)) {
        const html = await markdownToHtml(initialContent);
        setProcessedContent(html);
      } else {
        setProcessedContent(initialContent);
      }
    };
    processContent();
  }, [initialContent]);

  // Initialize TipTap editor
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Color,
      TextStyle,
    ],
    content: processedContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[600px] px-6 py-4',
      },
    },
  });

  // Update editor content when processedContent changes
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      // Only update if content is different to avoid unnecessary re-renders
      const currentContent = editor.getHTML();
      if (currentContent !== processedContent) {
        editor.commands.setContent(processedContent || '');
      }
    }
  }, [editor, processedContent]);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socket',
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnected(true);

      // Join article room
      newSocket.emit('join-article', {
        articleId,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    });

    // Handle active users list
    newSocket.on('active-users', (data: { users: ActiveUser[] }) => {
      setActiveUsers(data.users);
    });

    // Handle user joined
    newSocket.on('user-joined', (data: any) => {
      console.log('User joined:', data.userName);
      setActiveUsers(prev => [...prev, {
        userId: data.userId,
        socketId: data.socketId,
      }]);
    });

    // Handle user left
    newSocket.on('user-left', (data: any) => {
      console.log('User left:', data.userId);
      setActiveUsers(prev => prev.filter(u => u.socketId !== data.socketId));
    });

    // Handle content updates
    newSocket.on('content-updated', (data: any) => {
      // Apply operations to content
      console.log('Content updated by another user');
      // In a real implementation, you'd use Yjs or similar for operational transformation
    });

    // Handle cursor movements
    newSocket.on('cursor-moved', (data: any) => {
      setActiveUsers(prev => prev.map(u =>
        u.socketId === data.socketId
          ? { ...u, cursor: data.cursor }
          : u
      ));
    });

    // Handle article saved
    newSocket.on('article-saved', (data: any) => {
      console.log('Article saved by another user');
      setLastSaved(new Date(data.timestamp));
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-article', {
        articleId,
        userId: currentUser.id,
      });
      newSocket.close();
    };
  }, [articleId, currentUser]);

  // Fetch collaborators
  useEffect(() => {
    fetchCollaborators();
  }, [articleId]);

  // Fetch comments
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, articleId]);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch(`/api/collaboration/invite?articleId=${articleId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCollaborators(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/collaboration/comments?articleId=${articleId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;

    try {
      const response = await fetch('/api/collaboration/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          articleId,
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (response.ok) {
        setInviteEmail('');
        setShowInviteModal(false);
        fetchCollaborators();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation');
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;

    try {
      const response = await fetch('/api/collaboration/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          articleId,
          content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSave = useCallback(async () => {
    if (!socket || !editor) return;

    const content = editor.getHTML();
    setSaving(true);
    socket.emit('save-article', {
      articleId,
      userId: currentUser.id,
      content,
      title,
    });

    if (onSave) {
      onSave(title, content);
    }

    setTimeout(() => {
      setSaving(false);
      setLastSaved(new Date());
    }, 1000);
  }, [socket, editor, articleId, currentUser.id, title, onSave]);

  // Handle editor updates
  useEffect(() => {
    if (!editor) return;

    const handler = () => {
      // Emit content change to other users
      if (socket && connected) {
        socket.emit('content-change', {
          articleId,
          userId: currentUser.id,
          operations: [], // Would contain Yjs operations in real implementation
          version: 1,
        });
      }
    };

    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, socket, connected, articleId, currentUser.id]);

  const getColorForUser = (userId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-orange-500',
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.surface,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: `1px solid ${theme.colors.border}`,
      }}>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[20px] font-semibold text-neutral-900 bg-transparent border-none focus:outline-none"
            placeholder="Article Title"
          />
          {connected && (
            <div className="flex items-center gap-2 text-[11px] text-emerald-600">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connected</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Active users */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-neutral-500" />
            <div className="flex -space-x-2">
              {activeUsers.slice(0, 5).map((user, index) => (
                <div
                  key={user.socketId}
                  className={`h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-semibold ${getColorForUser(user.userId)}`}
                  title={user.userId}
                >
                  {index + 1}
                </div>
              ))}
              {activeUsers.length > 5 && (
                <div className="h-8 w-8 rounded-full border-2 border-white bg-neutral-300 flex items-center justify-center text-neutral-700 text-[11px] font-semibold">
                  +{activeUsers.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Comments ({comments.length})
          </button>

          {/* Invite */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Invite
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </button>

          {lastSaved && (
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <Clock className="h-3 w-3" />
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Formatting Toolbar */}
          {editor && (
            <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-200 bg-neutral-50 overflow-x-auto">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('bold') ? 'bg-neutral-300' : ''}`}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('italic') ? 'bg-neutral-300' : ''}`}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-neutral-300 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-300' : ''}`}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-300' : ''}`}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-neutral-300 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('bulletList') ? 'bg-neutral-300' : ''}`}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('orderedList') ? 'bg-neutral-300' : ''}`}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-neutral-300 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('codeBlock') ? 'bg-neutral-300' : ''}`}
                title="Code Block"
              >
                <Code className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('blockquote') ? 'bg-neutral-300' : ''}`}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-80 border-l border-neutral-200 bg-neutral-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-neutral-900">Comments</h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Add comment */}
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Add a comment..."
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  className="mt-2 w-full px-4 py-2 text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                >
                  Add Comment
                </button>
              </div>

              {/* Comments list */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-white rounded-lg border border-neutral-200">
                    <p className="text-[13px] text-neutral-900">{comment.content}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      {comment.resolved && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle className="h-3 w-3" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-[18px] font-semibold text-neutral-900 mb-4">Invite Collaborator</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="colleague@example.com"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="VIEWER">Viewer (Can only view)</option>
                  <option value="COMMENTER">Commenter (Can view and comment)</option>
                  <option value="EDITOR">Editor (Can edit)</option>
                </select>
              </div>

              {/* Existing collaborators */}
              {collaborators.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-[13px] font-medium text-neutral-700 mb-2">Current Collaborators</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {collaborators.map((collab) => (
                      <div key={collab.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                        <div>
                          <p className="text-[13px] font-medium text-neutral-900">{collab.user.name}</p>
                          <p className="text-[11px] text-neutral-500">{collab.user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-neutral-600">{collab.role}</span>
                          {collab.status === 'ACCEPTED' ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 text-[13px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex-1 px-4 py-2 text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
