export class WordPressService {
  /**
   * Generate WordPress.com OAuth authorization URL
   */
  static getAuthorizationUrl(userId: string): string {
    const params = new URLSearchParams({
      client_id: process.env.WORDPRESS_CLIENT_ID || '',
      redirect_uri: process.env.WORDPRESS_REDIRECT_URI || '',
      response_type: 'code',
      state: userId, // Store user ID in state for callback
      scope: 'posts', // Request permission to manage posts
    });

    return `https://public-api.wordpress.com/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Publish article to WordPress.com
   */
  static async publishArticle(params: {
    accessToken: string;
    blogId: string;
    title: string;
    content: string;
    excerpt?: string;
    status?: 'publish' | 'draft';
    featuredImage?: string;
  }): Promise<{ success: boolean; postId?: number; url?: string; error?: string }> {
    const { accessToken, blogId, title, content, excerpt, status = 'publish', featuredImage } = params;

    try {
      const response = await fetch(
        `https://public-api.wordpress.com/rest/v1.1/sites/${blogId}/posts/new`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            excerpt: excerpt || '',
            status,
            featured_image: featuredImage || '',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('WordPress publish error:', errorData);
        return {
          success: false,
          error: errorData.message || 'Failed to publish to WordPress',
        };
      }

      const data = await response.json();

      return {
        success: true,
        postId: data.ID,
        url: data.URL,
      };
    } catch (error: any) {
      console.error('WordPress publish error:', error);
      return {
        success: false,
        error: error.message || 'Failed to publish to WordPress',
      };
    }
  }

  /**
   * Get list of WordPress.com sites for the user
   */
  static async getUserSites(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch('https://public-api.wordpress.com/rest/v1.1/me/sites', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch WordPress sites');
      }

      const data = await response.json();
      return data.sites || [];
    } catch (error) {
      console.error('Error fetching WordPress sites:', error);
      return [];
    }
  }

  /**
   * Disconnect WordPress account
   */
  static async disconnect(connectionId: string): Promise<boolean> {
    // The connection will be deleted from database by the API endpoint
    // WordPress.com doesn't require explicit token revocation
    return true;
  }
}

export const wordpressService = new WordPressService();
