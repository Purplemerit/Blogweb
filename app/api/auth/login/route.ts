import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { loginSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Login user
    const result = await authService.login(validatedData);

    // Set refresh token as HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      },
      { status: 200 }
    );

    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    const status =
      error.message === 'Invalid credentials'
        ? 401
        : error.message === 'Please verify your email first'
        ? 403
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to login',
      },
      { status }
    );
  }
}
