"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  FileText,
  Send,
  Clock,
  Globe,
  TrendingUp,
  Loader2,
  RefreshCw,
  Archive,
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
} from "recharts"

export default function AnalyticsOverviewPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/analytics/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      } else {
        toast.error('Failed to load statistics')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      'WORDPRESS': 'WordPress',
      'DEVTO': 'Dev.to',
      'HASHNODE': 'Hashnode',
      'GHOST': 'Ghost',
      'WIX': 'Wix',
    }
    return names[platform] || platform
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'WORDPRESS': 'bg-blue-100 text-blue-700',
      'DEVTO': 'bg-neutral-100 text-neutral-700',
      'HASHNODE': 'bg-blue-100 text-blue-700',
      'GHOST': 'bg-neutral-100 text-neutral-700',
      'WIX': 'bg-orange-100 text-orange-700',
    }
    return colors[platform] || 'bg-neutral-100 text-neutral-700'
  }

  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500">No data available</p>
          <Button onClick={fetchStats} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-neutral-900 mb-1 tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-[13px] text-neutral-500">
            Complete overview of your publishing activity
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/dashboard/analytics?tab=platforms')}
            variant="outline"
            className="h-9 text-[13px]"
          >
            <Globe className="h-4 w-4 mr-2" />
            Platform Analytics
          </Button>
          <Button
            onClick={fetchStats}
            className="bg-emerald-600 hover:bg-emerald-700 h-9 text-[13px]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Article Statistics */}
      <div className="mb-8">
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

      {/* Platform Statistics */}
      <div className="mb-8">
        <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">Platform Distribution</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="text-[20px] font-bold text-neutral-900 mb-1">
                  {stats.platforms.connected}
                </div>
                <div className="text-[12px] text-neutral-500">Connected Platforms</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.platforms.connectedPlatforms.map((platform: string) => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className={`${getPlatformColor(platform)} text-[11px]`}
                  >
                    {getPlatformName(platform)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {stats.platforms.articlesPerPlatform.map((item: any) => (
            <Card key={item.platform} className="border border-neutral-200 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className={`${getPlatformColor(item.platform)} text-[11px] mb-3`}
                  >
                    {getPlatformName(item.platform)}
                  </Badge>
                </div>
                <div className="text-[24px] font-bold text-neutral-900 mb-1">
                  {item.uniqueArticles}
                </div>
                <div className="text-[12px] text-neutral-500">Articles Published</div>
                {stats.platforms.stats.find((s: any) => s.platform === item.platform) && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Published:</span>
                      <span className="font-medium text-emerald-600">
                        {stats.platforms.stats.find((s: any) => s.platform === item.platform)?.published || 0}
                      </span>
                    </div>
                    {stats.platforms.stats.find((s: any) => s.platform === item.platform)?.failed > 0 && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Failed:</span>
                        <span className="font-medium text-red-600">
                          {stats.platforms.stats.find((s: any) => s.platform === item.platform)?.failed}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">
          Recent Activity (Last 30 Days)
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-[20px] font-bold text-neutral-900">
                  {stats.recentActivity.articlesCreated}
                </div>
              </div>
              <div className="text-[12px] text-neutral-500">Articles Created</div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Send className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-[20px] font-bold text-neutral-900">
                  {stats.recentActivity.articlesPublished}
                </div>
              </div>
              <div className="text-[12px] text-neutral-500">Articles Published</div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-[20px] font-bold text-neutral-900">
                  {stats.recentActivity.articlesDrafted}
                </div>
              </div>
              <div className="text-[12px] text-neutral-500">Drafts Saved</div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-[20px] font-bold text-neutral-900">
                  {stats.recentActivity.platformPublishes}
                </div>
              </div>
              <div className="text-[12px] text-neutral-500">Platform Publishes</div>
            </CardContent>
          </Card>
        </div>
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
                            className={`${getPlatformColor(platform)} text-[10px] px-2 py-0.5`}
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

      {/* Charts Section */}
      <div className="mb-8 grid gap-5 md:grid-cols-2">
        {/* Article Status Pie Chart */}
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

        {/* Platform Distribution Bar Chart */}
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

      {/* Additional Stats */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card className="border border-neutral-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">
              Article Status Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-neutral-600">Published</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${stats.articles.total > 0 ? (stats.articles.published / stats.articles.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-neutral-900 w-12 text-right">
                    {stats.articles.published}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-neutral-600">Draft</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${stats.articles.total > 0 ? (stats.articles.draft / stats.articles.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-neutral-900 w-12 text-right">
                    {stats.articles.draft}
                  </span>
                </div>
              </div>
              {stats.articles.scheduled > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-neutral-600">Scheduled</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${stats.articles.total > 0 ? (stats.articles.scheduled / stats.articles.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-medium text-neutral-900 w-12 text-right">
                      {stats.articles.scheduled}
                    </span>
                  </div>
                </div>
              )}
              {stats.articles.archived > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-neutral-600">Archived</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-400 rounded-full"
                        style={{ width: `${stats.articles.total > 0 ? (stats.articles.archived / stats.articles.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-medium text-neutral-900 w-12 text-right">
                      {stats.articles.archived}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">
              Key Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-neutral-600">Avg Words per Article</span>
                  <span className="text-[16px] font-bold text-neutral-900">
                    {stats.articles.avgWordsPerArticle.toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-neutral-600">Publishing Rate</span>
                  <span className="text-[16px] font-bold text-neutral-900">
                    {stats.platforms.publishingRate}x
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">
                  Avg platforms per article
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-neutral-600">Total Word Count</span>
                  <span className="text-[16px] font-bold text-neutral-900">
                    {stats.articles.totalWords.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
