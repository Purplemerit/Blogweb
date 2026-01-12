/**
 * Fix Article Status API
 * Updates articles that have publish records but are still marked as DRAFT
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
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

    // Find all DRAFT articles that have published records
    const draftArticlesWithPublishRecords = await prisma.article.findMany({
      where: {
        userId: currentUser.id,
        status: 'DRAFT',
        publishRecords: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
      include: {
        publishRecords: {
          where: {
            status: 'PUBLISHED',
          },
          orderBy: {
            publishedAt: 'asc',
          },
          take: 1,
        },
      },
    });

    // Update each article to PUBLISHED status
    const updatePromises = draftArticlesWithPublishRecords.map((article) =>
      prisma.article.update({
        where: { id: article.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: article.publishRecords[0]?.publishedAt || new Date(),
        },
      })
    );

    const updatedArticles = await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedArticles.length} articles from DRAFT to PUBLISHED`,
      data: {
        count: updatedArticles.length,
        articleIds: updatedArticles.map(a => a.id),
      },
    });
  } catch (error: any) {
    console.error('Fix article status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fix article status',
      },
      { status: 500 }
    );
  }
}
