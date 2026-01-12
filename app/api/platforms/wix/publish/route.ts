import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { WixService } from '@/lib/services/wix.service';
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
    const { articleId, status = 'PUBLISHED' } = body;

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

    // Get Wix connection
    const connection = await prisma.platformConnection.findFirst({
      where: {
        userId: currentUser.id,
        platform: 'WIX',
        status: 'CONNECTED',
      },
    });

    if (!connection) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wix site not connected. Please connect your account first.',
        },
        { status: 400 }
      );
    }

    // Parse credentials
    const credentials = JSON.parse(connection.credentials);
    let { accessToken: wixAccessToken, siteId, refreshToken } = credentials;

    // Try to publish with current token
    let result = await WixService.publishArticle({
      accessToken: wixAccessToken,
      siteId: siteId,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      status: status as 'PUBLISHED' | 'DRAFT',
      tags: article.articleTags?.map(at => at.tag.name) || [],
      featuredImage: article.featuredImage || '',
    });

    // If token expired, refresh and retry
    if (!result.success && result.error?.includes('401')) {
      const refreshResult = await WixService.refreshAccessToken(refreshToken);

      if (refreshResult.success && refreshResult.accessToken) {
        wixAccessToken = refreshResult.accessToken;

        // Update stored credentials
        const updatedCredentials = { ...credentials, accessToken: wixAccessToken };
        await prisma.platformConnection.update({
          where: { id: connection.id },
          data: {
            credentials: JSON.stringify(updatedCredentials),
          },
        });

        // Retry publish with new token
        result = await WixService.publishArticle({
          accessToken: wixAccessToken,
          siteId: siteId,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt || '',
          status: status as 'PUBLISHED' | 'DRAFT',
          tags: article.articleTags?.map(at => at.tag.name) || [],
          featuredImage: article.featuredImage || '',
        });
      }
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to publish to Wix',
        },
        { status: 500 }
      );
    }

    // Create publish record
    await prisma.publishRecord.create({
      data: {
        articleId: articleId,
        platformConnectionId: connection.id,
        platform: 'WIX',
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
      message: `Article ${status === 'PUBLISHED' ? 'published' : 'saved as draft'} on Wix`,
    });
  } catch (error: any) {
    console.error('Wix publish error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish to Wix',
      },
      { status: 500 }
    );
  }
}
