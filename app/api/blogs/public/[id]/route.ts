/**
 * Public Blog Article API
 * Get a single published blog by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;

    // Fetch single article directly by ID - much faster than fetching all
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        status: 'PUBLISHED',
        isPublicOnPublishType: true,
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        slug: true,
        coverImage: true,
        publishedAt: true,
        readTime: true,
        wordCount: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article not found',
        },
        { status: 404 }
      );
    }

    // Update Analytics asynchronously
    const recordView = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Increment total views on Article
        await prisma.article.update({
          where: { id: articleId },
          data: { views: { increment: 1 } },
        });

        // 2. Track detailed analytics for PublishType platform
        await prisma.analytics.upsert({
          where: {
            articleId_platform_date: {
              articleId,
              platform: 'PUBLISHTYPE',
              date: today,
            },
          },
          update: {
            views: { increment: 1 },
          },
          create: {
            articleId,
            platform: 'PUBLISHTYPE',
            date: today,
            views: 1,
            uniqueVisitors: 1,
          },
        });
      } catch (err) {
        console.error('Failed to record analytics:', err);
      }
    };

    recordView();

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    console.error('Public blog article API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch article',
      },
      { status: 500 }
    );
  }
}
