import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { WordPressService } from '@/lib/services/wordpress.service';
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
    const { articleId, status = 'publish' } = body;

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Get the article
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    if (article.userId !== currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get WordPress connection
    const connection = await prisma.platformConnection.findFirst({
      where: {
        userId: currentUser.id,
        platform: 'WORDPRESS',
        status: 'CONNECTED',
      },
    });

    if (!connection) {
      return NextResponse.json(
        {
          success: false,
          error: 'WordPress.com not connected. Please connect your account first.',
        },
        { status: 400 }
      );
    }

    // Parse credentials
    const credentials = JSON.parse(connection.credentials);
    const { accessToken: wpAccessToken, blogId } = credentials;

    // Publish to WordPress
    const result = await WordPressService.publishArticle({
      accessToken: wpAccessToken,
      blogId: blogId,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      status: status,
      featuredImage: article.featuredImage || '',
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to publish to WordPress.com',
        },
        { status: 500 }
      );
    }

    // Create publish record
    await prisma.publishRecord.create({
      data: {
        articleId: articleId,
        platformConnectionId: connection.id,
        platform: 'WORDPRESS',
        platformPostId: result.postId?.toString(),
        url: result.url,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // Update article status to PUBLISHED if currently DRAFT
    if (article.status === 'DRAFT') {
      await prisma.article.update({
        where: { id: articleId },
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
      message: 'Article published to WordPress.com successfully',
    });
  } catch (error: any) {
    console.error('WordPress publish error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish to WordPress.com',
      },
      { status: 500 }
    );
  }
}
