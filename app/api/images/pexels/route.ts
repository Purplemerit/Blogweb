/**
 * Pexels Image Search API
 * Search for stock images from Pexels
 */

import { NextRequest, NextResponse } from 'next/server';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1';

export async function GET(request: NextRequest) {
    try {
        if (!PEXELS_API_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Pexels API key not configured',
                },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || 'nature';
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('per_page') || '12');

        // Search photos on Pexels
        const response = await fetch(
            `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`,
            {
                headers: {
                    Authorization: PEXELS_API_KEY,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Pexels API error:', errorText);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to fetch images from Pexels',
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Transform Pexels response to our format
        const images = data.photos.map((photo: any) => ({
            id: photo.id.toString(),
            url: photo.src.large,
            thumbnail: photo.src.medium,
            width: photo.width,
            height: photo.height,
            alt: photo.alt || query,
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
            source: 'pexels',
        }));

        return NextResponse.json({
            success: true,
            data: {
                images,
                total: data.total_results,
                totalPages: Math.ceil(data.total_results / perPage),
                page,
                perPage,
            },
        });
    } catch (error: any) {
        console.error('Pexels search error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to search images',
            },
            { status: 500 }
        );
    }
}
