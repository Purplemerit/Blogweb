/**
 * Image Upload API
 * Handles file uploads with validation, optimization, and storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { ImageService } from '@/lib/services/image.service';

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

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const articleId = formData.get('articleId') as string | null;
    const alt = formData.get('alt') as string | null;
    const caption = formData.get('caption') as string | null;
    const optimize = formData.get('optimize') === 'true';
    const maxWidth = formData.get('maxWidth')
      ? parseInt(formData.get('maxWidth') as string)
      : undefined;
    const maxHeight = formData.get('maxHeight')
      ? parseInt(formData.get('maxHeight') as string)
      : undefined;
    const quality = formData.get('quality')
      ? parseInt(formData.get('quality') as string)
      : undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload image
    const result = await ImageService.uploadImage(file, {
      userId: currentUser.id,
      articleId: articleId || undefined,
      alt: alt || undefined,
      caption: caption || undefined,
      optimize,
      maxWidth,
      maxHeight,
      quality,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: result.data,
    });
  } catch (error: any) {
    console.error('Image upload API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}

// GET - Get user's images
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
    const articleId = searchParams.get('articleId') || undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : 50;
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset')!)
      : 0;
    const source = searchParams.get('source') as any;

    const result = await ImageService.getUserImages(currentUser.id, {
      articleId,
      limit,
      offset,
      source,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error('Get images API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get images',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete image
export async function DELETE(request: NextRequest) {
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
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const result = await ImageService.deleteImage(imageId, currentUser.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete image API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete image',
      },
      { status: 500 }
    );
  }
}

// PUT - Update image metadata
export async function PUT(request: NextRequest) {
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
    const { imageId, alt, caption, articleId } = body;

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const result = await ImageService.updateImage(imageId, currentUser.id, {
      alt,
      caption,
      articleId,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image updated successfully',
      data: result.data,
    });
  } catch (error: any) {
    console.error('Update image API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update image',
      },
      { status: 500 }
    );
  }
}
