/**
 * Accept Collaboration Invitation API
 * Allow users to accept invitations to collaborate on articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

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
    const { collaboratorId } = body;

    if (!collaboratorId) {
      return NextResponse.json(
        { success: false, error: 'Collaborator ID is required' },
        { status: 400 }
      );
    }

    // Find the invitation
    const collaborator = await prisma.articleCollaborator.findUnique({
      where: { id: collaboratorId },
    });

    if (!collaborator) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Verify this invitation is for the current user
    if (collaborator.userId !== currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'This invitation is not for you' },
        { status: 403 }
      );
    }

    // Check if invitation has expired
    if (collaborator.expiresAt && new Date() > collaborator.expiresAt) {
      await prisma.articleCollaborator.update({
        where: { id: collaboratorId },
        data: { status: 'EXPIRED' },
      });

      return NextResponse.json(
        { success: false, error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    // Accept the invitation
    const updatedCollaborator = await prisma.articleCollaborator.update({
      where: { id: collaboratorId },
      data: {
        status: 'ACCEPTED',
        joinedAt: new Date(),
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            content: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCollaborator,
    });
  } catch (error: any) {
    console.error('Accept invitation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to accept invitation',
      },
      { status: 500 }
    );
  }
}
