/**
 * Article Comments API
 * Create and manage comments on articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

// Create a comment
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    const body = await request.json();
    const { articleId, content, parentId, position } = body;

    if (!articleId || !content) {
      return NextResponse.json(
        { success: false, error: 'Article ID and content are required' },
        { status: 400 }
      );
    }

    // Verify user has access to the article
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        OR: [
          { userId: currentUser.id },
          {
            collaborators: {
              some: {
                userId: currentUser.id,
                status: 'ACCEPTED',
              },
            },
          },
        ],
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found or access denied' },
        { status: 404 }
      );
    }

    const comment = await prisma.articleComment.create({
      data: {
        articleId,
        userId: currentUser.id,
        content,
        parentId: parentId || null,
        position: position || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    console.error('Create comment API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create comment',
      },
      { status: 500 }
    );
  }
}

// Get comments for an article
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to the article
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        OR: [
          { userId: currentUser.id },
          {
            collaborators: {
              some: {
                userId: currentUser.id,
                status: 'ACCEPTED',
              },
            },
          },
        ],
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found or access denied' },
        { status: 404 }
      );
    }

    const comments = await prisma.articleComment.findMany({
      where: {
        articleId,
        parentId: null, // Only get top-level comments
      },
      include: {
        replies: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error: any) {
    console.error('Get comments API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get comments',
      },
      { status: 500 }
    );
  }
}

// Update comment (resolve/unresolve)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    const body = await request.json();
    const { commentId, resolved, content } = body;

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const comment = await prisma.articleComment.findUnique({
      where: { id: commentId },
      include: {
        article: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Only comment author or article owner can update
    if (comment.userId !== currentUser.id && comment.article.userId !== currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.articleComment.update({
      where: { id: commentId },
      data: {
        resolved: resolved !== undefined ? resolved : comment.resolved,
        content: content || comment.content,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedComment,
    });
  } catch (error: any) {
    console.error('Update comment API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update comment',
      },
      { status: 500 }
    );
  }
}

// Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const comment = await prisma.articleComment.findUnique({
      where: { id: commentId },
      include: {
        article: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Only comment author or article owner can delete
    if (comment.userId !== currentUser.id && comment.article.userId !== currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    await prisma.articleComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error: any) {
    console.error('Delete comment API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete comment',
      },
      { status: 500 }
    );
  }
}
