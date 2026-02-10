"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, Loader2, Share2, Bookmark } from "lucide-react"

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
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={48} className="animate-spin" style={{ color: '#FF7A33' }} />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '24px' }}>{error || 'Story not found'}</h2>
          <Link href="/blog" style={{ color: '#FF7A33', fontWeight: 800, fontSize: '18px', textDecoration: 'none', borderBottom: '2px solid #FF7A33' }}>
            Back to our stories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#1a1a1a' }}>

      {/* Article Header / Hero */}
      <section style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url("/design/BG%2023-01%202.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 24px 60px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/blog" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#666',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '40px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            <ArrowLeft size={16} /> Back to stories
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{
              backgroundColor: '#FF7A33',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '50px',
              fontSize: '11px',
              fontWeight: 800
            }}>ARTICLE</span>
            <span style={{ color: '#666', fontSize: '14px', fontWeight: 600 }}>{article.readTime} min read</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            marginBottom: '32px',
            color: '#1a1a1a',
            lineHeight: '1.2'
          }}>
            {article.title}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '32px',
            borderTop: '1px solid #eee'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {article.user?.avatar ? (
                <img src={article.user.avatar} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} style={{ color: '#999' }} />
                </div>
              )}
              <div>
                <p style={{ fontWeight: 800, fontSize: '16px', margin: 0 }}>{article.user?.name}</p>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{formatDate(article.publishedAt)}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff' }}>
                <Share2 size={18} style={{ color: '#666' }} />
              </button>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff' }}>
                <Bookmark size={18} style={{ color: '#666' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image Area */}
      {article.coverImage && (
        <section style={{ maxWidth: '1100px', margin: '-20px auto 80px', padding: '0 24px' }}>
          <div style={{
            borderRadius: '48px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
            height: 'clamp(300px, 50vh, 600px)'
          }}>
            <img
              src={article.coverImage}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </section>
      )}

      {/* Article Content */}
      <section style={{ padding: '0 24px 120px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            className="article-body"
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#333'
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </section>

      <style jsx global>{`
        .article-body p { margin-bottom: 32px; }
        .article-body h2 { 
          font-size: 32px; 
          font-weight: 800; 
          margin: 64px 0 24px; 
          line-height: 1.2;
        }
        .article-body h3 { 
          font-size: 24px; 
          font-weight: 800; 
          margin: 48px 0 20px; 
        }
        .article-body ul, .article-body ol { 
          margin-bottom: 32px; 
          padding-left: 24px; 
        }
        .article-body li { margin-bottom: 12px; }
        .article-body blockquote { 
          border-left: 4px solid #FF7A33; 
          padding-left: 32px; 
          margin: 48px 0; 
          font-style: italic; 
          font-size: 24px;
          line-height: 1.5;
          color: #555;
        }
        .article-body img { 
          border-radius: 24px; 
          margin: 48px 0; 
          width: 100%; 
        }
        .article-body a { 
          color: #FF7A33; 
          text-decoration: none; 
          font-weight: 700;
          border-bottom: 2px solid rgba(255, 122, 51, 0.2);
        }
        .article-body a:hover {
          border-bottom-color: #FF7A33;
        }
      `}</style>

    </div>
  )
}
