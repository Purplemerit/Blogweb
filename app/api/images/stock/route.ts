/**
 * Stock Image Search API
 * Search and download stock images from Pexels and Unsplash
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';
import { CloudinaryService } from '@/lib/services/cloudinary.service';

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
    await authService.getCurrentUser(accessToken);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'nature';
    const provider = searchParams.get('provider') || 'pexels'; // pexels or unsplash
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '15');

    let results: any[] = [];
    let total = 0;

    if (provider === 'unsplash') {
      // Unsplash API
      const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

      if (!unsplashKey) {
        return NextResponse.json(
          { success: false, error: 'Unsplash API key not configured' },
          { status: 500 }
        );
      }

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': `Client-ID ${unsplashKey}`,
          },
        }
      );

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch Unsplash images' },
          { status: response.status }
        );
      }

      const data = await response.json();
      total = data.total;

      results = data.results.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.thumb,
        width: photo.width,
        height: photo.height,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        description: photo.description || photo.alt_description,
        downloadUrl: photo.links.download,
        provider: 'unsplash',
      }));
    } else {
      // Pexels API
      const pexelsKey = process.env.PEXELS_API_KEY;

      if (!pexelsKey) {
        return NextResponse.json(
          { success: false, error: 'Pexels API key not configured' },
          { status: 500 }
        );
      }

      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': pexelsKey,
          },
        }
      );

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch Pexels images' },
          { status: response.status }
        );
      }

      const data = await response.json();
      total = data.total_results;

      results = data.photos.map((photo: any) => ({
        id: photo.id,
        url: photo.src.large,
        thumbnailUrl: photo.src.medium,
        width: photo.width,
        height: photo.height,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        description: photo.alt,
        downloadUrl: photo.src.original,
        provider: 'pexels',
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        results,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error: any) {
    console.error('Stock image search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to search stock images',
      },
      { status: 500 }
    );
  }
}

// POST - Download and save stock image
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
    const {
      imageUrl,
      provider,
      articleId,
      alt,
      caption,
      photographer,
      photographerUrl,
    } = body;

    if (!imageUrl || !provider) {
      return NextResponse.json(
        { success: false, error: 'Image URL and provider are required' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const uploadResult = await CloudinaryService.uploadFromUrl(imageUrl, {
      folder: `blogweb/stock-${provider}`,
      filename: `stock_${provider}_${Date.now()}`,
    });

    if (!uploadResult.success || !uploadResult.data) {
      return NextResponse.json(
        { success: false, error: 'Failed to upload stock image' },
        { status: 500 }
      );
    }

    // Determine source
    const source =
      provider === 'unsplash' ? 'STOCK_UNSPLASH' : 'STOCK_PEXELS';

    // Save to database
    const image = await prisma.image.create({
      data: {
        userId: currentUser.id,
        articleId: articleId || null,
        url: uploadResult.data.secureUrl,
        thumbnailUrl: uploadResult.data.thumbnailUrl,
        filename: `stock_${provider}_${Date.now()}.jpg`,
        mimeType: 'image/jpeg',
        size: uploadResult.data.bytes,
        width: uploadResult.data.width,
        height: uploadResult.data.height,
        alt: alt || caption || 'Stock image',
        caption:
          caption ||
          `Photo by ${photographer} on ${provider === 'unsplash' ? 'Unsplash' : 'Pexels'}`,
        source,
      },
    });

    // Update usage stats
    await prisma.usageStats.upsert({
      where: { userId: currentUser.id },
      update: {
        imagesGeneratedThisMonth: { increment: 1 },
      },
      create: {
        userId: currentUser.id,
        imagesGeneratedThisMonth: 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Stock image saved successfully',
      data: {
        ...image,
        photographer,
        photographerUrl,
      },
    });
  } catch (error: any) {
    console.error('Stock image download error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to download stock image',
      },
      { status: 500 }
    );
  }
}
