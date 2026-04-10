export interface HashnodePublishParams {
  apiKey: string;
  publicationId: string;
  title: string;
  content: string;
  tags?: string[];
  subtitle?: string;
  coverImage?: string;
  publishedAt?: string;
}

export interface HashnodePostResponse {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export class HashnodeService {
  private static readonly API_URL = 'https://gql.hashnode.com';

  /**
   * Validate Hashnode API key and get user info
   */
  static async validateApiKey(apiKey: string): Promise<{ valid: boolean; username?: string; publicationId?: string; error?: string }> {
    try {
      const query = `
        query Me {
          me {
            username
            publications(first: 1) {
              edges {
                node {
                  id
                  title
                }
              }
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
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        return {
          valid: false,
          error: response.status === 401 ? 'Invalid API key' : `Failed to validate: ${response.statusText}`,
        };
      }

      const data = await response.json();

      if (data.errors) {
        return {
          valid: false,
          error: data.errors[0]?.message || 'Failed to validate API key',
        };
      }

      const me = data.data?.me;
      if (!me) {
        return {
          valid: false,
          error: 'Unable to fetch user information',
        };
      }

      const publication = me.publications?.edges?.[0]?.node;
      if (!publication) {
        return {
          valid: false,
          error: 'No publication found. Please create a blog on Hashnode first.',
        };
      }

      return {
        valid: true,
        username: me.username,
        publicationId: publication.id,
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message || 'Failed to validate API key',
      };
    }
  }

  /**
   * Publish article to Hashnode
   */
  static async publishArticle(params: HashnodePublishParams): Promise<HashnodePostResponse> {
    try {
      const { apiKey, publicationId, title, content, tags = [], subtitle, coverImage } = params;

      const mutation = `
        mutation PublishPost($input: PublishPostInput!) {
          publishPost(input: $input) {
            post {
              id
              url
              slug
            }
          }
        }
      `;

      const variables = {
        input: {
          title,
          contentMarkdown: content,
          publicationId,
          ...(subtitle && { subtitle }),
          ...(tags.length > 0 && {
            tags: tags.map(tag => ({
              name: tag,
              slug: tag.toLowerCase().replace(/\s+/g, '-'),
            })),
          }),
          ...(coverImage && { coverImageOptions: { coverImageURL: coverImage } }),
        },
      };

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
        },
        body: JSON.stringify({ query: mutation, variables }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to publish: ${response.statusText}`,
        };
      }

      const data = await response.json();

      if (data.errors) {
        return {
          success: false,
          error: data.errors[0]?.message || 'Failed to publish article',
        };
      }

      const post = data.data?.publishPost?.post;
      if (!post) {
        return {
          success: false,
          error: 'No post data returned from Hashnode',
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
        error: error.message || 'Failed to publish to Hashnode',
      };
    }
  }

  /**
   * Convert HTML to Markdown (reusing Dev.to's converter for simplicity)
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
