/**
 * Publishing Queue Processor API
 * Processes scheduled publishes and retries failed ones
 * This endpoint should be called by a cron job or scheduled task
 */

import { NextRequest, NextResponse } from 'next/server';
import { PublishingService } from '@/lib/services/publishing.service';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (optional security measure)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process scheduled publishes
    await PublishingService.processScheduledPublishes();

    return NextResponse.json({
      success: true,
      message: 'Scheduled publishes processed successfully',
    });
  } catch (error: any) {
    console.error('Queue processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process queue',
      },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger for queue processing (for development/testing)
 */
export async function GET(request: NextRequest) {
  try {
    // In production, you might want to remove this or add authentication
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'GET method not available in production' },
        { status: 405 }
      );
    }

    await PublishingService.processScheduledPublishes();

    return NextResponse.json({
      success: true,
      message: 'Queue processed successfully (dev mode)',
    });
  } catch (error: any) {
    console.error('Queue processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process queue',
      },
      { status: 500 }
    );
  }
}
