export interface HashnodeAnalytics {
  views: number;
  reactions: number;
  comments: number;
  responseCount: number;
}

export class HashnodeAnalyticsService {
  private static readonly API_URL = 'https://gql.hashnode.com';

  /**
   * Fetch analytics for a specific Hashnode post
   */
  static async getPostAnalytics(
    apiKey: string,
    postId: string
  ): Promise<{ success: boolean; data?: HashnodeAnalytics; error?: string }> {
    try {
      const query = `
        query GetPost($id: ID!) {
          post(id: $id) {
            views
            reactionCount
            responseCount
            comments(first: 100) {
              totalDocuments
            }
          }
        }
      `;

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
        },
        body: JSON.stringify({
          query,
          variables: { id: postId },
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch analytics: ${response.statusText}`,
        };
      }

      const data = await response.json();

      if (data.errors) {
        return {
          success: false,
          error: data.errors[0]?.message || 'Failed to fetch analytics',
        };
      }

      const post = data.data?.post;

      if (!post) {
        return {
          success: false,
          error: 'Post not found',
        };
      }

      return {
        success: true,
        data: {
          views: post.views || 0,
          reactions: post.reactionCount || 0,
          comments: post.comments?.totalDocuments || 0,
          responseCount: post.responseCount || 0,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch Hashnode analytics',
      };
    }
  }
}
