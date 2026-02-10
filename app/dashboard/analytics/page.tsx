"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Eye,
  Heart,
  MessageCircle,
  FileText,
  Send,
  Clock,
  Globe,
  TrendingUp,
  Loader2,
  RefreshCw,
  BarChart3,
  ExternalLink,
  Download,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/context/AuthContext"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface PlatformStat {
  platform: string
  totalViews: number
  totalLikes: number
  totalComments: number
  articles: number
}

interface ArticleAnalytics {
  articleId: string
  articleTitle: string
  articleSlug: string
  totalViews: number
  totalLikes: number
  totalComments: number
  platforms: Array<{
    platform: string
    views: number
    likes: number
    comments: number
    url: string | null
  }>
}

function AnalyticsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const [stats, setStats] = useState<any>(null)
  const [platformTotals, setPlatformTotals] = useState({ views: 0, likes: 0, comments: 0 })
  const [byPlatform, setByPlatform] = useState<PlatformStat[]>([])
  const [byArticle, setByArticle] = useState<ArticleAnalytics[]>([])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    if (user) fetchAllData()
  }, [user])

  const fetchAllData = async () => {
    setLoading(true)
    await Promise.all([fetchOverviewStats(), fetchPlatformAnalytics()])
    setLoading(false)
  }

  const fetchOverviewStats = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/analytics/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) { console.error(error) }
  }

  const fetchPlatformAnalytics = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/analytics', { headers: { 'Authorization': `Bearer ${token}` } })
      if (response.ok) {
        const data = await response.json()
        setPlatformTotals(data.data.totals)
        setByPlatform(data.data.byPlatform)
        setByArticle(data.data.byArticle)
      }
    } catch (error) { console.error(error) }
  }

  const syncAnalytics = async () => {
    try {
      setSyncing(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        await fetchAllData()
      } else {
        toast.error(data.error || 'Sync failed')
      }
    } catch (error) { toast.error('Sync failed') }
    finally { setSyncing(false) }
  }

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = { 'PUBLISHTYPE': 'PublishType', 'WORDPRESS': 'WordPress', 'DEVTO': 'Dev.to', 'HASHNODE': 'Hashnode', 'GHOST': 'Ghost', 'WIX': 'Wix' }
    return names[platform] || platform
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><Loader2 className="animate-spin" size={40} style={{ color: '#FF7A33' }} /></div>

  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          .analytics-hero {
            padding: 40px 20px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .analytics-hero h1 {
            font-size: 32px !important;
          }
          .analytics-hero-buttons {
            width: 100% !important;
            flex-direction: column !important;
          }
          .analytics-hero-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
          .analytics-content {
            padding: 40px 20px !important;
          }
          .analytics-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .analytics-charts-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .analytics-table-wrapper {
            overflow-x: auto !important;
          }
        }

        @media (max-width: 480px) {
          .analytics-hero {
            padding: 32px 16px !important;
          }
          .analytics-hero h1 {
            font-size: 28px !important;
            line-height: 1.2 !important;
          }
          .analytics-content {
            padding: 32px 12px !important;
          }
          .analytics-card {
            border-radius: 24px !important;
            padding: 24px !important;
          }
        }
      `}</style>

      <div style={{ paddingBottom: '100px' }}>
        {/* Hero Header */}
        <section className="analytics-hero" style={{
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
              Content <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: 'serif' }}>Analytics</span>
            </h1>
            <p style={{ color: '#666', fontSize: '15px', fontWeight: 500 }}>Track growth, engagement and performance across all platforms.</p>
          </div>

          <div className="analytics-hero-buttons" style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={syncAnalytics}
              disabled={syncing}
              style={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {syncing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
              {syncing ? 'SYNCING...' : 'SYNC ANALYTICS'}
            </button>
            <button
              style={{
                backgroundColor: '#fff',
                color: '#1a1a1a',
                padding: '14px 28px',
                borderRadius: '50px',
                border: '1px solid #eee',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Download size={16} /> EXPORT DATA
            </button>
          </div>
        </section>

        <section className="analytics-content" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            {['overview', 'platforms', 'comparison'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '50px',
                  border: activeTab === tab ? 'none' : '1px solid #eee',
                  backgroundColor: activeTab === tab ? '#FF7A33' : '#fff',
                  color: activeTab === tab ? '#fff' : '#666',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div className="analytics-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
                {[
                  { label: 'Total Articles', val: stats?.articles?.total || 0, icon: <FileText color="#FF7A33" />, sub: `${stats?.articles?.totalWords?.toLocaleString()} Words` },
                  { label: 'Published', val: stats?.articles?.published || 0, icon: <Send color="#22c55e" />, sub: `${Math.round((stats?.articles?.published / stats?.articles?.total) * 100) || 0}% Completion` },
                  { label: 'Total Views', val: stats?.articles?.totalViews?.toLocaleString() || 0, icon: <Eye color="#3b82f6" />, sub: 'Across platforms' },
                  { label: 'Total Likes', val: platformTotals.likes?.toLocaleString() || 0, icon: <Heart color="#ff4b2b" />, sub: 'Audience engagement' },
                ].map((s) => (
                  <div key={s.label} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '32px', border: '1px solid #eee', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {s.icon}
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Stats</span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: 800, color: '#1a1a1a' }}>{s.val}</p>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 600 }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="analytics-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800 }}>Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Published', value: stats?.articles?.published || 0, color: '#22c55e' },
                          { name: 'Draft', value: stats?.articles?.draft || 0, color: '#FF7A33' },
                          { name: 'Scheduled', value: stats?.articles?.scheduled || 0, color: '#3b82f6' }
                        ]}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[0, 1, 2].map((i) => <Cell key={i} fill={['#22c55e', '#FF7A33', '#3b82f6'][i]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', padding: '32px' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800 }}>Platform Presence</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats?.platforms?.articlesPerPlatform?.map((p: any) => ({ name: getPlatformName(p.platform), val: p.uniqueArticles }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                      <Tooltip cursor={{ fill: '#fcfcfc' }} />
                      <Bar dataKey="val" fill="#FF7A33" radius={[8, 8, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Articles List */}
              <div style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', overflow: 'hidden' }}>
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f9f9f9', backgroundColor: '#fafafa' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Top Performing Articles</h3>
                </div>
                <div style={{ padding: '0 32px' }}>
                  {stats?.topArticles?.map((art: any, i: number) => (
                    <div key={art.id} style={{ padding: '24px 0', borderBottom: i === stats.topArticles.length - 1 ? 'none' : '1px solid #f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: '#eee' }}>0{i + 1}</span>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800 }}>{art.title}</p>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            {art.platforms.map((p: string) => (
                              <span key={p} style={{ fontSize: '11px', fontWeight: 700, color: '#999' }}># {getPlatformName(p)}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{art.views.toLocaleString()}</p>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#999' }}>TOTAL VIEWS</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'platforms' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
              {byPlatform.map((p) => (
                <div key={p.platform} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '32px', border: '1px solid #eee', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ backgroundColor: '#fcfcfc', color: '#1a1a1a', padding: '6px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: 800, border: '1px solid #eee' }}>{getPlatformName(p.platform)}</span>
                    <TrendingUp size={16} color="#22c55e" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#999' }}>Views</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a' }}>{p.totalViews.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#999' }}>Articles</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a' }}>{p.articles}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#999' }}>Likes</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a' }}>{p.totalLikes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comparison' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', padding: '40px' }}>
                <h3 style={{ margin: '0 0 32px 0', fontSize: '18px', fontWeight: 800 }}>Platform Metrics Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={byPlatform.map(p => ({ platform: getPlatformName(p.platform), Views: p.totalViews, Likes: p.totalLikes, Comments: p.totalComments }))}>
                    <PolarGrid stroke="#f0f0f0" />
                    <PolarAngleAxis dataKey="platform" tick={{ fontSize: 11, fontWeight: 700 }} />
                    <PolarRadiusAxis axisLine={false} tick={false} />
                    <Radar name="Views" dataKey="Views" stroke="#FF7A33" fill="#FF7A33" fillOpacity={0.1} />
                    <Radar name="Likes" dataKey="Likes" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </section>
      </div>
    </>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><Loader2 className="animate-spin" size={40} style={{ color: '#FF7A33' }} /></div>}>
      <AnalyticsContent />
    </Suspense>
  )
}


