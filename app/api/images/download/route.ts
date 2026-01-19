/**
 * Unsplash Download Tracking API
 * Track image downloads as required by Unsplash API guidelines
 */

import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { downloadUrl } = body;

        if (!downloadUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Download URL is required',
                },
                { status: 400 }
            );
        }

        // Trigger download tracking on Unsplash
        // This is required by Unsplash API guidelines
        const response = await fetch(downloadUrl, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        });

        if (!response.ok) {
            console.error('Unsplash download tracking failed:', response.statusText);
        }

        return NextResponse.json({
            success: true,
            message: 'Download tracked successfully',
        });
    } catch (error: any) {
        console.error('Unsplash download tracking error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to track download',
            },
            { status: 500 }
        );
    }
}
