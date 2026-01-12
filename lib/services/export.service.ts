/**
 * Export Service
 * Handles exporting articles to various formats (PDF, DOCX, Markdown, HTML, JSON, CSV)
 */

import prisma from '@/lib/prisma';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import TurndownService from 'turndown';
import Papa from 'papaparse';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'markdown' | 'html' | 'json' | 'csv';
  includeMetadata?: boolean;
  includeImages?: boolean;
  includeTags?: boolean;
}

export interface BulkExportOptions extends ExportOptions {
  articleIds: string[];
  userId: string;
}

export class ExportService {
  /**
   * Export single article
   */
  static async exportArticle(
    articleId: string,
    userId: string,
    options: ExportOptions
  ): Promise<{ success: boolean; data?: Buffer | string; filename?: string; error?: string }> {
    try {
      // Get article with relations
      const article = await prisma.article.findFirst({
        where: {
          id: articleId,
          userId,
          deletedAt: null,
        },
        include: {
          articleTags: {
            include: {
              tag: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!article) {
        return {
          success: false,
          error: 'Article not found',
        };
      }

      let result: Buffer | string;
      let filename: string;

      switch (options.format) {
        case 'pdf':
          result = await this.exportToPDF(article, options);
          filename = `${this.sanitizeFilename(article.title)}.pdf`;
          break;

        case 'docx':
          result = await this.exportToDOCX(article, options);
          filename = `${this.sanitizeFilename(article.title)}.docx`;
          break;

        case 'markdown':
          result = this.exportToMarkdown(article, options);
          filename = `${this.sanitizeFilename(article.title)}.md`;
          break;

        case 'html':
          result = this.exportToHTML(article, options);
          filename = `${this.sanitizeFilename(article.title)}.html`;
          break;

        case 'json':
          result = this.exportToJSON(article, options);
          filename = `${this.sanitizeFilename(article.title)}.json`;
          break;

        default:
          return {
            success: false,
            error: 'Unsupported export format',
          };
      }

      return {
        success: true,
        data: result,
        filename,
      };
    } catch (error: any) {
      console.error('Export error:', error);
      return {
        success: false,
        error: error.message || 'Failed to export article',
      };
    }
  }

  /**
   * Bulk export articles
   */
  static async bulkExport(
    options: BulkExportOptions
  ): Promise<{ success: boolean; data?: Buffer | string; filename?: string; error?: string }> {
    try {
      // Get articles
      const articles = await prisma.article.findMany({
        where: {
          id: { in: options.articleIds },
          userId: options.userId,
          deletedAt: null,
        },
        include: {
          articleTags: {
            include: {
              tag: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (articles.length === 0) {
        return {
          success: false,
          error: 'No articles found',
        };
      }

      if (options.format === 'csv') {
        const result = this.exportToCSV(articles, options);
        return {
          success: true,
          data: result,
          filename: `articles_export_${Date.now()}.csv`,
        };
      } else if (options.format === 'json') {
        const result = JSON.stringify(
          articles.map((article) => this.prepareArticleData(article, options)),
          null,
          2
        );
        return {
          success: true,
          data: result,
          filename: `articles_export_${Date.now()}.json`,
        };
      } else {
        // For other formats, export individually and combine
        const exports = await Promise.all(
          articles.map((article) =>
            this.exportArticle(article.id, options.userId, {
              format: options.format,
              includeMetadata: options.includeMetadata,
              includeImages: options.includeImages,
              includeTags: options.includeTags,
            })
          )
        );

        // For now, return the first one (in production, you'd want to create a ZIP)
        // TODO: Implement ZIP creation for multiple files
        return exports[0];
      }
    } catch (error: any) {
      console.error('Bulk export error:', error);
      return {
        success: false,
        error: error.message || 'Failed to bulk export articles',
      };
    }
  }

  /**
   * Export to PDF (using HTML content)
   */
  private static async exportToPDF(article: any, options: ExportOptions): Promise<Buffer> {
    // For PDF generation, we'll use Puppeteer in the API route
    // This method prepares the HTML that will be converted to PDF
    const html = this.exportToHTML(article, options);
    return Buffer.from(html);
  }

  /**
   * Export to DOCX
   */
  private static async exportToDOCX(article: any, options: ExportOptions): Promise<Buffer> {
    const sections = [];

    // Title
    sections.push(
      new Paragraph({
        text: article.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    // Metadata
    if (options.includeMetadata) {
      if (article.user) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Author: ${article.user.name}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }

      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Published: ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );

      if (options.includeTags && article.articleTags.length > 0) {
        const tags = article.articleTags.map((at: any) => at.tag.name).join(', ');
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Tags: ${tags}`,
                size: 20,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
    }

    // Content - Convert HTML to plain text for DOCX
    const plainText = this.htmlToPlainText(article.content);
    const paragraphs = plainText.split('\n\n');

    paragraphs.forEach((para) => {
      if (para.trim()) {
        sections.push(
          new Paragraph({
            text: para.trim(),
            spacing: { after: 200 },
          })
        );
      }
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Export to Markdown
   */
  private static exportToMarkdown(article: any, options: ExportOptions): string {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });

    let markdown = '';

    // Title
    markdown += `# ${article.title}\n\n`;

    // Metadata
    if (options.includeMetadata) {
      if (article.user) {
        markdown += `**Author:** ${article.user.name}\n\n`;
      }

      markdown += `**Published:** ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}\n\n`;

      if (options.includeTags && article.articleTags.length > 0) {
        const tags = article.articleTags.map((at: any) => at.tag.name).join(', ');
        markdown += `**Tags:** ${tags}\n\n`;
      }

      markdown += '---\n\n';
    }

    // Content
    markdown += turndownService.turndown(article.content);

    return markdown;
  }

  /**
   * Export to HTML
   */
  private static exportToHTML(article: any, options: ExportOptions): string {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #1a1a1a;
    }
    .metadata {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #ddd;
    }
    .metadata p {
      margin: 0.5rem 0;
    }
    .content {
      font-size: 1.1rem;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    pre {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }
    code {
      background: #f5f5f5;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
  </style>
</head>
<body>
  <article>
    <h1>${article.title}</h1>
`;

    if (options.includeMetadata) {
      html += `    <div class="metadata">\n`;

      if (article.user) {
        html += `      <p><strong>Author:</strong> ${article.user.name}</p>\n`;
      }

      html += `      <p><strong>Published:</strong> ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}</p>\n`;

      if (options.includeTags && article.articleTags.length > 0) {
        const tags = article.articleTags.map((at: any) => at.tag.name).join(', ');
        html += `      <p><strong>Tags:</strong> ${tags}</p>\n`;
      }

      html += `    </div>\n`;
    }

    html += `    <div class="content">\n${article.content}\n    </div>\n`;
    html += `  </article>\n</body>\n</html>`;

    return html;
  }

  /**
   * Export to JSON
   */
  private static exportToJSON(article: any, options: ExportOptions): string {
    return JSON.stringify(this.prepareArticleData(article, options), null, 2);
  }

  /**
   * Export to CSV
   */
  private static exportToCSV(articles: any[], options: ExportOptions): string {
    const data = articles.map((article) => ({
      id: article.id,
      title: article.title,
      status: article.status,
      author: article.user?.name || '',
      published: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '',
      wordCount: article.wordCount,
      readingTime: article.readingTime,
      tags: options.includeTags
        ? article.articleTags.map((at: any) => at.tag.name).join('; ')
        : '',
      excerpt: article.excerpt || '',
      url: article.canonicalUrl || '',
      created: new Date(article.createdAt).toLocaleDateString(),
    }));

    return Papa.unparse(data);
  }

  /**
   * Prepare article data for export
   */
  private static prepareArticleData(article: any, options: ExportOptions): any {
    const data: any = {
      id: article.id,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      status: article.status,
    };

    if (options.includeMetadata) {
      data.wordCount = article.wordCount;
      data.readingTime = article.readingTime;
      data.publishedAt = article.publishedAt;
      data.createdAt = article.createdAt;
      data.updatedAt = article.updatedAt;
      data.author = article.user?.name;
      data.seoScore = article.seoScore;
      data.readabilityScore = article.readabilityScore;
    }

    if (options.includeTags) {
      data.tags = article.articleTags.map((at: any) => at.tag.name);
    }

    return data;
  }

  /**
   * Export analytics data to CSV
   */
  static async exportAnalytics(
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      platforms?: string[];
    }
  ): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    try {
      // Get publish records with analytics
      const where: any = {
        platformConnection: { userId },
        status: 'PUBLISHED',
      };

      if (options?.platforms && options.platforms.length > 0) {
        where.platform = { in: options.platforms };
      }

      if (options?.startDate || options?.endDate) {
        where.publishedAt = {};
        if (options.startDate) where.publishedAt.gte = options.startDate;
        if (options.endDate) where.publishedAt.lte = options.endDate;
      }

      const records = await prisma.publishRecord.findMany({
        where,
        include: {
          article: {
            select: {
              title: true,
              status: true,
              wordCount: true,
            },
          },
          analytics: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });

      const data = records.map((record) => ({
        articleTitle: record.article.title,
        platform: record.platform,
        publishedAt: record.publishedAt
          ? new Date(record.publishedAt).toLocaleDateString()
          : '',
        url: record.url || '',
        views: record.analytics?.views || 0,
        likes: record.analytics?.likes || 0,
        comments: record.analytics?.comments || 0,
        shares: record.analytics?.shares || 0,
        uniqueVisitors: record.analytics?.uniqueVisitors || 0,
        lastSynced: record.analytics?.lastSyncAt
          ? new Date(record.analytics.lastSyncAt).toLocaleDateString()
          : '',
      }));

      const csv = Papa.unparse(data);

      return {
        success: true,
        data: csv,
        filename: `analytics_export_${Date.now()}.csv`,
      };
    } catch (error: any) {
      console.error('Analytics export error:', error);
      return {
        success: false,
        error: error.message || 'Failed to export analytics',
      };
    }
  }

  /**
   * Sanitize filename
   */
  private static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase()
      .substring(0, 100);
  }

  /**
   * Convert HTML to plain text
   */
  private static htmlToPlainText(html: string): string {
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    return text.trim();
  }
}
