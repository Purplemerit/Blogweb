import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Get article to verify ownership
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        userId: currentUser.id,
        deletedAt: null,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get all publish records for this article
    const publishRecords = await prisma.publishRecord.findMany({
      where: {
        articleId,
      },
      include: {
        platformConnection: {
          select: {
            platform: true,
            metadata: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        publishes: publishRecords,
      },
    });
  } catch (error: any) {
    console.error('Get publish records error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch publish records',
      },
      { status: 500 }
    );
  }
}
