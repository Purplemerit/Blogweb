"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/AuthContext"
import { PublishModal } from "@/components/PublishModal"
import RichTextEditor from "@/components/editor/RichTextEditor"
import ContentAnalysis from "@/components/ContentAnalysis"
import { AIModelSelector } from "@/components/AIModelSelector"
import {
  Save,
  ArrowLeft,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Send,
  List,
  Wand2,
  Image as ImageIcon,
  Target,
  Settings,
  FileText,
  X,
  Undo2,
  Redo2,
  Type,
  Bold,
  Italic,
  Underline,
  Quote,
  Link as LinkIcon,
  List as ListIcon,
  Video,
  Maximize2,
  MoreVertical,
  Sun,
  Moon,
  Eye,
  Trash2,
  Globe,
  Plus,
  ArrowUpRight,
  UploadCloud,
  Clock,
  CheckCircle2,
  Calendar,
  Lock,
  Tag,
  FolderOpen,
  ChevronDown,
} from "lucide-react"
import { toast } from "sonner"
import { marked } from "marked"

interface Article {
  id: string
  title: string
  content: string
  excerpt: string | null
  status: string
  toneOfVoice: string | null
  contentFramework: string | null
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  wordCount: number
  readingTime: number
  userId?: string
  collaborators?: Array<{
    id: string
    userId: string
    role: string
    status: string
  }>
}

// Helper function to detect if content is markdown
const isMarkdown = (content: string): boolean => {
  const markdownPatterns = [
    /^#{1,6}\s/m,           // Headers
    /\*\*.*\*\*/,           // Bold
    /\*.*\*/,               // Italic
    /^\s*[-*+]\s/m,         // Unordered lists
    /^\s*\d+\.\s/m,         // Ordered lists
    /\[.*\]\(.*\)/,         // Links
    /```[\s\S]*```/,        // Code blocks
    /^\>/m,                 // Blockquotes
  ]
  return markdownPatterns.some(pattern => pattern.test(content))
}

// Helper function to convert markdown to HTML
const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  try {
    const html = await marked.parse(markdown)
    return html
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    return markdown
  }
}

// Helper function to check if user can edit
const canEdit = (role: string | null): boolean => {
  return role === 'OWNER' || role === 'EDITOR'
}

// Helper function to check if user can view
const canView = (role: string | null): boolean => {
  return role === 'OWNER' || role === 'EDITOR' || role === 'COMMENTER' || role === 'VIEWER'
}

export default function ArticleEditorPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [showAISidebar, setShowAISidebar] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null) // OWNER, EDITOR, COMMENTER, VIEWER
  const [isOwner, setIsOwner] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [generateContentLoading, setGenerateContentLoading] = useState(false)
  const [generateOutlineLoading, setGenerateOutlineLoading] = useState(false)
  const [generateMetaLoading, setGenerateMetaLoading] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeAITab, setActiveAITab] = useState<'content' | 'images' | 'seo'>('content')

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [focusKeyword, setFocusKeyword] = useState("")

  // AI fields
  const [toneOfVoice, setToneOfVoice] = useState("professional")
  const [contentFramework, setContentFramework] = useState("standard")
  const [selectedAIModel, setSelectedAIModel] = useState("")

  // Image generation fields
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageGenerating, setImageGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [selectedImageModel, setSelectedImageModel] = useState("")

  // SEO fields - separate model selection
  const [selectedSEOModel, setSelectedSEOModel] = useState("")
  const [seoAnalyzing, setSeoAnalyzing] = useState(false)
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [seoScore, setSeoScore] = useState(85)
  const [focusKeywords, setFocusKeywords] = useState<string[]>(["Minimalist", "Wedding"])
  const [readingTime, setReadingTime] = useState(1)

  // Publication fields
  const [articleStatus, setArticleStatus] = useState("Draft")
  const [publishDate, setPublishDate] = useState("")
  const [urlSlug, setUrlSlug] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && articleId !== "new") {
      fetchArticle()
    } else if (articleId === "new") {
      setLoading(false)
    }
  }, [user, articleId])

  // Auto-save every 2 minutes if there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges && articleId !== "new") {
      const autoSaveInterval = setInterval(() => {
        handleSave()
      }, 120000) // 2 minutes

      return () => clearInterval(autoSaveInterval)
    }
  }, [hasUnsavedChanges, articleId])

  // Track unsaved changes
  useEffect(() => {
    if (article) {
      setHasUnsavedChanges(true)
    }
  }, [title, content, excerpt])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch(`/api/articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        const articleData = data.data.article
        setArticle(articleData)
        setTitle(articleData.title)
        setContent(articleData.content || "")
        setExcerpt(articleData.excerpt || "")
        setMetaTitle(articleData.metaTitle || "")
        setMetaDescription(articleData.metaDescription || "")
        setFocusKeyword(articleData.focusKeyword || "")
        setToneOfVoice(articleData.toneOfVoice || "professional")
        setContentFramework(articleData.contentFramework || "standard")
        setArticleStatus(articleData.status || "DRAFT")
        setPublishDate(articleData.scheduleAt ? new Date(articleData.scheduleAt).toISOString().split('T')[0] : "")
        setUrlSlug(articleData.slug || "")
        setFeaturedImage(articleData.featuredImage || null)
        setHasUnsavedChanges(false)

        // Check if user is owner or collaborator
        const isArticleOwner = articleData.userId === user?.id
        setIsOwner(isArticleOwner)

        if (isArticleOwner) {
          setUserRole('OWNER')
        } else if (articleData.collaborators && articleData.collaborators.length > 0) {
          const userCollaborator = articleData.collaborators.find(
            (c: any) => c.userId === user?.id && c.status === 'ACCEPTED'
          )
          if (userCollaborator) {
            setUserRole(userCollaborator.role)
          }
        }
      } else {
        toast.error(data.error || "Failed to fetch article")
        router.push("/dashboard/articles")
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      toast.error("Failed to load article")
      router.push("/dashboard/articles")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = useCallback(async (status?: string) => {
    // Check edit permission
    if (!canEdit(userRole)) {
      toast.error("You don't have permission to edit this article")
      return
    }

    if (!title.trim()) {
      toast.error("Please enter a title")
      return
    }

    try {
      setSaving(true)
      const token = localStorage.getItem("accessToken")

      const payload = {
        title,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        focusKeyword,
        toneOfVoice,
        contentFramework,
        slug: urlSlug,
        scheduleAt: publishDate || null,
        featuredImage,
        ...(status && { status }),
      }

      let response
      if (articleId === "new") {
        response = await fetch("/api/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(`/api/articles/${articleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast.success(
          status === "PUBLISHED"
            ? "Article published successfully"
            : "Article saved successfully"
        )

        if (articleId === "new") {
          router.push(`/dashboard/articles/${data.data.article.id}`)
        } else {
          setArticle(data.data.article)
        }
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
      } else {
        toast.error(data.error || "Failed to save article")
      }
    } catch (error) {
      console.error("Error saving article:", error)
      toast.error("Failed to save article")
    } finally {
      setSaving(false)
    }
  }, [title, content, excerpt, metaTitle, metaDescription, focusKeyword, toneOfVoice, contentFramework, articleId, router])

  const handlePublishClick = async () => {
    // First save the article if it's new or has changes
    if (!title.trim()) {
      toast.error("Please enter a title before publishing")
      return
    }

    // Auto-save before opening publish modal
    await handleSave()

    // Only open modal if we have a valid article ID
    if (articleId !== "new") {
      setShowPublishModal(true)
    }
  }

  const handleGenerateContent = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first")
      return
    }

    try {
      setGenerateContentLoading(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "blog-content",
          title,
          keywords: focusKeyword ? [focusKeyword] : [],
          toneOfVoice,
          contentFramework,
          wordCount: 1000,
          model: selectedAIModel || undefined, // Include selected AI model
        }),
      })

      const data = await response.json()

      if (data.success) {
        let processedContent = data.data.result

        // Convert markdown to HTML if needed
        if (isMarkdown(processedContent)) {
          processedContent = await convertMarkdownToHtml(processedContent)
        }

        setContent(processedContent)
        toast.success("Content generated successfully")
      } else {
        toast.error(data.error || "Failed to generate content")
      }
    } catch (error) {
      console.error("Error generating content:", error)
      toast.error("Failed to generate content")
    } finally {
      setGenerateContentLoading(false)
    }
  }

  const handleGenerateOutline = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first")
      return
    }

    try {
      setGenerateOutlineLoading(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "outline",
          topic: title,
          sections: 5,
          model: selectedAIModel || undefined, // Include selected AI model
        }),
      })

      const data = await response.json()

      if (data.success) {
        let outline = data.data.result

        // If result is an array, join it
        if (Array.isArray(outline)) {
          outline = outline.join("\n\n")
        }

        // Convert markdown to HTML if needed
        let processedOutline = outline
        if (isMarkdown(outline)) {
          processedOutline = await convertMarkdownToHtml(outline)
        }

        setContent(processedOutline)
        toast.success("Outline generated successfully")
      } else {
        toast.error(data.error || "Failed to generate outline")
      }
    } catch (error) {
      console.error("Error generating outline:", error)
      toast.error("Failed to generate outline")
    } finally {
      setGenerateOutlineLoading(false)
    }
  }

  const handleGenerateMetaDescription = async () => {
    // Strip HTML tags to get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    if (!plainText) {
      toast.error("Please write some content first")
      return
    }

    try {
      setGenerateMetaLoading(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "meta-description",
          content: plainText,
          maxLength: 160,
          model: selectedSEOModel || selectedAIModel || undefined, // Use SEO model first, then fallback
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMetaDescription(data.data.result)
        toast.success("Meta description generated")
      } else {
        toast.error(data.error || "Failed to generate meta description")
      }
    } catch (error) {
      console.error("Error generating meta description:", error)
      toast.error("Failed to generate meta description")
    } finally {
      setGenerateMetaLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error("Please enter an image description")
      return
    }

    try {
      setImageGenerating(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "image",
          prompt: imagePrompt,
          model: selectedImageModel || "gemini-1.5-flash", // Use selected model or default to free
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add generated image to the list - handle both data.result and direct data
        const imageData = data.data.result || data.data
        setGeneratedImages(prev => [imageData, ...prev])
        toast.success("Image generated successfully")
        setImagePrompt("")
      } else {
        toast.error(data.error || "Failed to generate image")
      }
    } catch (error) {
      console.error("Error generating image:", error)
      toast.error("Failed to generate image")
    } finally {
      setImageGenerating(false)
    }
  }

  const handleAnalyzeSEO = async () => {
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    if (!plainText) {
      toast.error("Please write some content first")
      return
    }

    try {
      setSeoAnalyzing(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "seo-analysis",
          content: plainText,
          title: title,
          model: selectedSEOModel || "gemini-1.5-flash",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSeoAnalysis(data.data.result)
        toast.success("SEO analysis complete")
      } else {
        toast.error(data.error || "Failed to analyze SEO")
      }
    } catch (error) {
      console.error("Error analyzing SEO:", error)
      toast.error("Failed to analyze SEO")
    } finally {
      setSeoAnalyzing(false)
    }
  }

  const getWordCount = () => {
    // Strip HTML tags and count words
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    return plainText.split(/\s+/).filter(Boolean).length
  }

  const handleAddKeyword = (keyword: string) => {
    if (keyword.trim() && !focusKeywords.includes(keyword.trim())) {
      setFocusKeywords([...focusKeywords, keyword.trim()])
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFocusKeywords(focusKeywords.filter(kw => kw !== keyword))
  }

  const handleDeleteArticle = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
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
        router.push("/dashboard/articles")
      } else {
        toast.error(data.error || "Failed to delete article")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast.error("Failed to delete article")
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("/design/BG%2023-01%202.png")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      fontFamily: 'Inter, sans-serif',
      color: '#1a1a1a'
    }}>
      <style jsx global>{`
        /* Tablet and below */
        @media (max-width: 1024px) {
          .main-content-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
            overflow-y: auto !important;
            min-height: 100vh !important;
          }
          .sidebar-aside {
            border-left: none !important;
            border-top: 1px solid rgba(0,0,0,0.05) !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow-y: visible !important;
            position: relative !important;
          }
          .editor-area-wrapper {
            padding: 24px 20px !important;
            height: auto !important;
            min-height: auto !important;
          }
          .header-nav {
            padding: 0 16px !important;
          }
          .header-center-logo {
            display: none !important;
          }
          .ai-panel-floating {
            right: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            z-index: 1000 !important;
          }
        }

        /* Mobile landscape and below */
        @media (max-width: 768px) {
          .header-nav {
            height: 60px !important;
            padding: 0 12px !important;
          }
          .main-content-grid {
            padding-top: 60px !important;
          }
          .editor-area-wrapper {
            padding: 16px 12px !important;
            min-height: 50vh !important;
          }
          .sidebar-aside {
            padding: 20px 16px !important;
            padding-bottom: 40px !important;
          }
          .featured-image-zone {
            max-height: 250px !important;
            margin-bottom: 24px !important;
          }
          .article-title-input {
            font-size: clamp(24px, 5vw, 42px) !important;
            padding: 16px 0 !important;
          }
          .config-section {
            gap: 12px !important;
            padding: 20px !important;
          }
          .ai-tab-button {
            font-size: 11px !important;
            padding: 8px 12px !important;
          }
        }

        /* Mobile portrait */
        @media (max-width: 480px) {
          .header-nav {
            height: 56px !important;
            padding: 0 8px !important;
          }
          .main-content-grid {
            padding-top: 56px !important;
          }
          .header-nav h1 {
            font-size: 12px !important;
            max-width: 120px !important;
          }
          .header-nav button {
            font-size: 11px !important;
            padding: 0 12px !important;
            height: 32px !important;
          }
          .editor-area-wrapper {
            padding: 12px 8px !important;
            min-height: 40vh !important;
          }
          .article-title-input {
            font-size: clamp(20px, 6vw, 32px) !important;
            padding: 12px 0 !important;
          }
          .featured-image-zone {
            max-height: 200px !important;
            margin-bottom: 20px !important;
            border-radius: 16px !important;
          }
          .sidebar-aside {
            padding: 16px 12px !important;
            padding-bottom: 60px !important;
            gap: 16px !important;
          }
          .config-section {
            padding: 16px !important;
            border-radius: 16px !important;
          }
          .config-input {
            font-size: 12px !important;
          }
          .ai-panel-floating {
            padding: 16px !important;
          }
          .ai-tab-button {
            font-size: 10px !important;
            padding: 6px 10px !important;
          }
        }

        /* Hide scrollbars but keep functionality */
        .editor-area-wrapper::-webkit-scrollbar,
        .sidebar-aside::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="header-nav" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push("/dashboard/articles")}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} color="#1a1a1a" />
          </button>
          <div className="hidden sm:block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', margin: 0, whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {title || "Untitled Article"}
              </h1>
              <Badge variant="outline" style={{ fontSize: '9px', height: '16px', padding: '0 4px', backgroundColor: '#fff', color: '#FF7A33', borderColor: '#FF7A33', fontWeight: 800 }}>
                {article?.status || "DRAFT"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="header-center-logo" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', backgroundColor: '#FF7A33', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={14} color="white" />
          </div>
          <span style={{ fontWeight: 900, fontSize: '18px', letterSpacing: '-0.5px', color: '#1a1a1a' }}>PUBLISHTYPE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '6px', color: '#666', fontSize: '11px', fontWeight: 600, marginRight: '8px' }}>
            {saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} color="#10b981" />}
            <span>{saving ? 'Saving...' : 'Saved'}</span>
          </div>

          <Button
            onClick={handlePublishClick}
            disabled={saving || articleId === "new"}
            style={{
              backgroundColor: '#FF7A33',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '0 16px',
              height: '36px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(255, 122, 51, 0.2)'
            }}
          >
            Publish
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAISidebar(!showAISidebar)}
            style={{
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              backgroundColor: showAISidebar ? '#f0f0f0' : 'transparent',
              color: showAISidebar ? '#FF7A33' : '#666'
            }}
          >
            <Sparkles size={18} />
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="main-content-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        paddingTop: '72px',
        maxWidth: '1600px',
        margin: '0 auto',
        height: '100vh',
        overflow: 'hidden'
      }}>

        {/* Left Side: Editor Area */}
        <div className="editor-area-wrapper" style={{
          padding: '32px 48px',
          overflowY: 'auto',
          backgroundColor: 'transparent',
          scrollbarWidth: 'none'
        }}>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Featured Image Zone */}
            <div
              className="featured-image-zone"
              onClick={() => { }}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '16/9',
                maxHeight: '400px',
                backgroundColor: '#fff',
                borderRadius: '24px',
                border: '2px dashed #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.2s ease',
                backgroundImage: featuredImage ? `url(${featuredImage})` : 'url("/design/laptop_mockup_bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!featuredImage && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    marginBottom: '12px'
                  }}>
                    <UploadCloud size={24} color="#FF7A33" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>Upload Featured Image:</h3>
                  <p className="hidden sm:block" style={{ color: '#666', fontSize: '13px', fontWeight: 600 }}>Drag & drop or click to browse</p>
                </div>
              )}
            </div>

            {/* Title Input */}
            <textarea
              className="article-title-input"
              placeholder="Post Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={1}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 900,
                color: '#1a1a1a',
                outline: 'none',
                marginBottom: '24px',
                letterSpacing: '-1.5px',
                lineHeight: '1.2',
                resize: 'none',
                overflow: 'hidden',
                padding: '20px 0'
              }}
              onInput={(e: any) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />

            {/* Content Editor */}
            <div style={{ minHeight: '400px', fontSize: '18px', lineHeight: '1.8', color: '#1a1a1a' }}>
              {!canEdit(userRole) && userRole && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs md:text-sm text-yellow-800 font-medium">
                    🔒 Read-only mode ({userRole}).
                  </p>
                </div>
              )}
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start typing your story..."
                editable={canEdit(userRole)}
                onSave={() => handleSave()}
              />
            </div>

            {/* Editor Footer Stats */}
            <div style={{
              marginTop: '60px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(0,0,0,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#999',
              fontSize: '12px',
              fontWeight: 600,
              paddingBottom: '40px'
            }}>
              <span>{getWordCount()} words</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration Sidebar */}
        <aside className="sidebar-aside" style={{
          backgroundColor: '#fff',
          borderLeft: '1px solid rgba(0,0,0,0.05)',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          scrollbarWidth: 'none'
        }}>
          {/* Section: Publication */}
          <ConfigSection title="Publication">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ConfigInput
                label="STATUS"
                type="select"
                options={['DRAFT', 'PUBLISHED', 'SCHEDULED']}
                value={articleStatus}
                onChange={setArticleStatus}
              />
              <ConfigInput
                label="PUBLISH DATE"
                type="date"
                placeholder="yyyy-mm-dd"
                value={publishDate}
                onChange={setPublishDate}
              />
              <ConfigInput
                label="URL SLUG"
                type="text"
                placeholder="minimalist-event-design"
                value={urlSlug}
                onChange={setUrlSlug}
              />
            </div>
          </ConfigSection>

          {/* Section: SEO */}
          <ConfigSection title="SEO" badge={`${seoScore}/100`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <LabelText text="META DESCRIPTION" />
                <textarea
                  placeholder="Enter meta description..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    resize: 'none',
                    backgroundColor: '#fcfcfc',
                    outline: 'none'
                  }}
                />
                <p style={{ textAlign: 'right', fontSize: '10px', color: '#999', marginTop: '4px', fontWeight: 600 }}>{metaDescription.length}/160</p>
              </div>
              <div>
                <LabelText text="FOCUS KEYWORD" />
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  backgroundColor: '#fcfcfc'
                }}>
                  {focusKeywords.map(kw => (
                    <div key={kw} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#eee', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                      {kw} <X size={10} style={{ cursor: 'pointer' }} onClick={() => handleRemoveKeyword(kw)} />
                    </div>
                  ))}
                  <input
                    placeholder="Add..."
                    style={{ border: 'none', background: 'none', fontSize: '12px', fontWeight: 600, minWidth: '60px', outline: 'none', flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddKeyword(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </ConfigSection>

          {/* Section: Channels */}
          <ConfigSection title="Channels">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ChannelItem icon="W" name="WordPress" active={true} />
              <ChannelItem icon="G" name="Ghost" active={false} />
              <ChannelItem icon="M" name="Medium" active={false} />
              <button style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: 800, color: '#1a1a1a', textDecoration: 'underline', marginTop: '4px', cursor: 'pointer' }}>
                Manage Integrations
              </button>
            </div>
          </ConfigSection>

          {/* Action Area */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px 0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <SidebarActionButton text="Save Draft" onClick={() => handleSave()} />
              <SidebarActionButton text="Schedule" onClick={() => { }} />
            </div>
            <button
              onClick={handleDeleteArticle}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF3B30',
                fontSize: '13px',
                fontWeight: 800,
                padding: '8px',
                cursor: 'pointer'
              }}
            >
              Delete Article
            </button>
          </div>
        </aside>
      </div>

      {/* Floating AI Panel (Toggled via header) */}
      {
        showAISidebar && (
          <div className="ai-panel-floating" style={{
            position: 'fixed',
            top: '84px',
            right: '400px',
            width: '380px',
            height: 'calc(100vh - 100px)',
            backgroundColor: '#fff',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            zIndex: 200,
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcfcfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={18} color="#FF7A33" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>AI Assistant</h3>
              </div>
              <button onClick={() => setShowAISidebar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <div className="flex gap-2 mb-6">
                <button
                  className="ai-tab-button"
                  onClick={() => setActiveAITab('content')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                    backgroundColor: activeAITab === 'content' ? '#1a1a1a' : '#f5f5f5',
                    color: activeAITab === 'content' ? '#fff' : '#666',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                  }}
                >Content</button>
                <button
                  className="ai-tab-button"
                  onClick={() => setActiveAITab('images')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                    backgroundColor: activeAITab === 'images' ? '#1a1a1a' : '#f5f5f5',
                    color: activeAITab === 'images' ? '#fff' : '#666',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                  }}
                >Images</button>
                <button
                  className="ai-tab-button"
                  onClick={() => setActiveAITab('seo')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                    backgroundColor: activeAITab === 'seo' ? '#1a1a1a' : '#f5f5f5',
                    color: activeAITab === 'seo' ? '#fff' : '#666',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                  }}
                >SEO</button>
              </div>

              {activeAITab === 'content' && (
                <div className="space-y-6">
                  <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '16px', border: '1px solid #eee' }}>
                    <LabelText text="AI MODEL" />
                    <AIModelSelector value={selectedAIModel} onChange={setSelectedAIModel} />
                  </div>

                  <div className="space-y-3">
                    <button onClick={handleGenerateContent} disabled={generateContentLoading} style={{ width: '100%', padding: '14px', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      {generateContentLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      {generateContentLoading ? "Generating..." : "Generate Full Article"}
                    </button>

                    <button onClick={handleGenerateOutline} disabled={generateOutlineLoading} style={{ width: '100%', padding: '14px', backgroundColor: '#fff', color: '#1a1a1a', borderRadius: '12px', border: '1px solid #eee', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                      {generateOutlineLoading ? "Generating..." : "Create Outline"}
                    </button>
                  </div>
                </div>
              )}

              {activeAITab === 'images' && (
                <div className="space-y-4">
                  <LabelText text="IMAGE PROMPT" />
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    style={{ width: '100%', height: '120px', padding: '16px', borderRadius: '16px', border: '1px solid #eee', fontSize: '13px', resize: 'none', outline: 'none' }}
                  />
                  <button onClick={handleGenerateImage} disabled={imageGenerating} style={{ width: '100%', padding: '14px', backgroundColor: '#FF7A33', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                    {imageGenerating ? "Processing..." : "Generate Asset"}
                  </button>
                </div>
              )}

              {activeAITab === 'seo' && (
                <div className="space-y-6">
                  <button onClick={handleAnalyzeSEO} disabled={seoAnalyzing} style={{ width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 800 }}>
                    {seoAnalyzing ? "Auditing..." : "Run SEO Analysis"}
                  </button>
                  {seoAnalysis && (
                    <div style={{ padding: '16px', backgroundColor: '#f0f3ff', borderRadius: '16px', border: '1px solid #e0e7ff' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#4338ca', marginBottom: '10px' }}>Analysis Report</h4>
                      <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {typeof seoAnalysis === 'string' ? seoAnalysis : JSON.stringify(seoAnalysis, null, 2)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      }

      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        articleId={articleId}
        articleTitle={title}
      />
    </div>
  )
}

// Reusable Helper Components for the Premium UI
function ConfigSection({ title, children, badge }: any) {
  return (
    <div className="config-section" style={{
      backgroundColor: '#fff',
      borderRadius: '24px',
      border: '1px solid rgba(0,0,0,0.05)',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{title}</h3>
        {badge && <span style={{ fontSize: '12px', fontWeight: 800, color: '#FF7A33' }}>{badge}</span>}
      </div>
      {children}
    </div>
  )
}

function LabelText({ text }: { text: string }) {
  return <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#999', marginBottom: '8px', letterSpacing: '0.5px' }}>{text}</label>
}

function ConfigInput({ label, type, placeholder, options, value, onChange }: any) {
  return (
    <div>
      <LabelText text={label} />
      <div style={{ position: 'relative' }}>
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fcfcfc', fontSize: '13px', fontWeight: 600, appearance: 'none', cursor: 'pointer', outline: 'none' }}
          >
            {options.map((opt: string) => <option key={opt}>{opt}</option>)}
          </select>
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className="config-input"
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#fcfcfc', fontSize: '13px', fontWeight: 600, outline: 'none' }}
            />
            {type === 'date' && <Calendar size={14} color="#666" style={{ position: 'absolute', right: '16px', pointerEvents: 'none' }} />}
          </div>
        )}
        {type === 'select' && (
          <ChevronDown size={14} color="#666" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        )}
      </div>
    </div>
  )
}

function ChannelItem({ icon, name, active }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#FFF5F0',
          color: '#FF7A33',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 800
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#666' }}>{name}</span>
      </div>
      <Checkbox checked={active} />
    </div>
  )
}

function CheckboxItem({ label, checked }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Checkbox checked={checked} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#666' }}>{label}</span>
    </div>
  )
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: '18px',
      height: '18px',
      borderRadius: '4px',
      border: checked ? 'none' : '2px solid #ddd',
      backgroundColor: checked ? '#1a1a1a' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {checked && <div style={{ width: '8px', height: '4px', borderLeft: '2px solid #fff', borderBottom: '2px solid #fff', transform: 'rotate(-45deg)', marginTop: '-1px' }} />}
    </div>
  )
}

function ToggleItem({ label, active }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#666' }}>{label}</span>
      <div style={{
        width: '36px',
        height: '20px',
        borderRadius: '20px',
        backgroundColor: active ? '#FF7A33' : '#eee',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          position: 'absolute',
          top: '2px',
          left: active ? '18px' : '2px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }} />
      </div>
    </div>
  )
}

function EditorToolButton({ icon, onClick, className }: any) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#666', cursor: 'pointer', transition: 'all 0.2s ease' }}
      onMouseOver={(e: any) => e.currentTarget.style.backgroundColor = '#f8f8f8'}
      onMouseOut={(e: any) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {icon}
    </button>
  )
}

function Divider({ className }: { className?: string }) {
  return <div className={className} style={{ width: '1px', height: '20px', backgroundColor: '#eee', margin: '0 4px' }} />
}

function SidebarActionButton({ text, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #FF7A33',
        backgroundColor: '#fff',
        color: '#FF7A33',
        fontWeight: 800,
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap'
      }}
      onMouseOver={(e: any) => { e.currentTarget.style.backgroundColor = '#FF7A33'; e.currentTarget.style.color = '#fff' }}
      onMouseOut={(e: any) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#FF7A33' }}
    >
      {text}
    </button>
  )
}
