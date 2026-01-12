import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { GhostService } from '@/lib/services/ghost.service';
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
    const { apiUrl, adminApiKey } = body;

    if (!apiUrl || !adminApiKey) {
      return NextResponse.json(
        { success: false, error: 'API URL and Admin API Key are required' },
        { status: 400 }
      );
    }

    // Validate the Ghost connection
    const validation = await GhostService.validateConnection(apiUrl, adminApiKey);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid Ghost credentials' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    const existingConnection = await prisma.platformConnection.findFirst({
      where: {
        userId: currentUser.id,
        platform: 'GHOST',
        status: 'CONNECTED',
      },
    });

    if (existingConnection) {
      // Update existing connection
      await prisma.platformConnection.update({
        where: { id: existingConnection.id },
        data: {
          credentials: adminApiKey,
          metadata: {
            apiUrl,
            siteName: validation.siteName,
          },
          lastSyncAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Ghost site updated successfully',
        data: {
          siteName: validation.siteName,
        },
      });
    }

    // Create new connection
    await prisma.platformConnection.create({
      data: {
        userId: currentUser.id,
        platform: 'GHOST',
        credentials: adminApiKey,
        status: 'CONNECTED',
        metadata: {
          apiUrl,
          siteName: validation.siteName,
        },
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Ghost site connected successfully',
      data: {
        siteName: validation.siteName,
      },
    });
  } catch (error: any) {
    console.error('Ghost connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect Ghost site',
      },
      { status: 500 }
    );
  }
}
