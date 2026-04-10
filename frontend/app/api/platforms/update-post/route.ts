/**
 * Update Published Post API
 * Updates an already published article on a specific platform
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { PublishingService, Platform } from '@/lib/services/publishing.service';

export async function PUT(request: NextRequest) {
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
    const { articleId, platform } = body;

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    if (!platform) {
      return NextResponse.json(
        { success: false, error: 'Platform is required' },
        { status: 400 }
      );
    }

    // Validate platform
    const validPlatforms: Platform[] = ['DEVTO', 'HASHNODE', 'GHOST', 'WORDPRESS', 'WIX'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { success: false, error: `Invalid platform: ${platform}` },
        { status: 400 }
      );
    }

    // Update the published post
    const result = await PublishingService.updatePublishedPost({
      articleId,
      userId: currentUser.id,
      platform,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update post' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Post updated successfully on ${platform}`,
      data: {
        platform: result.platform,
        postId: result.postId,
        url: result.url,
      },
    });
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update published post',
      },
      { status: 500 }
    );
  }
}

/**
 * Update post on multiple platforms
 */
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
    const { articleId, platforms } = body;

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one platform is required' },
        { status: 400 }
      );
    }

    // Update on all platforms in parallel
    const updatePromises = platforms.map((platform: Platform) =>
      PublishingService.updatePublishedPost({
        articleId,
        userId: currentUser.id,
        platform,
      })
    );

    const results = await Promise.all(updatePromises);

    // Count successes and failures
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      success: successful.length > 0,
      message: `Updated on ${successful.length}/${platforms.length} platform(s)`,
      data: {
        results,
        summary: {
          total: results.length,
          successful: successful.length,
          failed: failed.length,
        },
      },
    });
  } catch (error: any) {
    console.error('Multi-platform update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update posts',
      },
      { status: 500 }
    );
  }
}
