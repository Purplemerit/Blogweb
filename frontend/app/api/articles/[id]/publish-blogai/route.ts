/**
 * Toggle PublishType Public Publishing
 * Enable/disable showing article on Publish Type home page
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

// Helper function to extract first image URL from HTML content
function extractFirstImageFromContent(content: string): string | null {
  if (!content) return null;

  // Match <img> tags and extract src attribute
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = content.match(imgRegex);

  if (match && match[1]) {
    return match[1];
  }

  // Also try to find markdown-style images ![alt](url)
  const mdImgRegex = /!\[[^\]]*\]\(([^)]+)\)/;
  const mdMatch = content.match(mdImgRegex);

  if (mdMatch && mdMatch[1]) {
    return mdMatch[1];
  }

  return null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: articleId } = await params;
    const body = await request.json();
    const { isPublicOnPublishType } = body;

    // Verify article ownership
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

    // Only published articles can be shown on PublishType
    if (isPublicOnPublishType && article.status !== 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'Only published articles can be shown on Publish Type' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      isPublicOnPublishType,
    };

    // If publishing to PublishType and no cover image exists, extract from content
    if (isPublicOnPublishType && !article.coverImage) {
      const extractedImage = extractFirstImageFromContent(article.content);
      if (extractedImage) {
        updateData.coverImage = extractedImage;
        console.log('Extracted cover image from content:', extractedImage);
      } else if (article.featuredImage) {
        // Fall back to featuredImage if no image in content
        updateData.coverImage = article.featuredImage;
        console.log('Using featuredImage as cover:', article.featuredImage);
      }
    }

    // Update article
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
      select: {
        id: true,
        title: true,
        isPublicOnPublishType: true,
        status: true,
        coverImage: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: isPublicOnPublishType
        ? 'Article is now visible on Publish Type home page'
        : 'Article removed from Publish Type home page',
      data: updatedArticle,
    });
  } catch (error: any) {
    console.error('Publish to PublishType error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update Publish Type publishing status',
      },
      { status: 500 }
    );
  }
}
