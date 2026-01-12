"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { toast } from "sonner"

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
      if (filterStatus !== 'all') {
        params.append('status', filterStatus.toUpperCase())
      }

      const response = await fetch(`/api/articles?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setArticles(data.data.articles)
        setTotalArticles(data.data.pagination.total)

        // Calculate total words
        const words = data.data.articles.reduce(
          (sum: number, article: Article) => sum + article.wordCount,
          0
        )
        setTotalWords(words)
      } else {
        toast.error(data.error || "Failed to fetch articles")
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      toast.error("Failed to load articles")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (articleId: string, articleTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${articleTitle}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Article deleted successfully")
        setArticles((prev) => prev.filter((article) => article.id !== articleId))
        setTotalArticles((prev) => prev - 1)
      } else {
        toast.error(data.error || "Failed to delete article")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast.error("Failed to delete article")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "DRAFT":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      case "SCHEDULED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Eye className="h-3 w-3" />
      case "DRAFT":
        return <FileText className="h-3 w-3" />
      case "SCHEDULED":
        return <Calendar className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'WORDPRESS':
        return 'WordPress'
      case 'GHOST':
        return 'Ghost'
      case 'DEVTO':
        return 'Dev.to'
      case 'HASHNODE':
        return 'Hashnode'
      case 'WIX':
        return 'Wix'
      case 'MEDIUM':
        return 'Medium'
      case 'LINKEDIN':
        return 'LinkedIn'
      default:
        return platform
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Articles
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and organize your blog posts
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/articles/new")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-6 h-auto rounded-lg shadow-lg hover:shadow-xl font-medium transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Article
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-14 bg-white border-gray-200 rounded-xl shadow-sm text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 h-auto rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-600 hover:text-emerald-700 px-6 py-6 h-auto rounded-xl font-medium shadow-sm transition-all"}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("draft")}
              className={filterStatus === "draft"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 h-auto rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-600 hover:text-emerald-700 px-6 py-6 h-auto rounded-xl font-medium shadow-sm transition-all"}
            >
              <FileText className="h-4 w-4 mr-2" />
              Drafts
            </Button>
            <Button
              variant={filterStatus === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("published")}
              className={filterStatus === "published"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 h-auto rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-600 hover:text-emerald-700 px-6 py-6 h-auto rounded-xl font-medium shadow-sm transition-all"}
            >
              <Eye className="h-4 w-4 mr-2" />
              Published
            </Button>
            <Button
              variant={filterStatus === "scheduled" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("scheduled")}
              className={filterStatus === "scheduled"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 h-auto rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-600 hover:text-emerald-700 px-6 py-6 h-auto rounded-xl font-medium shadow-sm transition-all"}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Scheduled
            </Button>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Card className="bg-white border-gray-200 shadow-lg rounded-2xl p-20 text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-semibold mb-4 text-gray-900">No articles found</h3>
            <p className="text-gray-600 mb-10 text-lg max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start creating your first article"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/dashboard/articles/new")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl font-medium transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create First Article
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="bg-white border-gray-200 overflow-hidden hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 rounded-2xl group">
                <div className="p-8">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <Badge className={getStatusColor(article.status)} variant="outline">
                      {getStatusIcon(article.status)}
                      <span className="ml-2 capitalize font-medium text-sm">{article.status.toLowerCase()}</span>
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-xl mb-4 line-clamp-2 text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{article.wordCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{article.readingTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{article.views}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-500 mb-4 font-medium">
                    {article.status === "PUBLISHED" && article.publishedAt
                      ? `Published ${formatDate(article.publishedAt)}`
                      : article.status === "SCHEDULED" && article.scheduleAt
                      ? `Scheduled for ${new Date(article.scheduleAt).toLocaleString()}`
                      : `Updated ${formatDate(article.updatedAt)}`}
                  </p>

                  {/* Published Platforms */}
                  {article.publishRecords && article.publishRecords.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 font-medium mb-3">Published on:</p>
                      <div className="flex flex-wrap gap-2">
                        {article.publishRecords.map((record, index) => (
                          <a
                            key={index}
                            href={record.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                          >
                            {getPlatformName(record.platform)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white border-gray-200 hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-700 px-5 py-6 h-auto rounded-xl font-medium transition-all shadow-sm"
                      onClick={() => router.push(`/dashboard/articles/${article.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-gray-200 hover:bg-red-50 hover:border-red-600 hover:text-red-700 px-5 py-6 h-auto rounded-xl font-medium transition-all shadow-sm"
                      onClick={() => handleDelete(article.id, article.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {filteredArticles.length > 0 && (
          <div className="mt-12 p-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center gap-16 text-base">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <span className="font-bold text-3xl text-gray-900">{totalArticles}</span>
                  <span className="text-gray-600 ml-2.5 text-lg">
                    {totalArticles === 1 ? "Article" : "Articles"}
                  </span>
                </div>
              </div>
              <div className="h-16 w-px bg-gray-200" />
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm">
                  <Clock className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <span className="font-bold text-3xl text-gray-900">{totalWords.toLocaleString()}</span>
                  <span className="text-gray-600 ml-2.5 text-lg">Words</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
