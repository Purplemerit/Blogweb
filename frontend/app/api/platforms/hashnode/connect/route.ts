import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { HashnodeService } from '@/lib/services/hashnode.service';
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

    // Validate the Hashnode API key
    const validation = await HashnodeService.validateApiKey(apiKey);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid Hashnode API key' },
        { status: 400 }
      );
    }

    if (!validation.publicationId) {
      return NextResponse.json(
        { success: false, error: 'No Hashnode publication found. Please create a blog at hashnode.com first.' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    const existingConnection = await prisma.platformConnection.findFirst({
      where: {
        userId: currentUser.id,
        platform: 'HASHNODE',
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
            publicationId: validation.publicationId,
          },
          lastSyncAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Hashnode account updated successfully',
        data: {
          username: validation.username,
        },
      });
    }

    // Create new connection
    await prisma.platformConnection.create({
      data: {
        userId: currentUser.id,
        platform: 'HASHNODE',
        credentials: apiKey,
        status: 'CONNECTED',
        metadata: {
          username: validation.username,
          publicationId: validation.publicationId,
        },
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Hashnode account connected successfully',
      data: {
        username: validation.username,
      },
    });
  } catch (error: any) {
    console.error('Hashnode connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect Hashnode account',
      },
      { status: 500 }
    );
  }
}
