import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { DevToService } from '@/lib/services/devto.service';
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
    const { articleId, published = true } = body;

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

    // Get Dev.to connection
    const connection = await prisma.platformConnection.findFirst({
      where: {
        userId: currentUser.id,
        platform: 'DEVTO',
        status: 'CONNECTED',
      },
    });

    if (!connection) {
      return NextResponse.json(
        { success: false, error: 'Dev.to account not connected' },
        { status: 400 }
      );
    }

    const apiKey = connection.credentials;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid Dev.to connection data' },
        { status: 400 }
      );
    }

    // Extract tags (Dev.to allows max 4)
    const tags = article.articleTags?.map(at => at.tag.name).slice(0, 4) || [];

    // Convert HTML to Markdown
    const markdownContent = DevToService.htmlToMarkdown(article.content);

    // Publish to Dev.to
    const result = await DevToService.publishArticle({
      apiKey,
      title: article.title,
      content: markdownContent,
      tags,
      published,
      description: article.excerpt || undefined,
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
        platform: 'DEVTO',
        platformPostId: result.postId?.toString() || '',
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
      message: `Article ${published ? 'published' : 'saved as draft'} on Dev.to`,
    });
  } catch (error: any) {
    console.error('Dev.to publish error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish to Dev.to',
      },
      { status: 500 }
    );
  }
}
