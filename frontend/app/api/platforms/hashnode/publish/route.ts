import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { HashnodeService } from '@/lib/services/hashnode.service';
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
    const { articleId } = body;

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

    // Get Hashnode connection
    const connection = await prisma.platformConnection.findFirst({
      where: {
        userId: currentUser.id,
        platform: 'HASHNODE',
        status: 'CONNECTED',
      },
    });

    if (!connection) {
      return NextResponse.json(
        { success: false, error: 'Hashnode account not connected' },
        { status: 400 }
      );
    }

    const apiKey = connection.credentials;
    const { publicationId } = connection.metadata as { publicationId: string };

    if (!apiKey || !publicationId) {
      return NextResponse.json(
        { success: false, error: 'Invalid Hashnode connection data' },
        { status: 400 }
      );
    }

    // Extract tags
    const tags = article.articleTags?.map(at => at.tag.name) || [];

    // Convert HTML to Markdown
    const markdownContent = HashnodeService.htmlToMarkdown(article.content);

    // Publish to Hashnode
    const result = await HashnodeService.publishArticle({
      apiKey,
      publicationId,
      title: article.title,
      content: markdownContent,
      tags,
      subtitle: article.excerpt || undefined,
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
        platform: 'HASHNODE',
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
      message: 'Article published on Hashnode',
    });
  } catch (error: any) {
    console.error('Hashnode publish error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish to Hashnode',
      },
      { status: 500 }
    );
  }
}
