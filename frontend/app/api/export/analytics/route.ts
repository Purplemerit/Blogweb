/**
 * Analytics Export API
 * Export analytics data to CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { ExportService } from '@/lib/services/export.service';

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

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;
    const platforms = searchParams.get('platforms')?.split(',');

    const result = await ExportService.exportAnalytics(currentUser.id, {
      startDate,
      endDate,
      platforms,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return new NextResponse(result.data, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Analytics export API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to export analytics',
      },
      { status: 500 }
    );
  }
}
