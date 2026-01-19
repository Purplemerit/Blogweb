"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PenTool, Calendar, User, ArrowRight, Search, Loader2, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/lib/context/AuthContext"

interface Article {
  id: string
  title: string
  excerpt: string
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

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function BlogPage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Add loading animation
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    fetchArticles(currentPage, searchQuery)
  }, [currentPage])

  const fetchArticles = async (page: number, search: string = "") => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { search })
      })

      const response = await fetch(`/api/blogs/public?${params}`)
      const data = await response.json()

      if (data.success) {
        setArticles(data.data.articles)
        setPagination(data.data.pagination)
      } else {
        toast.error("Failed to load blog posts")
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      toast.error("Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchArticles(1, searchQuery)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRandomColor = () => {
    const colors = ["#d4e8d4", "#f3e8d9", "#e8f4f8", "#f5e6f3", "#fff5e6", "#e8f5e9"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsletterEmail.trim()) {
      toast.error("Please enter your email address")
      return
    }

    try {
      setSubscribing(true)
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        setNewsletterEmail("")
      } else {
        toast.error(data.error || "Failed to subscribe")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f1e8' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(245,241,232,0.95)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
            <PenTool style={{ height: '20px', width: '20px' }} strokeWidth={2} />
            <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.025em' }}>PublishType</span>
          </Link>

          <nav className="header-nav hide-mobile" style={{ fontSize: '14px' }}>
            <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
            <Link href="/features" style={{ color: '#374151', textDecoration: 'none' }}>Features</Link>
            <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
          </nav>

          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" style={{ backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '8px 20px' }}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" style={{ fontSize: '14px', fontWeight: 400 }}>Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" style={{ backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '8px 20px' }}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            {mobileMenuOpen ? <X style={{ height: '24px', width: '24px' }} /> : <Menu style={{ height: '24px', width: '24px' }} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Home
              </Link>
              <Link
                href="/features"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 600,
                  backgroundColor: '#f3f4f6'
                }}
              >
                Blog
              </Link>
              <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" style={{ width: '100%', backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" style={{ width: '100%', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>Sign In</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" style={{ width: '100%', backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="section-padding" style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center', paddingBottom: '40px' }}>
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: '#6b7280',
          marginBottom: '16px',
          fontWeight: 500,
          textTransform: 'uppercase'
        }}>
          INSIGHTS & RESOURCES
        </p>
        <h1 className="text-section-title" style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          lineHeight: '1.2',
          marginBottom: '20px',
          letterSpacing: '-0.025em'
        }}>
          Our Blog
        </h1>
        <p style={{ fontSize: '17px', color: '#6b7280', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.6' }}>
          Discover tips, strategies, and insights to help you create better content and grow your audience
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{
          maxWidth: '600px',
          margin: '0 auto 60px',
          display: 'flex',
          gap: '12px'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '18px',
              width: '18px',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 48px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '14px 32px',
              backgroundColor: '#1f3529',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Search
          </button>
        </form>
      </section>

      {/* Blog Grid */}
      <section className="container-padding" style={{ maxWidth: '1152px', margin: '0 auto', paddingBottom: '80px' }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Loader2 style={{ height: '40px', width: '40px', color: '#1f3529', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 32px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '28px',
              marginBottom: '12px',
              color: '#0a0a0a'
            }}>No articles found</h3>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px' }}>
              {searchQuery ? `No results for "${searchQuery}". Try a different search.` : 'No published articles yet. Check back soon!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  fetchArticles(1, "")
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1f3529',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="responsive-grid-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  >
                    {/* Cover Image */}
                    {article.coverImage ? (
                      <div style={{
                        width: '100%',
                        height: '220px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '220px',
                        backgroundColor: getRandomColor(),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <span style={{ opacity: 0.5 }}>No Cover Image</span>
                      </div>
                    )}

                    <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h2 style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '24px',
                        lineHeight: '1.3',
                        marginBottom: '12px',
                        letterSpacing: '-0.025em',
                        color: '#0a0a0a'
                      }}>
                        {article.title}
                      </h2>

                      <p style={{
                        fontSize: '15px',
                        color: '#6b7280',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                        flex: 1
                      }}>
                        {article.excerpt || 'No excerpt available'}
                      </p>

                      {/* Meta Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '13px',
                        color: '#9ca3af',
                        paddingTop: '16px',
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User style={{ height: '14px', width: '14px' }} />
                          <span>{article.user.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar style={{ height: '14px', width: '14px' }} />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <span>·</span>
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ textAlign: 'center', marginTop: '64px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: currentPage === 1 ? '#e5e7eb' : 'white',
                    color: currentPage === 1 ? '#9ca3af' : '#1f3529',
                    border: '2px solid #1f3529',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>

                <span style={{ fontSize: '15px', color: '#6b7280' }}>
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: currentPage === pagination.totalPages ? '#e5e7eb' : 'white',
                    color: currentPage === pagination.totalPages ? '#9ca3af' : '#1f3529',
                    border: '2px solid #1f3529',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Next
                  <ArrowRight style={{ height: '16px', width: '16px' }} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Newsletter Section */}
      <section style={{ backgroundColor: '#1f3529', color: 'white', padding: '80px 0' }}>
        <div className="container-padding" style={{ maxWidth: '768px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="text-section-title" style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            marginBottom: '16px',
            letterSpacing: '-0.025em'
          }}>Stay Updated</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
            Subscribe to our newsletter for the latest content creation tips and platform updates
          </p>
          <form onSubmit={handleNewsletterSubscribe} className="newsletter-form" style={{ justifyContent: 'center', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={subscribing}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={subscribing}
              style={{
                backgroundColor: subscribing ? 'rgba(255,255,255,0.7)' : 'white',
                color: '#1f3529',
                padding: '14px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 500,
                cursor: subscribing ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
              {subscribing ? (
                <>
                  <Loader2 style={{ height: '16px', width: '16px', animation: 'spin 1s linear infinite' }} />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
