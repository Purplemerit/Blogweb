import jwt from 'jsonwebtoken';

export interface GhostPublishParams {
  apiUrl: string;
  adminApiKey: string;
  title: string;
  content: string;
  excerpt?: string;
  status?: 'draft' | 'published';
  tags?: string[];
  featured?: boolean;
}

export interface GhostPostResponse {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export class GhostService {
  /**
   * Generate Ghost Admin API JWT token
   */
  static generateToken(apiKey: string): string {
    // Ghost Admin API key format: id:secret
    const [id, secret] = apiKey.split(':');

    if (!id || !secret) {
      throw new Error('Invalid Ghost Admin API key format. Expected format: id:secret');
    }

    // Split secret into key and extract hex
    const keyBuffer = Buffer.from(secret, 'hex');

    // Create JWT token
    const token = jwt.sign(
      {},
      keyBuffer,
      {
        keyid: id,
        algorithm: 'HS256',
        expiresIn: '5m',
        audience: '/admin/',
      }
    );

    return token;
  }

  /**
   * Validate Ghost site URL and API key
   */
  static async validateConnection(apiUrl: string, adminApiKey: string): Promise<{ valid: boolean; siteName?: string; error?: string }> {
    try {
      const token = this.generateToken(adminApiKey);
      const normalizedUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash

      const response = await fetch(`${normalizedUrl}/ghost/api/admin/site/`, {
        method: 'GET',
        headers: {
          'Authorization': `Ghost ${token}`,
          'Accept-Version': 'v5.0',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          valid: false,
          error: errorData.errors?.[0]?.message || `Failed to connect: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        valid: true,
        siteName: data.site?.title || 'Ghost Site',
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message || 'Failed to validate connection',
      };
    }
  }

  /**
   * Publish article to Ghost
   */
  static async publishArticle(params: GhostPublishParams): Promise<GhostPostResponse> {
    try {
      const { apiUrl, adminApiKey, title, content, excerpt, status = 'draft', tags = [], featured = false } = params;

      const token = this.generateToken(adminApiKey);
      const normalizedUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash

      // Convert HTML content to Ghost's Mobiledoc format (simplified version)
      // For a more robust solution, you'd use a proper HTML to Mobiledoc converter
      const mobiledoc = JSON.stringify({
        version: '0.3.1',
        atoms: [],
        cards: [['html', { cardName: 'html', html: content }]],
        markups: [],
        sections: [[10, 0]],
      });

      const postData = {
        posts: [
          {
            title,
            mobiledoc,
            html: content,
            custom_excerpt: excerpt || '',
            status,
            tags: tags.map(tag => ({ name: tag })),
            featured,
          },
        ],
      };

      const response = await fetch(`${normalizedUrl}/ghost/api/admin/posts/?source=html`, {
        method: 'POST',
        headers: {
          'Authorization': `Ghost ${token}`,
          'Content-Type': 'application/json',
          'Accept-Version': 'v5.0',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.errors?.[0]?.message || `Failed to publish: ${response.statusText}`,
        };
      }

      const data = await response.json();
      const post = data.posts?.[0];

      if (!post) {
        return {
          success: false,
          error: 'No post returned from Ghost API',
        };
      }

      return {
        success: true,
        postId: post.id,
        url: post.url,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to publish to Ghost',
      };
    }
  }

  /**
   * Update existing Ghost post
   */
  static async updateArticle(
    apiUrl: string,
    adminApiKey: string,
    postId: string,
    params: Partial<GhostPublishParams>
  ): Promise<GhostPostResponse> {
    try {
      const token = this.generateToken(adminApiKey);
      const normalizedUrl = apiUrl.replace(/\/$/, '');

      const { title, content, excerpt, status, tags, featured } = params;

      const updateData: any = {
        posts: [
          {
            ...(title && { title }),
            ...(content && {
              html: content,
              mobiledoc: JSON.stringify({
                version: '0.3.1',
                atoms: [],
                cards: [['html', { cardName: 'html', html: content }]],
                markups: [],
                sections: [[10, 0]],
              }),
            }),
            ...(excerpt !== undefined && { custom_excerpt: excerpt }),
            ...(status && { status }),
            ...(tags && { tags: tags.map(tag => ({ name: tag })) }),
            ...(featured !== undefined && { featured }),
          },
        ],
      };

      const response = await fetch(`${normalizedUrl}/ghost/api/admin/posts/${postId}/?source=html`, {
        method: 'PUT',
        headers: {
          'Authorization': `Ghost ${token}`,
          'Content-Type': 'application/json',
          'Accept-Version': 'v5.0',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.errors?.[0]?.message || `Failed to update: ${response.statusText}`,
        };
      }

      const data = await response.json();
      const post = data.posts?.[0];

      return {
        success: true,
        postId: post.id,
        url: post.url,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update Ghost post',
      };
    }
  }
}
