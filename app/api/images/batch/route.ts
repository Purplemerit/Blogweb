/**
 * Batch Image Operations API
 * Handle bulk image operations like batch delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { ImageService } from '@/lib/services/image.service';

// POST - Batch delete images
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
    const { imageIds, action } = body;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Image IDs array is required' },
        { status: 400 }
      );
    }

    if (action === 'delete') {
      const result = await ImageService.batchDeleteImages(imageIds, currentUser.id);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${result.deleted} image(s)`,
        data: {
          deleted: result.deleted,
          failed: result.failed,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Batch operation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to perform batch operation',
      },
      { status: 500 }
    );
  }
}
