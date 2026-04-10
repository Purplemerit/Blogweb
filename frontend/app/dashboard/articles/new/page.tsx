"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CalendarClock, ImagePlus, Save, Send, Settings2 } from "lucide-react"
import { toast } from "sonner"

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["PublishType", "WordPress"])
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    seoTitle: "",
    seoDescription: "",
  })

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Article created successfully!")
        router.push(`/dashboard/articles/${data.data.article.id}`)
      } else {
        toast.error(data.error || "Failed to create article")
        setLoading(false)
      }
    } catch (error) {
      console.error("Error creating article:", error)
      toast.error("An error occurred while creating the article")
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "24px", background: "#f7f8fa", minHeight: "100%" }}>
      <style jsx global>{`
        @media (max-width: 1024px) {
          .editor-grid {
            grid-template-columns: 1fr !important;
          }
          .editor-main,
          .editor-side {
            padding: 24px !important;
            border-radius: 24px !important;
          }
        }

        @media (max-width: 640px) {
          .editor-page {
            padding: 12px !important;
          }
          .editor-main,
          .editor-side {
            padding: 18px !important;
          }
          .editor-title {
            font-size: 30px !important;
          }
        }
      `}</style>

      <div className="editor-page" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              border: "1px solid #e6e8ee",
              background: "#fff",
              borderRadius: "12px",
              padding: "10px 14px",
              fontWeight: 700,
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              style={{
                border: "1px solid #e6e8ee",
                background: "#fff",
                borderRadius: "12px",
                padding: "10px 14px",
                fontWeight: 700,
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer"
              }}
            >
              <CalendarClock size={16} /> Schedule
            </button>
            <button
              type="submit"
              form="new-article-form"
              disabled={loading}
              style={{
                border: "none",
                background: "#ff7a33",
                color: "#fff",
                borderRadius: "12px",
                padding: "10px 14px",
                fontWeight: 800,
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer"
              }}
            >
              <Save size={16} /> {loading ? "Creating..." : "Save Draft"}
            </button>
          </div>
        </div>

        <div className="editor-grid" style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: "18px", alignItems: "start" }}>
          <form
            id="new-article-form"
            onSubmit={handleSubmit}
            className="editor-main"
            style={{
              background: "#fff",
              border: "1px solid #e6e8ee",
              borderRadius: "30px",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "22px"
            }}
          >
            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#8f96a3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Article Title
              </p>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your article title"
                className="editor-title"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "40px",
                  lineHeight: 1.12,
                  fontWeight: 800,
                  color: "#161922",
                  padding: 0
                }}
              />
            </div>

            <div style={{ border: "1px dashed #d7dbe4", borderRadius: "18px", padding: "18px" }}>
              <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#8f96a3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Featured Image
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="Paste image URL"
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    border: "1px solid #e6e8ee",
                    background: "#fbfcfe",
                    borderRadius: "12px",
                    padding: "10px 12px",
                    fontSize: "14px",
                    color: "#1d2433"
                  }}
                />
                <button type="button" style={{ border: "1px solid #e6e8ee", background: "#fff", borderRadius: "12px", padding: "10px 12px", fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <ImagePlus size={16} /> Upload
                </button>
              </div>
            </div>

            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#8f96a3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Excerpt
              </p>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                placeholder="Short summary shown in previews"
                style={{ width: "100%", border: "1px solid #e6e8ee", background: "#fbfcfe", borderRadius: "14px", padding: "12px 14px", fontSize: "14px", color: "#1d2433", resize: "vertical" }}
              />
            </div>

            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#8f96a3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Content
              </p>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={16}
                placeholder="Start writing your article..."
                style={{ width: "100%", border: "1px solid #e6e8ee", background: "#fff", borderRadius: "16px", padding: "14px 16px", fontSize: "15px", lineHeight: 1.7, color: "#1d2433", resize: "vertical" }}
              />
            </div>
          </form>

          <aside
            className="editor-side"
            style={{
              background: "#fff",
              border: "1px solid #e6e8ee",
              borderRadius: "30px",
              padding: "26px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            <div style={{ borderBottom: "1px solid #f0f2f7", paddingBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
                <Send size={16} color="#ff7a33" /> Publication
              </h3>
              <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#6b7280" }}>Configure channels and SEO details before publishing.</p>
            </div>

            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#8f96a3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                SEO Title
              </p>
              <input
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="SEO optimized title"
                style={{ width: "100%", border: "1px solid #e6e8ee", background: "#fbfcfe", borderRadius: "12px", padding: "10px 12px", fontSize: "14px" }}
              />
            </div>

            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#8f96a3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                SEO Description
              </p>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={4}
                placeholder="Meta description"
                style={{ width: "100%", border: "1px solid #e6e8ee", background: "#fbfcfe", borderRadius: "12px", padding: "10px 12px", fontSize: "14px", resize: "vertical" }}
              />
            </div>

            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#8f96a3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Distribution Channels
              </p>
              <div style={{ display: "grid", gap: "8px" }}>
                {["PublishType", "WordPress", "Ghost", "Hashnode", "Dev.to"].map((channel) => {
                  const isSelected = selectedChannels.includes(channel)
                  return (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => toggleChannel(channel)}
                      style={{
                        width: "100%",
                        border: isSelected ? "1px solid #ffb087" : "1px solid #e6e8ee",
                        background: isSelected ? "#fff3ea" : "#fff",
                        color: "#202736",
                        borderRadius: "12px",
                        padding: "10px 12px",
                        fontWeight: 700,
                        fontSize: "13px",
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      {channel}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  border: "1px solid #e6e8ee",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  fontWeight: 700,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer"
                }}
              >
                <Settings2 size={16} /> Settings
              </button>
              <button
                type="submit"
                form="new-article-form"
                disabled={loading}
                style={{
                  flex: 1,
                  border: "none",
                  background: "#121827",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  fontWeight: 800,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
