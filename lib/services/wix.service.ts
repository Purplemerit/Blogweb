export interface WixPublishParams {
  accessToken: string;
  siteId: string;
  title: string;
  content: string;
  excerpt?: string;
  status?: 'PUBLISHED' | 'DRAFT';
  tags?: string[];
  featuredImage?: string;
}

export interface WixPostResponse {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export class WixService {
  private static readonly API_BASE = 'https://www.wixapis.com';

  /**
   * Get authorization URL for Wix OAuth
   */
  static getAuthUrl(userId: string): string {
    const params = new URLSearchParams({
      client_id: process.env.WIX_CLIENT_ID || '',
      redirect_uri: process.env.WIX_REDIRECT_URI || '',
      response_type: 'code',
      state: userId,
      scope: 'blog.posts',
    });

    return `https://www.wix.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    instanceId?: string;
    error?: string;
  }> {
    try {
      const response = await fetch('https://www.wix.com/oauth/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.WIX_CLIENT_ID,
          client_secret: process.env.WIX_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to exchange code: ${response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        instanceId: data.instance_id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to exchange authorization code',
      };
    }
  }

  /**
   * Get site information
   */
  static async getSiteInfo(accessToken: string, instanceId: string): Promise<{
    success: boolean;
    siteId?: string;
    siteName?: string;
    siteUrl?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/site/v2/site`, {
        headers: {
          Authorization: accessToken,
          'wix-site-id': instanceId,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to get site info: ${response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        siteId: data.site.siteId,
        siteName: data.site.siteName,
        siteUrl: data.site.url,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get site information',
      };
    }
  }

  /**
   * Publish article to Wix Blog
   */
  static async publishArticle(params: WixPublishParams): Promise<WixPostResponse> {
    try {
      const {
        accessToken,
        siteId,
        title,
        content,
        excerpt,
        status = 'PUBLISHED',
        tags = [],
        featuredImage,
      } = params;

      const postData: any = {
        title,
        contentText: content,
        status,
      };

      if (excerpt) {
        postData.excerpt = excerpt;
      }

      if (tags.length > 0) {
        postData.tags = tags;
      }

      if (featuredImage) {
        postData.coverImage = {
          url: featuredImage,
        };
      }

      const response = await fetch(`${this.API_BASE}/blog/v3/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
          'wix-site-id': siteId,
        },
        body: JSON.stringify({ post: postData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `Failed to publish: ${response.statusText}`,
        };
      }

      const data = await response.json();
      const post = data.post;

      return {
        success: true,
        postId: post.id,
        url: post.url || `https://${siteId}/post/${post.slug}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to publish to Wix',
      };
    }
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    success: boolean;
    accessToken?: string;
    error?: string;
  }> {
    try {
      const response = await fetch('https://www.wix.com/oauth/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.WIX_CLIENT_ID,
          client_secret: process.env.WIX_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to refresh token: ${response.statusText}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        accessToken: data.access_token,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to refresh access token',
      };
    }
  }
}
