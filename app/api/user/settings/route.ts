import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { updateSettingsSchema } from '@/lib/utils/validation';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    // Get or create user settings
    let settings = await prisma.userSettings.findUnique({
      where: { userId: currentUser.id },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.userSettings.create({
        data: { userId: currentUser.id },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: { settings },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get settings',
      },
      { status: 500 }
    );
  }
}

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
    const validatedData = updateSettingsSchema.parse(body);

    // Update or create user settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: currentUser.id },
      update: validatedData,
      create: {
        userId: currentUser.id,
        ...validatedData,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { settings },
        message: 'Settings updated successfully',
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
        error: error.message || 'Failed to update settings',
      },
      { status: 500 }
    );
  }
}
