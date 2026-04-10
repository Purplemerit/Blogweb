/**
 * Retry Failed Publishes API
 * Retries all failed publish attempts that haven't exceeded max retries
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { PublishingService } from '@/lib/services/publishing.service';

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
    await authService.getCurrentUser(accessToken);

    // Retry failed publishes
    await PublishingService.retryFailedPublishes();

    return NextResponse.json({
      success: true,
      message: 'Failed publishes have been queued for retry',
    });
  } catch (error: any) {
    console.error('Retry failed publishes error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retry publishes',
      },
      { status: 500 }
    );
  }
}
