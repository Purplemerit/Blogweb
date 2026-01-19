"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, PenTool, Loader2 } from "lucide-react"
import { NewsletterFooter } from "@/components/NewsletterFooter"

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  coverImage: string | null
  publishedAt: string
  readTime: number
  wordCount: number
  user: {
    id: string
    name: string
    avatar: string | null
  }
}

export default function BlogArticlePage() {
  const params = useParams()
  const articleId = params.id as string
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      // Use the optimized single article endpoint instead of fetching all articles
      const response = await fetch(`/api/blogs/public/${articleId}`)
      const data = await response.json()

      if (data.success) {
        setArticle(data.data)
      } else {
        setError(data.error || 'Article not found')
      }
    } catch (err) {
      console.error('Error fetching article:', err)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f1e8' }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#1f3529' }} />
          <p style={{ color: '#6b7280' }}>Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f1e8' }}>
        <div className="text-center">
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1f3529', marginBottom: '16px' }}>
            {error || 'Article not found'}
          </h2>
          <Link href="/blog" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#1f3529',
            textDecoration: 'none',
            padding: '12px 24px',
            backgroundColor: 'white',
            borderRadius: '8px',
            fontWeight: 500
          }}>
            <ArrowLeft style={{ height: '16px', width: '16px' }} />
            Back to all posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f1e8' }}>
      {/* Simple Header */}
      <header style={{
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(245,241,232,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <PenTool style={{ height: '22px', width: '22px', color: '#1f3529' }} strokeWidth={2} />
            <span style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '-0.025em', color: '#1f3529' }}>Publish Type</span>
          </Link>

          <div className="header-nav hide-mobile">
            <Link href="/" style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px'
            }}>
              Home
            </Link>
            <Link href="/blog" style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px'
            }}>
              Blog
            </Link>
            <Link href="/login" style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <main className="container-padding" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '64px', paddingBottom: '64px' }}>
        {/* Back Button */}
        <Link href="/blog" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '32px',
          transition: 'color 0.2s'
        }}>
          <ArrowLeft style={{ height: '16px', width: '16px' }} />
          Back to all posts
        </Link>

        {/* Cover Image */}
        {article.coverImage && (
          <div style={{
            marginBottom: '32px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <img
              src={article.coverImage}
              alt={article.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        {/* Article Header */}
        <article style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* Title */}
          <h1 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '42px',
            lineHeight: '1.2',
            marginBottom: '24px',
            color: '#1f3529',
            letterSpacing: '-0.02em',
            fontWeight: 700
          }}>
            {article.title}
          </h1>

          {/* Meta Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            paddingBottom: '32px',
            marginBottom: '32px',
            borderBottom: '1px solid #e5e7eb',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
              {article.user.avatar ? (
                <img
                  src={article.user.avatar}
                  alt={article.user.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <User style={{ height: '16px', width: '16px' }} />
              )}
              <span style={{ fontWeight: 500 }}>{article.user.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
              <Calendar style={{ height: '16px', width: '16px' }} />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
              <Clock style={{ height: '16px', width: '16px' }} />
              <span>{article.readTime > 0 ? `${article.readTime} min read` : `${Math.ceil(article.wordCount / 200)} min read`}</span>
            </div>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <div style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#6b7280',
              marginBottom: '32px',
              fontStyle: 'italic',
              borderLeft: '4px solid #1f3529',
              paddingLeft: '20px'
            }}>
              {article.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#374151'
            }}
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Author Section */}
        <div style={{
          marginTop: '48px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Written by
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {article.user.avatar ? (
              <img
                src={article.user.avatar}
                alt={article.user.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ebe4d5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 600,
                color: '#1f3529'
              }}>
                {article.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1f3529',
                marginBottom: '4px'
              }}>
                {article.user.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Content Creator on Publish Type
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Newsletter and Footer */}
      <div style={{ marginTop: '96px' }}>
        <NewsletterFooter />
      </div>

      {/* Article Content Styles */}
      <style jsx global>{`
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #1f3529;
          margin-top: 32px;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        .article-content h1 { font-size: 36px; }
        .article-content h2 { font-size: 30px; }
        .article-content h3 { font-size: 24px; }
        .article-content p {
          margin-bottom: 20px;
        }
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 24px 0;
        }
        .article-content ul,
        .article-content ol {
          margin-bottom: 20px;
          padding-left: 24px;
        }
        .article-content li {
          margin-bottom: 8px;
        }
        .article-content blockquote {
          border-left: 4px solid #1f3529;
          padding-left: 20px;
          margin: 24px 0;
          font-style: italic;
          color: #6b7280;
        }
        .article-content a {
          color: #1f3529;
          text-decoration: underline;
        }
        .article-content code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        .article-content pre {
          background: #f3f4f6;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 24px 0;
        }
      `}</style>
    </div>
  )
}
