/**
 * Publish article to PublishType (own website)
 * Sets isPublicOnPublishType flag to make article visible on /blog page
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

export async function POST(
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

    const body = await request.json();
    const { isPublicOnPublishType } = body;

    // Verify article exists and user owns it
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        userId: currentUser.id,
        deletedAt: null,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found or you do not have access' },
        { status: 404 }
      );
    }

    // Check if article is published
    if (article.status !== 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'Article must be published before making it public on PublishType' },
        { status: 400 }
      );
    }

    // Extract first image from content for cover image if not already set
    let coverImage = article.coverImage;
    if (!coverImage && article.content) {
      // Extract first image from HTML content
      const imgMatch = article.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        coverImage = imgMatch[1];
      }
    }

    // Update the article to make it public on PublishType
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        isPublicOnPublishType: isPublicOnPublishType !== undefined ? isPublicOnPublishType : true,
        ...(coverImage && { coverImage }), // Set cover image if found
      },
    });

    // Note: PublishRecord creation skipped for PublishType (built-in platform)
    // PublishType doesn't require a platform connection, so we can't create a record
    // The isPublicOnPublishType flag is sufficient to track publishing status

    const blogUrl = `${process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/blog/${articleId}`;

    return NextResponse.json({
      success: true,
      data: {
        article: updatedArticle,
        url: blogUrl,
      },
      message: 'Article published to Publish Type successfully',
    });
  } catch (error: any) {
    console.error('Publish to PublishType error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish to PublishType',
      },
      { status: 500 }
    );
  }
}
