"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/AuthContext"
import { PLAN_NAMES } from "@/lib/subscription/features"
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

export default function DashboardPage() {
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

      // Fetch articles
      const articlesResponse = await fetch('/api/articles?limit=10', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

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

      // Fetch stats
      const statsResponse = await fetch('/api/user/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

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
      PUBLISHED: { color: 'bg-[#1f3529] text-white border-[#1f3529]', label: 'Published', icon: CheckCircle },
      DRAFT: { color: 'bg-white text-neutral-600 border-neutral-300', label: 'Draft', icon: Edit3 },
      SCHEDULED: { color: 'bg-[#ebe4d5] text-[#1f3529] border-[#1f3529]', label: 'Scheduled', icon: Clock },
      ARCHIVED: { color: 'bg-neutral-100 text-neutral-500 border-neutral-200', label: 'Archived', icon: FileText }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-[11px] font-medium border px-2.5 py-0.5 flex items-center gap-1 w-fit`}>
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
    <div className="min-h-screen" style={{ backgroundColor: '#f5f1e8' }}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-2">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight leading-tight" style={{ color: '#1f3529' }}>
                {greeting}, {user?.name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-[15px] text-neutral-600 mt-1.5">
                Here's what's happening with your content today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.subscriptionPlan && (
                <Badge className="text-white border-0 px-3.5 py-1.5 text-[12px] font-semibold" style={{ backgroundColor: '#1f3529' }}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  {PLAN_NAMES[user.subscriptionPlan]}
                </Badge>
              )}
              <Button
                onClick={() => router.push('/dashboard/articles/new')}
                className="text-white h-11 px-5 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1f3529' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <Card className="border border-neutral-200 bg-white shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-start justify-between mb-5">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center border border-neutral-200" style={{ backgroundColor: '#ebe4d5' }}>
                  <FileText className="h-6 w-6" style={{ color: '#1f3529' }} />
                </div>
                {getChangeIndicator(stats.totalArticles, stats.totalArticles - stats.articlesThisWeek)}
              </div>
              <div className="text-[32px] font-bold mb-1.5 leading-none" style={{ color: '#1f3529' }}>
                {stats.totalArticles}
              </div>
              <div className="text-[13px] text-neutral-600 font-medium">Total Articles</div>
              <div className="text-[11px] text-neutral-500 mt-2">
                {stats.articlesThisWeek} created this month
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 bg-white shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-start justify-between mb-5">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#1f3529' }}>
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: '#1f3529' }}>
                  <Target className="h-3 w-3" />
                  {completionRate.toFixed(0)}%
                </div>
              </div>
              <div className="text-[32px] font-bold mb-1.5 leading-none" style={{ color: '#1f3529' }}>
                {stats.totalPublished}
              </div>
              <div className="text-[13px] text-neutral-600 font-medium">Published</div>
              <div className="text-[11px] text-neutral-500 mt-2">
                {stats.drafts} drafts remaining
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 bg-white shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-start justify-between mb-5">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center border border-neutral-200" style={{ backgroundColor: '#ebe4d5' }}>
                  <Eye className="h-6 w-6" style={{ color: '#1f3529' }} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                  <TrendingUp className="h-3 w-3" />
                  Live
                </div>
              </div>
              <div className="text-[32px] font-bold mb-1.5 leading-none" style={{ color: '#1f3529' }}>
                {stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : stats.totalViews}
              </div>
              <div className="text-[13px] text-neutral-600 font-medium">Total Views</div>
              <div className="text-[11px] text-neutral-500 mt-2">
                {stats.totalPublished > 0 ? Math.round(stats.totalViews / stats.totalPublished) : 0} avg per article
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 bg-white shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-start justify-between mb-5">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center border border-neutral-200" style={{ backgroundColor: '#ebe4d5' }}>
                  <Zap className="h-6 w-6" style={{ color: '#1f3529' }} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                  <Calendar className="h-3 w-3" />
                  Month
                </div>
              </div>
              <div className="text-[32px] font-bold mb-1.5 leading-none" style={{ color: '#1f3529' }}>
                {stats.articlesThisWeek}
              </div>
              <div className="text-[13px] text-neutral-600 font-medium">This Month</div>
              <div className="text-[11px] text-neutral-500 mt-2">
                Keep the momentum going!
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Articles */}
            <Card className="border border-neutral-200 shadow-sm bg-white">
              <CardHeader className="px-7 py-5 border-b border-neutral-200" style={{ backgroundColor: '#ebe4d5' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1f3529' }}>
                      <FileText className="h-4.5 w-4.5 text-white" />
                    </div>
                    <CardTitle className="text-[17px] font-bold" style={{ color: '#1f3529' }}>Recent Articles</CardTitle>
                  </div>
                  <Link href="/dashboard/articles" className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-80" style={{ color: '#1f3529' }}>
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {articles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-8">
                    <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
                      <FileText className="h-10 w-10 text-neutral-400" />
                    </div>
                    <h3 className="text-[17px] font-semibold mb-2.5" style={{ color: '#1f3529' }}>No articles yet</h3>
                    <p className="text-[14px] text-neutral-500 mb-7 text-center max-w-sm leading-relaxed">
                      Start creating amazing content with our AI-powered writing tools
                    </p>
                    <Button
                      className="text-white h-11 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#1f3529' }}
                      onClick={() => router.push('/dashboard/articles/new')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Article
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {articles.slice(0, 5).map((article) => (
                      <div
                        key={article.id}
                        className="px-7 py-5 hover:bg-neutral-50 transition-colors cursor-pointer group"
                        onClick={() => router.push(`/dashboard/articles/${article.id}`)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2.5">
                              <h3 className="text-[15px] font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors truncate">
                                {article.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-5 text-[13px] text-neutral-500">
                              <span className="flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5" />
                                {article.wordCount} words
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(article.publishedAt || article.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3.5">
                            {getStatusBadge(article.status)}
                            <ArrowUpRight className="h-4.5 w-4.5 text-neutral-400 group-hover:text-emerald-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-neutral-200 shadow-sm bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader className="px-7 py-5 border-b border-neutral-200 bg-gradient-to-r from-white to-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-[18px] font-bold text-neutral-900">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => router.push('/dashboard/articles/new')}
                    className="group relative overflow-hidden rounded-xl border-2 border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-5 text-left transition-all duration-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-[15px] font-bold text-neutral-900 mb-1 group-hover:text-emerald-700 transition-colors">New Article</div>
                        <div className="text-[12px] text-neutral-600 leading-relaxed">Create content with AI</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/analytics')}
                    className="group relative overflow-hidden rounded-xl border-2 border-purple-200/60 bg-gradient-to-br from-purple-50 to-white p-5 text-left transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-[15px] font-bold text-neutral-900 mb-1 group-hover:text-purple-700 transition-colors">Analytics</div>
                        <div className="text-[12px] text-neutral-600 leading-relaxed">Track performance</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/integrations')}
                    className="group relative overflow-hidden rounded-xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-50 to-white p-5 text-left transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-[15px] font-bold text-neutral-900 mb-1 group-hover:text-blue-700 transition-colors">Platforms</div>
                        <div className="text-[12px] text-neutral-600 leading-relaxed">Connect & publish</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/dashboard/articles')}
                    className="group relative overflow-hidden rounded-xl border-2 border-orange-200/60 bg-gradient-to-br from-orange-50 to-white p-5 text-left transition-all duration-300 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-110 transition-transform">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-[15px] font-bold text-neutral-900 mb-1 group-hover:text-orange-700 transition-colors">All Articles</div>
                        <div className="text-[12px] text-neutral-600 leading-relaxed">Manage library</div>
                      </div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Activity Feed */}
            <Card className="border border-neutral-200 shadow-sm">
              <CardHeader className="px-7 py-5 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Clock className="h-4.5 w-4.5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-[17px] font-bold text-neutral-900">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-7">
                {recentActivity.length > 0 ? (
                  <div className="space-y-5">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'published'
                            ? 'bg-emerald-100'
                            : activity.type === 'updated'
                            ? 'bg-blue-100'
                            : 'bg-amber-100'
                        }`}>
                          {activity.type === 'published' && <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />}
                          {activity.type === 'updated' && <Edit3 className="h-4.5 w-4.5 text-blue-600" />}
                          {activity.type === 'created' && <FileText className="h-4.5 w-4.5 text-amber-600" />}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-[14px] text-neutral-900 font-medium truncate leading-snug">
                            {activity.article.title}
                          </p>
                          <p className="text-[12px] text-neutral-500 mt-1">
                            {activity.type === 'published' && 'Published'}
                            {activity.type === 'updated' && 'Updated'}
                            {activity.type === 'created' && 'Created'} • {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] text-neutral-500 text-center py-10">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="border border-neutral-200 shadow-sm bg-gradient-to-br from-white to-emerald-50">
              <CardHeader className="px-7 py-5 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Target className="h-4.5 w-4.5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-[17px] font-bold text-neutral-900">Publishing Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-7">
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[14px] font-medium text-neutral-700">Completion Rate</span>
                    <span className="text-[14px] font-bold text-emerald-600">{completionRate.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 rounded-full"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-3.5 pt-5 border-t border-emerald-100">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-neutral-600">Total Articles</span>
                    <span className="font-semibold text-neutral-900">{stats.totalArticles}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-neutral-600">Published</span>
                    <span className="font-semibold text-emerald-600">{stats.totalPublished}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-neutral-600">Drafts</span>
                    <span className="font-semibold text-amber-600">{stats.drafts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            {user?.subscriptionPlan === 'FREE' && (
              <Card className="border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                <CardContent className="p-8 relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-extrabold tracking-tight">Upgrade to Pro</h3>
                      <p className="text-[11px] text-white/80 font-medium">Supercharge your content</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 mt-5">
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />
                      </div>
                      <p className="text-[13px] text-white/95 leading-relaxed">Unlimited articles & AI generations</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />
                      </div>
                      <p className="text-[13px] text-white/95 leading-relaxed">Advanced SEO & analytics tools</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />
                      </div>
                      <p className="text-[13px] text-white/95 leading-relaxed">Priority support & early features</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-white hover:bg-white/95 text-purple-700 font-bold shadow-xl shadow-black/20 border-0 h-12 text-[14px] group/btn relative overflow-hidden"
                    onClick={() => router.push('/pricing')}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-purple-400/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center justify-center gap-2">
                      View Plans & Pricing
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>

                  <p className="text-center text-[11px] text-white/70 mt-3.5 font-medium">
                    ✨ Start your 14-day free trial today
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="border border-neutral-200 shadow-sm">
              <CardHeader className="px-7 py-5 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Sparkles className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <CardTitle className="text-[17px] font-bold text-neutral-900">Pro Tip</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-7">
                <p className="text-[14px] text-neutral-700 leading-relaxed">
                  Use our AI-powered content generator to create SEO-optimized articles in minutes. Try it with your next post!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
