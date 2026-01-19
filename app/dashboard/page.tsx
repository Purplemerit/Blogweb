"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/AuthContext"
import { PLAN_NAMES } from "@/lib/subscription/features"
import { SubscriptionBanner } from "@/components/SubscriptionBanner"
import {
  Plus,
  TrendingUp,
  FileText,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Calendar,
  Target,
  Zap,
  BarChart3,
  Globe,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Edit3,
  BookOpen,
} from "lucide-react"
import { toast } from "sonner"

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

function DashboardContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
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
  const [loadingData, setLoadingData] = useState(true)
  const [greeting, setGreeting] = useState('')

  // Handle OAuth callback tokens
  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      // Remove tokens from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)

      // Reload to trigger auth context
      window.location.reload()
    }
  }, [searchParams])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

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

      // Fetch articles and stats in PARALLEL for faster loading
      const [articlesResponse, statsResponse] = await Promise.all([
        fetch('/api/articles?limit=10', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/user/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ])

      // Process articles response
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json()
        const fetchedArticles = articlesData.data.articles || []
        setArticles(fetchedArticles)

        // Generate recent activity from articles
        const activity: ActivityItem[] = fetchedArticles
          .slice(0, 5)
          .map((article: Article) => ({
            type: article.status === 'PUBLISHED' ? 'published' : 'created',
            article: {
              title: article.title,
              id: article.id,
            },
            timestamp: article.publishedAt || article.createdAt,
          }))
        setRecentActivity(activity)
      }

      // Process stats response
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats({
          totalArticles: statsData.data.totalArticles || 0,
          totalPublished: statsData.data.totalPublished || 0,
          totalViews: statsData.data.totalViews || 0,
          articlesThisWeek: statsData.data.articlesCreatedThisMonth || 0,
          drafts: statsData.data.totalDrafts || 0,
          scheduled: statsData.data.totalScheduled || 0,
        })
      }

      setLoadingData(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoadingData(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PUBLISHED: { color: 'bg-green-50 text-green-700 ring-green-600/20', label: 'Published', icon: CheckCircle },
      DRAFT: { color: 'bg-gray-50 text-gray-600 ring-gray-500/10', label: 'Draft', icon: Edit3 },
      SCHEDULED: { color: 'bg-blue-50 text-blue-700 ring-blue-700/10', label: 'Scheduled', icon: Clock },
      ARCHIVED: { color: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20', label: 'Archived', icon: FileText }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const Icon = config.icon

    return (
      <Badge variant="outline" className={`${config.color} ring-1 ring-inset border-0 text-[10px] font-medium px-2 py-1 flex items-center gap-1.5 w-fit rounded-md`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getChangeIndicator = (current: number, previous: number = 0) => {
    if (previous === 0) return null
    const change = ((current - previous) / previous) * 100
    const isPositive = change > 0

    return (
      <div className={`flex items-center gap-1 text-[11px] font-medium ${isPositive ? 'text-[#1f3529]' : 'text-neutral-500'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change).toFixed(1)}%
      </div>
    )
  }

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f5f1e8' }}>
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" style={{ color: '#1f3529' }} />
          <p className="text-sm text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const completionRate = stats.totalArticles > 0 ? (stats.totalPublished / stats.totalArticles) * 100 : 0



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {greeting}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Overview of your content performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/dashboard/articles/new')}
              className="bg-black text-white hover:bg-gray-800 h-10 px-4 text-sm font-medium transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>

        {/* Subscription Banner */}
        <div className="mb-6">
          <SubscriptionBanner />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border border-gray-100 shadow-sm bg-white rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Total Articles</span>
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.totalArticles}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Lifetime content
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm bg-white rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Published</span>
                <CheckCircle className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.totalPublished}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-full bg-gray-100 rounded-full h-1.5 flex-1 max-w-[100px]">
                  <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
                </div>
                <span className="text-xs text-gray-400">{completionRate.toFixed(0)}% rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm bg-white rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Values</span>
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(1)}k` : stats.totalViews}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Total page views
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm bg-white rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">This Month</span>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.articlesThisWeek}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Articles created
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Articles */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Recent Articles</h3>
                <Link href="/dashboard/articles" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                  View All
                </Link>
              </div>
              <div>
                {articles.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">No articles found</p>
                    <Button
                      onClick={() => router.push('/dashboard/articles/new')}
                      variant="outline"
                      className="text-xs"
                    >
                      Create first article
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {articles.slice(0, 5).map((article) => (
                      <div
                        key={article.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group"
                        onClick={() => router.push(`/dashboard/articles/${article.id}`)}
                      >
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(article.publishedAt || article.createdAt)}
                            </span>
                            <span>•</span>
                            <span>{article.wordCount} words</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(article.status)}
                          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/dashboard/analytics')}
                className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <BarChart3 className="h-5 w-5 text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
                <div className="font-medium text-sm text-gray-900">Analytics</div>
                <div className="text-xs text-gray-500 mt-1">Check performance</div>
              </button>

              <button
                onClick={() => router.push('/dashboard/integrations')}
                className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <Globe className="h-5 w-5 text-gray-400 group-hover:text-purple-600 mb-3 transition-colors" />
                <div className="font-medium text-sm text-gray-900">Platforms</div>
                <div className="text-xs text-gray-500 mt-1">Manage connections</div>
              </button>

              <button
                onClick={() => router.push('/dashboard/articles')}
                className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-green-600 mb-3 transition-colors" />
                <div className="font-medium text-sm text-gray-900">Library</div>
                <div className="text-xs text-gray-500 mt-1">All content</div>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Simple Upgrade Callout - only for free plan */}
            {user?.subscriptionPlan === 'FREE' && (
              <div className="bg-gray-900 text-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-sm mb-2">Upgrade to Pro</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Get unlimited articles, analytics, and platform connections.
                </p>
                <Button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-white text-black hover:bg-gray-100 text-xs font-medium h-9"
                >
                  View Plans
                </Button>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Activity Log</h3>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${activity.type === 'published' ? 'bg-green-500' :
                        activity.type === 'updated' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{activity.article.title}</p>
                        <p className="text-[11px] text-gray-500">
                          {activity.type === 'published' ? 'Published' : activity.type === 'updated' ? 'Updated' : 'Created'} • {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
