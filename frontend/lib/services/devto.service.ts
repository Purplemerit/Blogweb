export interface DevToPublishParams {
  apiKey: string;
  title: string;
  content: string;
  tags?: string[];
  published?: boolean;
  canonical_url?: string;
  description?: string;
  cover_image?: string;
}

export interface DevToPostResponse {
  success: boolean;
  postId?: number;
  url?: string;
  error?: string;
}

export class DevToService {
  /**
   * Validate Dev.to API key
   */
  static async validateApiKey(apiKey: string): Promise<{ valid: boolean; username?: string; error?: string }> {
    try {
      const response = await fetch('https://dev.to/api/users/me', {
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          valid: false,
          error: response.status === 401 ? 'Invalid API key' : `Failed to validate: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        valid: true,
        username: data.username,
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message || 'Failed to validate API key',
      };
    }
  }

  /**
   * Publish article to Dev.to
   */
  static async publishArticle(params: DevToPublishParams): Promise<DevToPostResponse> {
    try {
      const { apiKey, title, content, tags = [], published = true, canonical_url, description, cover_image } = params;

      const articleData = {
        article: {
          title,
          body_markdown: content,
          published,
          tags: tags.slice(0, 4), // Dev.to allows max 4 tags
          ...(description && { description }),
          ...(canonical_url && { canonical_url }),
          ...(cover_image && { main_image: cover_image }),
        },
      };

      const response = await fetch('https://dev.to/api/articles', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `Failed to publish: ${response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        postId: data.id,
        url: data.url,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to publish to Dev.to',
      };
    }
  }

  /**
   * Update existing Dev.to article
   */
  static async updateArticle(
    apiKey: string,
    articleId: number,
    params: Partial<DevToPublishParams>
  ): Promise<DevToPostResponse> {
    try {
      const { title, content, tags, published, canonical_url, description, cover_image } = params;

      const updateData: any = {
        article: {},
      };

      if (title) updateData.article.title = title;
      if (content) updateData.article.body_markdown = content;
      if (tags) updateData.article.tags = tags.slice(0, 4);
      if (published !== undefined) updateData.article.published = published;
      if (description) updateData.article.description = description;
      if (canonical_url) updateData.article.canonical_url = canonical_url;
      if (cover_image) updateData.article.main_image = cover_image;

      const response = await fetch(`https://dev.to/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `Failed to update: ${response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        postId: data.id,
        url: data.url,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update Dev.to article',
      };
    }
  }

  /**
   * Convert HTML to Markdown (basic conversion)
   */
  static htmlToMarkdown(html: string): string {
    let markdown = html;

    // Remove style and script tags
    markdown = markdown.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    markdown = markdown.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Headers
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

    // Bold and Italic
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Links
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Images
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

    // Lists
    markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/ul>/gi, '\n');
    markdown = markdown.replace(/<ol[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/ol>/gi, '\n');
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

    // Paragraphs
    markdown = markdown.replace(/<p[^>]*>/gi, '');
    markdown = markdown.replace(/<\/p>/gi, '\n\n');

    // Line breaks
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n');
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
      return content
        .split('\n')
        .map((line: string) => `> ${line}`)
        .join('\n') + '\n\n';
    });

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]+>/g, '');

    // Clean up multiple newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    // Decode HTML entities
    markdown = markdown.replace(/&nbsp;/g, ' ');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");

    return markdown.trim();
  }
}
