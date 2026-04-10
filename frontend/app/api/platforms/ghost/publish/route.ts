import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { GhostService } from '@/lib/services/ghost.service';
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
    const { articleId, status = 'draft' } = body;

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Get article from database
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        userId: currentUser.id,
        deletedAt: null,
      },
      include: {
        articleTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get Ghost connection
    const connection = await prisma.platformConnection.findFirst({
      where: {
        userId: currentUser.id,
        platform: 'GHOST',
        status: 'CONNECTED',
      },
    });

    if (!connection) {
      return NextResponse.json(
        { success: false, error: 'Ghost site not connected' },
        { status: 400 }
      );
    }

    const { apiUrl } = connection.metadata as { apiUrl: string };
    const adminApiKey = connection.credentials;

    if (!apiUrl || !adminApiKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid Ghost connection data' },
        { status: 400 }
      );
    }

    // Extract tags
    const tags = article.articleTags?.map(at => at.tag.name) || [];

    // Publish to Ghost
    const result = await GhostService.publishArticle({
      apiUrl,
      adminApiKey,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || undefined,
      status: status as 'draft' | 'published',
      tags,
      featured: false,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Create publish record
    await prisma.publishRecord.create({
      data: {
        articleId: article.id,
        platformConnectionId: connection.id,
        platform: 'GHOST',
        platformPostId: result.postId || '',
        url: result.url || '',
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // Update article status to PUBLISHED if currently DRAFT
    if (article.status === 'DRAFT') {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        postId: result.postId,
        url: result.url,
      },
      message: `Article ${status === 'published' ? 'published' : 'saved as draft'} on Ghost`,
    });
  } catch (error: any) {
    console.error('Ghost publish error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish to Ghost',
      },
      { status: 500 }
    );
  }
}
