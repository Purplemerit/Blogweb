/**
 * My Invitations API
 * Get all collaboration invitations for the current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

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

    const invitations = await prisma.articleCollaborator.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            excerpt: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        invitedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: invitations,
    });
  } catch (error: any) {
    console.error('Get my invitations API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get invitations',
      },
      { status: 500 }
    );
  }
}
