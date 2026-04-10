import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'No refresh token provided',
        },
        { status: 401 }
      );
    }

    const result = await authService.refreshAccessToken(refreshToken);

    return NextResponse.json(
      {
        success: true,
        data: {
          accessToken: result.accessToken,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to refresh token',
      },
      { status: 401 }
    );
  }
}
