/**
 * Stock Images API (Unified Pexels + Unsplash)
 * Handles searching and downloading from multiple stock image providers
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// GET - Search stock images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'nature';
    const provider = searchParams.get('provider') || 'pexels';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = 12;

    let results = [];

    if (provider === 'pexels') {
      if (!PEXELS_API_KEY) {
        return NextResponse.json(
          { success: false, error: 'Pexels API key not configured' },
          { status: 500 }
        );
      }

      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Pexels API request failed');
      }

      const data = await response.json();
      results = data.photos.map((photo: any) => ({
        id: photo.id.toString(),
        url: photo.src.large,
        thumbnailUrl: photo.src.medium,
        width: photo.width,
        height: photo.height,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        description: photo.alt || query,
        provider: 'pexels',
      }));
    } else if (provider === 'unsplash') {
      if (!UNSPLASH_ACCESS_KEY) {
        return NextResponse.json(
          { success: false, error: 'Unsplash API key not configured' },
          { status: 500 }
        );
      }

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Unsplash API request failed');
      }

      const data = await response.json();
      results = data.results.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.small,
        width: photo.width,
        height: photo.height,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        description: photo.alt_description || photo.description || query,
        provider: 'unsplash',
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        results,
        total: results.length,
        page,
      },
    });
  } catch (error: any) {
    console.error('Stock images search error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search stock images' },
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
    const { imageUrl, provider, articleId, alt, photographer, photographerUrl } = body;

    // For now, just return the image URL directly without downloading
    // This allows immediate use in the editor
    const imageData = {
      id: `stock-${Date.now()}`,
      url: imageUrl,
      thumbnailUrl: imageUrl,
      filename: `${provider}-${Date.now()}.jpg`,
      width: 1920,
      height: 1080,
      size: 0,
      alt: alt || 'Stock image',
      caption: `Photo by ${photographer}`,
      source: provider === 'pexels' ? 'STOCK_PEXELS' : 'STOCK_UNSPLASH',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: imageData,
      message: 'Image ready to use',
    });
  } catch (error: any) {
    console.error('Stock image download error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process stock image' },
      { status: 500 }
    );
  }
}
