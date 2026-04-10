/**
 * Wix Analytics Service
 * Fetches blog post analytics from Wix via their REST API
 */

export interface WixAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export class WixAnalyticsService {
  /**
   * Get analytics for a specific Wix blog post
   * @param accessToken - Wix OAuth access token
   * @param siteId - Wix site ID
   * @param postId - Blog post ID
   * @returns Analytics data including views, likes, comments, and shares
   */
  static async getPostAnalytics(
    accessToken: string,
    siteId: string,
    postId: string
  ): Promise<{ success: boolean; data?: WixAnalytics; error?: string }> {
    try {
      if (!accessToken || !siteId || !postId) {
        return {
          success: false,
          error: 'Missing required parameters: accessToken, siteId, or postId',
        };
      }

      // Fetch post details including metrics
      const postResponse = await fetch(
        `https://www.wixapis.com/v3/posts/${postId}`,
        {
          headers: {
            Authorization: accessToken,
            'wix-site-id': siteId,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!postResponse.ok) {
        const errorText = await postResponse.text();
        return {
          success: false,
          error: `Failed to fetch Wix post: ${postResponse.status} - ${errorText}`,
        };
      }

      const postData = await postResponse.json();
      const post = postData.post || postData;

      // Fetch metrics (views, likes)
      // Note: Wix Analytics API has limited public access
      // Some metrics may require Wix Premium/Business plans
      let metricsData = {
        views: 0,
        likes: 0,
      };

      try {
        const metricsResponse = await fetch(
          `https://www.wixapis.com/v1/sites/${siteId}/blog/posts/${postId}/metrics`,
          {
            headers: {
              Authorization: accessToken,
              'Content-Type': 'application/json',
            },
          }
        );

        if (metricsResponse.ok) {
          const metrics = await metricsResponse.json();
          metricsData = {
            views: metrics.viewCount || 0,
            likes: metrics.likeCount || 0,
          };
        }
      } catch (metricsError) {
        console.warn('Could not fetch Wix metrics (may require premium plan):', metricsError);
      }

      return {
        success: true,
        data: {
          views: metricsData.views,
          likes: metricsData.likes,
          comments: post.commentCount || 0,
          shares: 0, // Wix doesn't provide share count via API
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch Wix analytics',
      };
    }
  }

  /**
   * Check if analytics are available for this Wix site
   * Some analytics features require Wix Premium or Business plans
   */
  static async hasAnalytics(accessToken: string, siteId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://www.wixapis.com/v1/sites/${siteId}/blog/info`,
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get aggregated analytics for all posts on a Wix site
   * @param accessToken - Wix OAuth access token
   * @param siteId - Wix site ID
   */
  static async getSiteAnalytics(
    accessToken: string,
    siteId: string
  ): Promise<{
    success: boolean;
    data?: {
      totalViews: number;
      totalLikes: number;
      totalComments: number;
      totalPosts: number;
    };
    error?: string;
  }> {
    try {
      // Fetch all posts
      const postsResponse = await fetch(
        `https://www.wixapis.com/v3/posts?sort=PUBLISHED_DATE_DESC&paging.limit=100`,
        {
          headers: {
            Authorization: accessToken,
            'wix-site-id': siteId,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!postsResponse.ok) {
        return {
          success: false,
          error: `Failed to fetch posts: ${postsResponse.statusText}`,
        };
      }

      const postsData = await postsResponse.json();
      const posts = postsData.posts || [];

      // Aggregate metrics
      let totalViews = 0;
      let totalLikes = 0;
      let totalComments = 0;

      for (const post of posts) {
        totalComments += post.commentCount || 0;
      }

      return {
        success: true,
        data: {
          totalViews,
          totalLikes,
          totalComments,
          totalPosts: posts.length,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch site analytics',
      };
    }
  }
}
