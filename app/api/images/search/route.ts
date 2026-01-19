/**
 * Unsplash Image Search API
 * Search for stock images from Unsplash
 */

import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export async function GET(request: NextRequest) {
    try {
        if (!UNSPLASH_ACCESS_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unsplash API key not configured',
                },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || 'nature';
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('per_page') || '12');

        // Search photos on Unsplash
        const response = await fetch(
            `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Unsplash API error:', errorData);
            return NextResponse.json(
                {
                    success: false,
                    error: errorData.errors?.[0] || 'Failed to fetch images from Unsplash',
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Transform Unsplash response to our format
        const images = data.results.map((photo: any) => ({
            id: photo.id,
            url: photo.urls.regular,
            thumbnail: photo.urls.small,
            width: photo.width,
            height: photo.height,
            alt: photo.alt_description || photo.description || query,
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html,
            downloadUrl: photo.links.download_location, // For tracking downloads
            source: 'unsplash',
        }));

        return NextResponse.json({
            success: true,
            data: {
                images,
                total: data.total,
                totalPages: data.total_pages,
                page,
                perPage,
            },
        });
    } catch (error: any) {
        console.error('Unsplash search error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to search images',
            },
            { status: 500 }
        );
    }
}
