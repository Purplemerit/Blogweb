/**
 * Bulk Export API
 * Export multiple articles at once
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { ExportService } from '@/lib/services/export.service';

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
      articleIds,
      format = 'csv',
      includeMetadata = true,
      includeImages = false,
      includeTags = true,
    } = body;

    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Article IDs array is required' },
        { status: 400 }
      );
    }

    const result = await ExportService.bulkExport({
      articleIds,
      userId: currentUser.id,
      format,
      includeMetadata,
      includeImages,
      includeTags,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Determine content type
    let contentType = 'application/octet-stream';
    switch (format) {
      case 'csv':
        contentType = 'text/csv';
        break;
      case 'json':
        contentType = 'application/json';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }

    return new NextResponse(result.data as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Bulk export API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to bulk export articles',
      },
      { status: 500 }
    );
  }
}
