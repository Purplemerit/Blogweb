"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/AuthContext"
import {
  Search,
  Plus,
  FileText,
  Clock,
  Eye,
  Edit,
  Trash2,
  Calendar,
  ChevronRight,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: string
  wordCount: number
  readingTime: number
  views: number
  publishedAt: string | null
  scheduleAt: string | null
  createdAt: string
  updatedAt: string
  publishRecords?: {
    platform: string
    url: string | null
  }[]
}

export default function ArticlesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [totalArticles, setTotalArticles] = useState(0)
  const [totalWords, setTotalWords] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchArticles()
    }
  }, [user, filterStatus])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken")
      const params = new URLSearchParams({ limit: '50' })
      if (filterStatus !== 'all') params.append('status', filterStatus.toUpperCase())

      const response = await fetch(`/api/articles?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        const fetched = data.data.articles || []
        setArticles(fetched)
        setTotalArticles(data.data.pagination.total)

        // RESTORING: Calculate total words dynamically
        const words = fetched.reduce((sum: number, article: Article) => sum + (article.wordCount || 0), 0)
        setTotalWords(words)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (articleId: string, articleTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${articleTitle}"?`)) return

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        toast.success("Article deleted successfully")
        setArticles((prev) => prev.filter((article) => article.id !== articleId))
        setTotalArticles(prev => prev - 1)
      }
    } catch (error) {
      toast.error("Failed to delete article")
    }
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      'WORDPRESS': 'WordPress', 'GHOST': 'Ghost', 'DEVTO': 'Dev.to',
      'HASHNODE': 'Hashnode', 'WIX': 'Wix', 'MEDIUM': 'Medium', 'LINKEDIN': 'LinkedIn'
    }
    return names[platform] || platform
  }

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={40} style={{ color: '#FF7A33' }} />
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        /* Tablet and below */
        @media (max-width: 1024px) {
          .articles-grid {
            grid-template-columns: repeat(auto-fill, minwidth(300px, 1fr)) !important;
          }
        }

        /* Mobile landscape and below */
        @media (max-width: 768px) {
          .articles-hero {
            padding: 40px 20px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .articles-hero h1 {
            font-size: 32px !important;
          }
          .articles-hero button {
            width: 100% !important;
            justify-content: center !important;
          }
          .articles-filters-section {
            padding: 24px 20px !important;
          }
          .articles-filters-row {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .articles-search {
            width: 100% !important;
          }
          .articles-filter-buttons {
            width: 100% !important;
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
          }
          .articles-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }

        /* Mobile portrait */
        @media (max-width: 480px) {
          .articles-hero {
            padding: 32px 16px !important;
          }
          .articles-hero h1 {
            font-size: 28px !important;
            line-height: 1.2 !important;
          }
          .articles-hero p {
            font-size: 14px !important;
          }
          .articles-filters-section {
            padding: 20px 12px !important;
          }
          .articles-card {
            border-radius: 24px !important;
          }
          .articles-card-inner {
            padding: 24px !important;
          }
        }
      `}</style>

      <div style={{ paddingBottom: '100px' }}>
        {/* Hero Header */}
        <section className="articles-hero" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("/design/BG%2023-01%202.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '60px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px 0' }}>
              All <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: 'serif' }}>Articles</span>
            </h1>
            <p style={{ color: '#666', fontSize: '15px', fontWeight: 500 }}>Manage, edit and publish your stories from one place.</p>
          </div>

          <button
            onClick={() => router.push("/dashboard/articles/new")}
            style={{
              backgroundColor: '#FF7A33',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)'
            }}
          >
            <Plus size={20} strokeWidth={3} />
            Create New Article
          </button>
        </section>

        {/* Filters & Search */}
        <section className="articles-filters-section" style={{ padding: '40px' }}>
          <div className="articles-filters-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div className="articles-search" style={{ position: 'relative', width: '400px' }}>
              <input
                type="text"
                placeholder="Search by article title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 48px',
                  borderRadius: '50px',
                  border: '1px solid #eee',
                  backgroundColor: '#fcfcfc',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
            </div>

            <div className="articles-filter-buttons" style={{ display: 'flex', gap: '12px' }}>
              {['all', 'published', 'draft', 'scheduled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '50px',
                    border: filterStatus === status ? 'none' : '1px solid #eee',
                    backgroundColor: filterStatus === status ? '#1a1a1a' : '#fff',
                    color: filterStatus === status ? '#fff' : '#666',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
            {filteredArticles.map((article) => (
              <div key={article.id} className="articles-card" style={{
                backgroundColor: '#fff',
                borderRadius: '32px',
                border: '1px solid #eee',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                position: 'relative'
              }}>
                <div className="articles-card-inner" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <span style={{
                      backgroundColor: article.status === 'PUBLISHED' ? '#e7f9ee' : '#f9f9f9',
                      color: article.status === 'PUBLISHED' ? '#22c55e' : '#999',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>{article.status}</span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => router.push(`/dashboard/articles/${article.id}`)}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #eee', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #eee', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff4b2b' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px 0', lineHeight: '1.4' }}>{article.title}</h3>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.excerpt || "No excerpt provided for this account."}
                  </p>

                  {/* RESTORING: Published Platforms visibility */}
                  {article.publishRecords && article.publishRecords.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 800, color: '#999' }}>PUBLISHED ON:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {article.publishRecords.map((rec, i) => (
                          <a key={i} href={rec.url || '#'} target="_blank" rel="noreferrer" style={{
                            backgroundColor: '#f5f5f5', color: '#1a1a1a', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', textDecoration: 'none'
                          }}>
                            {getPlatformName(rec.platform)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 0', borderTop: '1px solid #f9f9f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#999', fontWeight: 700 }}>
                      <FileText size={14} /> {article.wordCount} Words
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#999', fontWeight: 700 }}>
                      <Clock size={14} /> {article.readingTime} Min
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#999', fontWeight: 700 }}>
                      <Calendar size={14} /> {formatDate(article.publishedAt || article.createdAt)}
                    </div>
                  </div>

                  <Link href={`/dashboard/articles/${article.id}`} style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#FF7A33',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 800
                  }}>
                    Continue Editing <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* RESTORING: Dynamic Stats Footer from original */}
          {filteredArticles.length > 0 && (
            <div style={{
              marginTop: '80px',
              backgroundColor: '#1a1a1a',
              borderRadius: '32px',
              padding: '40px',
              display: 'flex',
              justifyContent: 'center',
              gap: '80px',
              color: 'white'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 800 }}>{totalArticles}</p>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Total Articles</p>
              </div>
              <div style={{ width: '1px', height: '50px', backgroundColor: '#333' }}></div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 800 }}>{totalWords.toLocaleString()}</p>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Total Words Written</p>
              </div>
            </div>
          )}

          {filteredArticles.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0' }}>
              <FileText size={60} color="#eee" style={{ marginBottom: '24px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>No stories found</h2>
              <p style={{ color: '#999', fontWeight: 600 }}>Try adjusting your search or create a new article.</p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
