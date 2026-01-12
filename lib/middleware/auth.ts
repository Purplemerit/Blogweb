import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - No token provided',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Call the actual handler with the userId
    return await handler(request, payload.userId);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized - Invalid token',
      },
      { status: 401 }
    );
  }
}

export async function requireAuth(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    return payload.userId;
  } catch (error) {
    return null;
  }
}
