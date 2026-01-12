import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { updateProfileSchema } from '@/lib/utils/validation';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'No access token provided',
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.bio !== undefined && { bio: validatedData.bio || null }),
        ...(validatedData.avatar !== undefined && { avatar: validatedData.avatar || null }),
        ...(validatedData.website !== undefined && { website: validatedData.website || null }),
        ...(validatedData.twitterHandle !== undefined && { twitterHandle: validatedData.twitterHandle || null }),
        ...(validatedData.linkedinUrl !== undefined && { linkedinUrl: validatedData.linkedinUrl || null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        avatar: true,
        bio: true,
        website: true,
        twitterHandle: true,
        linkedinUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { user: updatedUser },
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
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

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update profile',
      },
      { status: 500 }
    );
  }
}
