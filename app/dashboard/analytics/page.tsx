"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Archive,
  Download,
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
  LineChart,
  Line,
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

  // Overview data
  const [stats, setStats] = useState<any>(null)

  // Platform analytics data
  const [platformTotals, setPlatformTotals] = useState({
    views: 0,
    uniqueVisitors: 0,
    likes: 0,
    comments: 0,
  })
  const [byPlatform, setByPlatform] = useState<PlatformStat[]>([])
  const [byArticle, setByArticle] = useState<ArticleAnalytics[]>([])
  const [lastSync, setLastSync] = useState<string | null>(null)

  // Comparison data
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user])

  const fetchAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchOverviewStats(),
      fetchPlatformAnalytics()
    ])
    setLoading(false)
  }

  const fetchOverviewStats = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/analytics/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPlatformAnalytics = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPlatformTotals(data.data.totals)
        setByPlatform(data.data.byPlatform)
        setByArticle(data.data.byArticle)
        setLastSync(data.data.lastSync)
        setSelectedPlatforms(data.data.byPlatform?.map((p: PlatformStat) => p.platform) || [])
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const syncAnalytics = async () => {
    try {
      setSyncing(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        await fetchAllData()
      } else {
        toast.error(data.error || 'Failed to sync analytics')
      }
    } catch (error) {
      console.error('Error syncing analytics:', error)
      toast.error('Failed to sync analytics')
    } finally {
      setSyncing(false)
    }
  }

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      'PUBLISHTYPE': 'PublishType',
      'WORDPRESS': 'WordPress',
      'DEVTO': 'Dev.to',
      'HASHNODE': 'Hashnode',
      'GHOST': 'Ghost',
      'WIX': 'Wix',
    }
    return names[platform] || platform
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, { bg: string, text: string, border: string, chart: string }> = {
      'PUBLISHTYPE': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', chart: '#10b981' },
      'WORDPRESS': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', chart: '#3b82f6' },
      'DEVTO': { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200', chart: '#525252' },
      'HASHNODE': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', chart: '#2563eb' },
      'GHOST': { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200', chart: '#737373' },
      'WIX': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', chart: '#f97316' },
    }
    return colors[platform] || { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200', chart: '#9ca3af' }
  }

  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  const filteredPlatforms = byPlatform.filter(p => selectedPlatforms.includes(p.platform))

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-neutral-900 mb-1 tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-[13px] text-neutral-500">
            Track your content performance across all platforms
          </p>
          {lastSync && activeTab === "platforms" && (
            <p className="text-[11px] text-neutral-400 mt-1">
              Last synced: {new Date(lastSync).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => window.location.href = '/dashboard/export?tab=analytics'}
            variant="outline"
            className="h-9 text-[13px] flex-1 md:flex-initial"
          >
            <Download className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Export Analytics</span>
            <span className="md:hidden">Export</span>
          </Button>
          <Button
            onClick={syncAnalytics}
            disabled={syncing}
            className="bg-emerald-600 hover:bg-emerald-700 h-9 text-[13px] flex-1 md:flex-initial"
          >
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 md:mr-2 animate-spin" />
                <span className="hidden md:inline">Syncing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sync Analytics</span>
                <span className="md:hidden">Sync</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-2 -mx-8 px-8">
          <TabsList className="bg-neutral-100 p-1 inline-flex w-full md:w-auto min-w-full md:min-w-0">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white flex-1 md:flex-initial text-xs md:text-sm">
              <FileText className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-white flex-1 md:flex-initial text-xs md:text-sm">
              <Globe className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Platform</span>
              <span className="hidden md:inline"> Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="data-[state=active]:bg-white flex-1 md:flex-initial text-xs md:text-sm">
              <BarChart3 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Compare</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {stats ? (
            <>
              {/* Article Statistics */}
              <div>
                <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">Article Statistics</h2>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border border-neutral-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[11px]">
                          Total
                        </Badge>
                      </div>
                      <div className="text-[28px] font-bold text-neutral-900 mb-1">
                        {stats.articles.total}
                      </div>
                      <div className="text-[12px] text-neutral-500">Total Articles</div>
                      <div className="text-[11px] text-neutral-400 mt-2">
                        {stats.articles.totalWords.toLocaleString()} total words
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-neutral-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Send className="h-5 w-5 text-emerald-600" />
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                          Published
                        </Badge>
                      </div>
                      <div className="text-[28px] font-bold text-neutral-900 mb-1">
                        {stats.articles.published}
                      </div>
                      <div className="text-[12px] text-neutral-500">Published Articles</div>
                      <div className="text-[11px] text-neutral-400 mt-2">
                        {stats.articles.published > 0 ? Math.round((stats.articles.published / stats.articles.total) * 100) : 0}% of total
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-neutral-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px]">
                          Draft
                        </Badge>
                      </div>
                      <div className="text-[28px] font-bold text-neutral-900 mb-1">
                        {stats.articles.draft}
                      </div>
                      <div className="text-[12px] text-neutral-500">Draft Articles</div>
                      <div className="text-[11px] text-neutral-400 mt-2">
                        {stats.articles.draft > 0 ? Math.round((stats.articles.draft / stats.articles.total) * 100) : 0}% of total
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-neutral-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Eye className="h-5 w-5 text-purple-600" />
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[11px]">
                          Views
                        </Badge>
                      </div>
                      <div className="text-[28px] font-bold text-neutral-900 mb-1">
                        {stats.articles.totalViews.toLocaleString()}
                      </div>
                      <div className="text-[12px] text-neutral-500">Total Views</div>
                      <div className="text-[11px] text-neutral-400 mt-2">
                        Across all articles
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Charts */}
              <div className="grid gap-5 md:grid-cols-2">
                <Card className="border border-neutral-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">
                      Article Status Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Published', value: stats.articles.published, color: '#10b981' },
                            { name: 'Draft', value: stats.articles.draft, color: '#f59e0b' },
                            { name: 'Scheduled', value: stats.articles.scheduled, color: '#3b82f6' },
                            { name: 'Archived', value: stats.articles.archived, color: '#9ca3af' },
                          ].filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Published', value: stats.articles.published, color: '#10b981' },
                            { name: 'Draft', value: stats.articles.draft, color: '#f59e0b' },
                            { name: 'Scheduled', value: stats.articles.scheduled, color: '#3b82f6' },
                            { name: 'Archived', value: stats.articles.archived, color: '#9ca3af' },
                          ].filter(item => item.value > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-neutral-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">
                      Articles per Platform
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={stats.platforms.articlesPerPlatform.map((item: any) => ({
                          name: getPlatformName(item.platform),
                          articles: item.uniqueArticles,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          stroke="#9ca3af"
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          stroke="#9ca3af"
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="articles" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Articles */}
              {stats.topArticles && stats.topArticles.length > 0 && (
                <div>
                  <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">
                    Top Performing Articles
                  </h2>
                  <Card className="border border-neutral-200 shadow-sm">
                    <CardContent className="p-0">
                      <div className="divide-y divide-neutral-100">
                        {stats.topArticles.map((article: any, index: number) => (
                          <div key={article.id} className="p-5 hover:bg-neutral-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-[20px] font-bold text-neutral-300">
                                    #{index + 1}
                                  </span>
                                  <h3 className="text-[14px] font-semibold text-neutral-900">
                                    {article.title}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-4 text-[12px] text-neutral-500">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {article.views.toLocaleString()} views
                                  </span>
                                  <span>•</span>
                                  <span>{article.platformCount} platform(s)</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 justify-end">
                                {article.platforms.map((platform: string) => (
                                  <Badge
                                    key={platform}
                                    variant="outline"
                                    className={`${getPlatformColor(platform).bg} ${getPlatformColor(platform).text} ${getPlatformColor(platform).border} text-[10px] px-2 py-0.5`}
                                  >
                                    {getPlatformName(platform)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          ) : (
            <Card className="border border-neutral-200 shadow-sm p-16 text-center">
              <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-[16px] font-semibold mb-2 text-neutral-900">No Data Yet</h3>
              <p className="text-[13px] text-neutral-500 mb-6">
                Create some articles to see your analytics
              </p>
              <Button onClick={() => router.push('/dashboard/articles')}>
                Create Article
              </Button>
            </Card>
          )}
        </TabsContent>

        {/* Platform Analytics Tab */}
        <TabsContent value="platforms" className="space-y-6">
          {/* Totals Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-neutral-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                    Total
                  </Badge>
                </div>
                <div className="text-[24px] font-bold text-neutral-900 mb-1">
                  {platformTotals.views.toLocaleString()}
                </div>
                <div className="text-[12px] text-neutral-500">Total Views</div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-rose-600" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                    Total
                  </Badge>
                </div>
                <div className="text-[24px] font-bold text-neutral-900 mb-1">
                  {platformTotals.likes.toLocaleString()}
                </div>
                <div className="text-[12px] text-neutral-500">Total Likes</div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                    Total
                  </Badge>
                </div>
                <div className="text-[24px] font-bold text-neutral-900 mb-1">
                  {platformTotals.comments.toLocaleString()}
                </div>
                <div className="text-[12px] text-neutral-500">Total Comments</div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                    Avg
                  </Badge>
                </div>
                <div className="text-[24px] font-bold text-neutral-900 mb-1">
                  {byArticle.length > 0 ? Math.round(platformTotals.views / byArticle.length).toLocaleString() : 0}
                </div>
                <div className="text-[12px] text-neutral-500">Views per Article</div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Stats */}
          <div>
            <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">By Platform</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {byPlatform.map((platform) => {
                const isPublishType = platform.platform.toUpperCase() === 'PUBLISHTYPE'
                return (
                  <Card
                    key={platform.platform}
                    className={`border border-neutral-200 shadow-sm transition-shadow ${
                      isPublishType ? 'cursor-default' : 'hover:shadow-md cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isPublishType) {
                        router.push(`/dashboard/analytics/${platform.platform.toLowerCase()}`)
                      }
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <Badge variant="outline" className={`${getPlatformColor(platform.platform).bg} ${getPlatformColor(platform.platform).text} ${getPlatformColor(platform.platform).border} text-[11px] font-medium`}>
                          {getPlatformName(platform.platform)}
                        </Badge>
                        {!isPublishType && <ExternalLink className="h-4 w-4 text-neutral-400" />}
                      </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[20px] font-bold text-neutral-900">
                          {platform.totalViews.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-neutral-500">Views</div>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-neutral-500">Articles:</span>
                        <span className="font-medium text-neutral-900">{platform.articles}</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-neutral-500">Likes:</span>
                        <span className="font-medium text-neutral-900">{platform.totalLikes}</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-neutral-500">Comments:</span>
                        <span className="font-medium text-neutral-900">{platform.totalComments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          </div>

          {/* Top Performing Articles */}
          {byArticle.length > 0 && (
            <div>
              <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">Top Performing Articles</h2>
              <div className="space-y-4">
                {byArticle
                  .sort((a, b) => b.totalViews - a.totalViews)
                  .slice(0, 10)
                  .map((article) => (
                    <Card key={article.articleId} className="border border-neutral-200 shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-[14px] font-semibold text-neutral-900 mb-1">
                              {article.articleTitle}
                            </h3>
                            <div className="flex items-center gap-4 text-[12px] text-neutral-500">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.totalViews.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {article.totalLikes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {article.totalComments}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {article.platforms.map((platform, idx) => (
                            <a
                              key={idx}
                              href={platform.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-md text-[11px] font-medium transition-colors border border-neutral-200"
                            >
                              {getPlatformName(platform.platform)}
                              <span className="text-neutral-400">•</span>
                              {platform.views} views
                              {platform.url && <ExternalLink className="h-3 w-3 ml-1" />}
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {byArticle.length === 0 && (
            <Card className="border border-neutral-200 shadow-sm p-16 text-center">
              <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-[16px] font-semibold mb-2 text-neutral-900">No Analytics Yet</h3>
              <p className="text-[13px] text-neutral-500 mb-6">
                Publish some articles and sync analytics to see your performance data
              </p>
              <Button
                onClick={syncAnalytics}
                disabled={syncing}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {syncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Analytics
                  </>
                )}
              </Button>
            </Card>
          )}
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare" className="space-y-6">
          {byPlatform.length > 0 ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <Card className="border border-neutral-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">
                      Platform Metrics Comparison
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={byPlatform.map(p => ({
                          name: getPlatformName(p.platform),
                          Views: p.totalViews,
                          Likes: p.totalLikes,
                          Comments: p.totalComments,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="Views" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Likes" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Comments" fill="#a855f7" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-neutral-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">
                      Performance Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={byPlatform.map(p => ({
                        platform: getPlatformName(p.platform),
                        Views: p.totalViews,
                        Likes: p.totalLikes,
                        Comments: p.totalComments,
                        Articles: p.articles,
                      }))}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="platform" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={90} tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Radar name="Views" dataKey="Views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        <Radar name="Likes" dataKey="Likes" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                        <Radar name="Comments" dataKey="Comments" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Table */}
              <Card className="border border-neutral-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">
                    Detailed Metrics
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left text-[12px] font-semibold text-neutral-700 pb-3">Platform</th>
                          <th className="text-right text-[12px] font-semibold text-neutral-700 pb-3">Views</th>
                          <th className="text-right text-[12px] font-semibold text-neutral-700 pb-3">Likes</th>
                          <th className="text-right text-[12px] font-semibold text-neutral-700 pb-3">Comments</th>
                          <th className="text-right text-[12px] font-semibold text-neutral-700 pb-3">Articles</th>
                          <th className="text-right text-[12px] font-semibold text-neutral-700 pb-3">Avg Views</th>
                          <th className="text-right text-[12px] font-semibold text-neutral-700 pb-3">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byPlatform.map((platform) => (
                          <tr key={platform.platform} className="border-b border-neutral-100">
                            <td className="py-3">
                              <Badge
                                variant="outline"
                                className={`${getPlatformColor(platform.platform).bg} ${getPlatformColor(platform.platform).text} ${getPlatformColor(platform.platform).border} text-[11px]`}
                              >
                                {getPlatformName(platform.platform)}
                              </Badge>
                            </td>
                            <td className="text-right text-[13px] font-medium text-neutral-900">{platform.totalViews.toLocaleString()}</td>
                            <td className="text-right text-[13px] font-medium text-neutral-900">{platform.totalLikes.toLocaleString()}</td>
                            <td className="text-right text-[13px] font-medium text-neutral-900">{platform.totalComments.toLocaleString()}</td>
                            <td className="text-right text-[13px] font-medium text-neutral-900">{platform.articles}</td>
                            <td className="text-right text-[13px] font-medium text-neutral-900">
                              {platform.articles > 0 ? Math.round(platform.totalViews / platform.articles).toLocaleString() : 0}
                            </td>
                            <td className="text-right text-[13px] font-medium text-emerald-600">
                              {platform.totalViews > 0 ? `${((platform.totalLikes / platform.totalViews) * 100).toFixed(2)}%` : '0%'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border border-neutral-200 shadow-sm p-16 text-center">
              <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-[16px] font-semibold mb-2 text-neutral-900">No Platforms to Compare</h3>
              <p className="text-[13px] text-neutral-500 mb-6">
                Publish articles to different platforms and sync analytics to start comparing
              </p>
              <Button
                onClick={syncAnalytics}
                disabled={syncing}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {syncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Analytics
                  </>
                )}
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    }>
      <AnalyticsContent />
    </Suspense>
  )
}
