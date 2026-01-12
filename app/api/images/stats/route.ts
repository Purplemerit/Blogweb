/**
 * Image Statistics API
 * Get image usage statistics and analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { ImageService } from '@/lib/services/image.service';

export async function GET(request: NextRequest) {
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

    const result = await ImageService.getImageStats(currentUser.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error('Get image stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get image statistics',
      },
      { status: 500 }
    );
  }
}
