import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { DevToService } from '@/lib/services/devto.service';
import prisma from '@/lib/prisma';

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

    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API Key is required' },
        { status: 400 }
      );
    }

    // Validate the Dev.to API key
    const validation = await DevToService.validateApiKey(apiKey);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid Dev.to API key' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    const existingConnection = await prisma.platformConnection.findFirst({
      where: {
        userId: currentUser.id,
        platform: 'DEVTO',
        status: 'CONNECTED',
      },
    });

    if (existingConnection) {
      // Update existing connection
      await prisma.platformConnection.update({
        where: { id: existingConnection.id },
        data: {
          credentials: apiKey,
          metadata: {
            username: validation.username,
          },
          lastSyncAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Dev.to account updated successfully',
        data: {
          username: validation.username,
        },
      });
    }

    // Create new connection
    await prisma.platformConnection.create({
      data: {
        userId: currentUser.id,
        platform: 'DEVTO',
        credentials: apiKey,
        status: 'CONNECTED',
        metadata: {
          username: validation.username,
        },
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Dev.to account connected successfully',
      data: {
        username: validation.username,
      },
    });
  } catch (error: any) {
    console.error('Dev.to connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect Dev.to account',
      },
      { status: 500 }
    );
  }
}
