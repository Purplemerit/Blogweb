/**
 * Collaboration Invitation API
 * Send and manage collaboration invitations for articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';
import { CollaboratorRole } from '@prisma/client';

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
    const { articleId, email, role = 'VIEWER' } = body;

    if (!articleId || !email) {
      return NextResponse.json(
        { success: false, error: 'Article ID and email are required' },
        { status: 400 }
      );
    }

    // Verify the article exists and user has permission
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        userId: currentUser.id,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found or access denied' },
        { status: 404 }
      );
    }

    // Find the user to invite
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email not found' },
        { status: 404 }
      );
    }

    // Check if already invited
    const existingCollaborator = await prisma.articleCollaborator.findUnique({
      where: {
        articleId_userId: {
          articleId,
          userId: invitedUser.id,
        },
      },
    });

    if (existingCollaborator) {
      return NextResponse.json(
        { success: false, error: 'User is already a collaborator' },
        { status: 400 }
      );
    }

    // Create the invitation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const collaborator = await prisma.articleCollaborator.create({
      data: {
        articleId,
        userId: invitedUser.id,
        role: role as CollaboratorRole,
        invitedBy: currentUser.id,
        status: 'PENDING',
        expiresAt,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // TODO: Send email invitation
    // await sendInvitationEmail(invitedUser.email, article.title, currentUser.name);

    return NextResponse.json({
      success: true,
      data: collaborator,
    });
  } catch (error: any) {
    console.error('Collaboration invite API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send invitation',
      },
      { status: 500 }
    );
  }
}

// Get all invitations for an article
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

    // Verify access
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        userId: currentUser.id,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found or access denied' },
        { status: 404 }
      );
    }

    const collaborators = await prisma.articleCollaborator.findMany({
      where: { articleId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        invitedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: collaborators,
    });
  } catch (error: any) {
    console.error('Get collaborators API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get collaborators',
      },
      { status: 500 }
    );
  }
}

// Delete/revoke invitation
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
    const collaboratorId = searchParams.get('collaboratorId');

    if (!collaboratorId) {
      return NextResponse.json(
        { success: false, error: 'Collaborator ID is required' },
        { status: 400 }
      );
    }

    // Get the collaborator record
    const collaborator = await prisma.articleCollaborator.findUnique({
      where: { id: collaboratorId },
      include: {
        article: true,
      },
    });

    if (!collaborator) {
      return NextResponse.json(
        { success: false, error: 'Collaborator not found' },
        { status: 404 }
      );
    }

    // Verify the current user is the article owner
    if (collaborator.article.userId !== currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    await prisma.articleCollaborator.delete({
      where: { id: collaboratorId },
    });

    return NextResponse.json({
      success: true,
      message: 'Collaborator removed',
    });
  } catch (error: any) {
    console.error('Delete collaborator API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove collaborator',
      },
      { status: 500 }
    );
  }
}
