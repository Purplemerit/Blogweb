export interface WordPressAnalytics {
  views: number;
  visitors: number;
  likes: number;
  comments: number;
}

export class WordPressAnalyticsService {
  /**
   * Fetch analytics for a specific WordPress.com post
   */
  static async getPostAnalytics(
    accessToken: string,
    blogId: string,
    postId: string
  ): Promise<{ success: boolean; data?: WordPressAnalytics; error?: string }> {
    try {
      // Fetch post stats
      const statsResponse = await fetch(
        `https://public-api.wordpress.com/rest/v1.1/sites/${blogId}/stats/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!statsResponse.ok) {
        return {
          success: false,
          error: `Failed to fetch stats: ${statsResponse.statusText}`,
        };
      }

      const stats = await statsResponse.json();

      // Fetch post details for likes and comments
      const postResponse = await fetch(
        `https://public-api.wordpress.com/rest/v1.1/sites/${blogId}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let likes = 0;
      let comments = 0;

      if (postResponse.ok) {
        const post = await postResponse.json();
        likes = post.like_count || 0;
        comments = post.discussion?.comment_count || 0;
      }

      return {
        success: true,
        data: {
          views: stats.views || 0,
          visitors: stats.visitors || 0,
          likes,
          comments,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch WordPress analytics',
      };
    }
  }
}
