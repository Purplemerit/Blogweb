export interface DevToAnalytics {
  views: number;
  reactions: number;
  comments: number;
  publicReactionsCount: number;
  positiveReactionsCount: number;
}

export class DevToAnalyticsService {
  /**
   * Fetch analytics for a specific Dev.to article
   */
  static async getArticleAnalytics(
    apiKey: string,
    articleId: string
  ): Promise<{ success: boolean; data?: DevToAnalytics; error?: string }> {
    try {
      const response = await fetch(`https://dev.to/api/articles/${articleId}`, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch analytics: ${response.statusText}`,
        };
      }

      const article = await response.json();

      return {
        success: true,
        data: {
          views: article.page_views_count || 0,
          reactions: article.public_reactions_count || 0,
          comments: article.comments_count || 0,
          publicReactionsCount: article.public_reactions_count || 0,
          positiveReactionsCount: article.positive_reactions_count || 0,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch Dev.to analytics',
      };
    }
  }
}
