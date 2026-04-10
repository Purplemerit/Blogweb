import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { WixService } from '@/lib/services/wix.service';

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

    // Generate OAuth URL with user ID as state
    const authUrl = WixService.getAuthUrl(currentUser.id);

    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error: any) {
    console.error('Wix OAuth initiate error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initiate Wix OAuth',
      },
      { status: 500 }
    );
  }
}
