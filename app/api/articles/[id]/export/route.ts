/**
 * Article Export API
 * Export single article to various formats
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { ExportService } from '@/lib/services/export.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    const format = (searchParams.get('format') || 'pdf') as any;
    const includeMetadata = searchParams.get('includeMetadata') !== 'false';
    const includeImages = searchParams.get('includeImages') !== 'false';
    const includeTags = searchParams.get('includeTags') !== 'false';

    const result = await ExportService.exportArticle(id, currentUser.id, {
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
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'markdown':
        contentType = 'text/markdown';
        break;
      case 'html':
        contentType = 'text/html';
        break;
      case 'json':
        contentType = 'application/json';
        break;
      case 'csv':
        contentType = 'text/csv';
        break;
    }

    // For PDF, we need to convert HTML to PDF using Puppeteer
    let fileData: Buffer | string = result.data!;

    if (format === 'pdf' && typeof result.data === 'string') {
      // Use Puppeteer to convert HTML to PDF
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(result.data as string, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
        printBackground: true,
      });

      await browser.close();
      fileData = Buffer.from(pdfBuffer);
    }

    // Return file
    return new NextResponse(fileData as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to export article',
      },
      { status: 500 }
    );
  }
}
