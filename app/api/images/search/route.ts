import { NextRequest, NextResponse } from 'next/server'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('per_page') || '12'

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Call Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Transform the response to include only what we need
    const images = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      alt: photo.alt_description || photo.description || 'Unsplash image',
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      downloadUrl: photo.links.download_location,
    }))

    return NextResponse.json({
      success: true,
      data: {
        images,
        total: data.total,
        totalPages: data.total_pages,
      },
    })
  } catch (error: any) {
    console.error('Unsplash search error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search images' },
      { status: 500 }
    )
  }
}
