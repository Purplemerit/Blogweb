"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/AuthContext"
import { DashboardSkeleton } from "@/components/SkeletonLoader"
import { SubscriptionBanner } from "@/components/SubscriptionBanner"
import {
  FileText,
  CheckCircle,
  MoreHorizontal,
  Sparkles,
  Files,
  TrendingUp,
  Clock,
  Send,
  Plus
} from "lucide-react"

interface Article {
  id: string
  title: string
  status: string
  publishedAt: string | null
  createdAt: string
  wordCount: number
  slug: string
}

interface ActivityItem {
  type: 'created' | 'published' | 'updated'
  article: {
    title: string
    id: string
  }
  timestamp: string
}

interface PlatformConnection {
  platform: string
  status: string
}

function DashboardContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalPublished: 0,
    totalViews: 0,
    articlesThisWeek: 0,
    drafts: 0,
    scheduled: 0,
  })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [connections, setConnections] = useState<PlatformConnection[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      // Fetch Stats, Articles, and Connections in parallel
      const [statsRes, articlesRes, connRes] = await Promise.all([
        fetch('/api/user/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/articles?limit=5', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/platforms/connections', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          totalArticles: statsData.data.totalArticles || 0,
          totalPublished: statsData.data.totalPublished || 0,
          totalViews: statsData.data.totalViews || 0,
          articlesThisWeek: statsData.data.articlesCreatedThisMonth || 0,
          drafts: statsData.data.totalDrafts || 0,
          scheduled: statsData.data.totalScheduled || 0,
        })
      }

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json()
        const fetchedArticles = articlesData.data.articles || []
        setArticles(fetchedArticles)

        // RESTORING: Generate real activity log from articles
        const activity: ActivityItem[] = fetchedArticles.map((article: Article) => ({
          type: article.status === 'PUBLISHED' ? 'published' : 'created',
          article: { title: article.title, id: article.id },
          timestamp: article.publishedAt || article.createdAt,
        }))
        setRecentActivity(activity)
      }

      if (connRes.ok) {
        const connData = await connRes.json()
        setConnections(connData.data.connections || [])
      }

      setLoadingData(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoadingData(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading || loadingData) return <DashboardSkeleton />

  const completionRate = stats.totalArticles > 0 ? (stats.totalPublished / stats.totalArticles) * 100 : 0

  return (
    <>
      <style jsx global>{`
        /* Tablet and below */
        @media (max-width: 1024px) {
          .dashboard-main-section {
            flex-direction: column !important;
          }
          .dashboard-sidebar {
            width: 100% !important;
          }
        }

        /* Mobile landscape and below */
        @media (max-width: 768px) {
          .dashboard-hero {
            padding: 40px 20px !important;
            flex-direction: column !important;
            gap: 24px !important;
          }
          .dashboard-hero h1 {
            font-size: 32px !important;
          }
          .dashboard-stats-row {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .dashboard-stat-card {
            min-width: 100% !important;
            padding: 20px 24px !important;
          }
          .dashboard-banner {
            padding: 0 20px !important;
            margin-top: -10px !important;
          }
          .dashboard-main-section {
            padding: 0 20px !important;
          }
          .dashboard-table {
            display: none !important;
          }
          .dashboard-mobile-cards {
            display: flex !important;
          }
        }

        /* Mobile portrait */
        @media (max-width: 480px) {
          .dashboard-hero {
            padding: 32px 16px !important;
          }
          .dashboard-hero h1 {
            font-size: 28px !important;
            line-height: 1.2 !important;
          }
          .dashboard-hero p {
            font-size: 14px !important;
          }
          .dashboard-stat-card {
            padding: 16px 20px !important;
          }
          .dashboard-stat-card p:first-child {
            font-size: 10px !important;
          }
          .dashboard-stat-card p:last-child {
            font-size: 24px !important;
          }
          .dashboard-banner {
            padding: 0 12px !important;
          }
          .dashboard-main-section {
            padding: 0 12px !important;
            gap: 24px !important;
          }
          .dashboard-card {
            border-radius: 24px !important;
            padding: 24px !important;
          }
        }

        .dashboard-mobile-cards {
          display: none;
        }
      `}</style>

      <div style={{ paddingBottom: '100px' }}>

        {/* Hero Header */}
        <section className="dashboard-hero" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("/design/BG%2023-01%202.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '60px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px 0' }}>
              Welcome Back, <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: 'serif' }}>{user?.name?.split(' ')[0]}</span>
            </h1>
            <p style={{ color: '#666', fontSize: '15px', fontWeight: 500, marginBottom: '24px' }}>Here is what is happening with your content today.</p>

            <Button
              onClick={() => router.push('/dashboard/articles/new')}
              style={{
                backgroundColor: '#1a1a1a',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Plus size={18} />
              Create New Article
            </Button>
          </div>

          <div className="dashboard-stats-row" style={{ display: 'flex', gap: '20px' }}>
            <div className="dashboard-stat-card" style={{ backgroundColor: '#fff', padding: '24px 32px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', minWidth: '160px', border: '1px solid #f0f0f0' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Views</p>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1a1a1a' }}>{stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : stats.totalViews}</p>
            </div>
            <div className="dashboard-stat-card" style={{ backgroundColor: '#fff', padding: '24px 32px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', minWidth: '160px', border: '1px solid #f0f0f0' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Published</p>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1a1a1a' }}>{stats.totalPublished}</p>
            </div>
          </div>
        </section>

        {/* RESTORING: Dynamic Subscription Banner Section */}
        <div className="dashboard-banner" style={{ padding: '0 40px', marginBottom: '40px', marginTop: '-20px', position: 'relative', zIndex: 10 }}>
          <SubscriptionBanner />
        </div>

        <section className="dashboard-main-section" style={{ padding: '0 40px', display: 'flex', gap: '32px' }}>

          {/* Main Feed */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Recent Articles Card */}
            <div className="dashboard-card" style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#1a1a1a' }}>Recent Articles</h3>
                <Link href="/dashboard/articles" style={{ fontSize: '11px', fontWeight: 800, color: '#999', textDecoration: 'none', textTransform: 'uppercase' }}>View All</Link>
              </div>

              <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #f5f5f5' }}>
                    <th style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Title</th>
                    <th style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Created</th>
                    <th style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Words</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} style={{ borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }} onClick={() => router.push(`/dashboard/articles/${article.id}`)}>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>{article.title}</div>
                      </td>
                      <td style={{ padding: '20px 32px' }}>
                        <span style={{
                          backgroundColor: article.status === 'PUBLISHED' ? '#e7f9ee' : '#f9f9f9',
                          color: article.status === 'PUBLISHED' ? '#22c55e' : '#999',
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>{article.status}</span>
                      </td>
                      <td style={{ padding: '20px 32px', fontSize: '13px', color: '#666', fontWeight: 600 }}>{formatDate(article.createdAt)}</td>
                      <td style={{ padding: '20px 32px', fontSize: '13px', color: '#666', fontWeight: 600 }}>{article.wordCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {articles.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
                  <Files size={40} color="#eee" style={{ marginBottom: '12px' }} />
                  <p style={{ color: '#999', fontWeight: 600 }}>No articles yet</p>
                </div>
              )}
            </div>

            {/* RESTORING: Dynamic Activity log from original */}
            <div style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>Activity Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px',
                      backgroundColor: activity.type === 'published' ? '#22c55e' : '#facc15'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a1a', fontWeight: 700 }}>{activity.article.title}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#999', fontWeight: 600 }}>
                        {activity.type === 'published' ? 'Published' : 'Created'} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: '#999', fontSize: '14px' }}>No recent activities.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="dashboard-sidebar" style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* RESTORING: REAL Platform Status (Filtered from connections) */}
            <div style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>Platform Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {['WORDPRESS', 'GHOST', 'DEVTO', 'HASHNODE', 'WIX'].map((plat) => {
                  const conn = connections.find(c => c.platform === plat)
                  return (
                    <div key={plat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: conn ? '#22c55e' : '#eee' }}></div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{plat}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: conn ? '#22c55e' : '#999' }}>
                        {conn ? 'CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </div>
                  )
                })}
              </div>
              <Link href="/dashboard/integrations" style={{
                display: 'block', marginTop: '24px', textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#FF7A33', textDecoration: 'none'
              }}>MANAGE CONNECTIONS</Link>
            </div>

            {/* Quick Stats Banner - Themed */}
            <div style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>Productivity</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#666', fontWeight: 500 }}>You have published {stats.totalPublished} stories so far.</p>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '4px', width: `${completionRate}%`, backgroundColor: '#FF7A33', boxShadow: '0 0 10px rgba(255, 122, 51, 0.3)' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', fontWeight: 800, color: '#1a1a1a' }}>
                <span>Progress</span>
                <span style={{ color: '#FF7A33' }}>{Math.round(completionRate)}%</span>
              </div>
            </div>

            {/* Updates Section */}
            <div style={{ backgroundColor: '#fafafa', borderRadius: '32px', border: '1px solid #eee', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>System Update</h3>
                <Sparkles size={16} color="#FF7A33" />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 800, color: '#1a1a1a' }}>New: Multi-Platform Sync</p>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#666', lineHeight: '1.6' }}>
                  Restored all dynamic analytics syncing across Ghost, Medium and more.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
