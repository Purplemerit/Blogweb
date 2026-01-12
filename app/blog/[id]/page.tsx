"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  User,
  Eye,
  MousePointerClick,
  Heart,
  Settings,
  MoreVertical
} from "lucide-react"
import { useParams } from "next/navigation"
import Link from "next/link"

const blogPostsData: { [key: string]: any } = {
  "1": {
    title: "The Art of Minimalist Event Design",
    author: "Isabella Martinez",
    date: "Nov 15, 2023",
    time: "10:30 AM",
    category: "Event Planning",
    tags: ["minimalism", "design", "events"],
    readTime: "8 min read",
    status: "Published",
    platforms: [
      { name: "WordPress", icon: "W", color: "blue", published: true },
      { name: "Medium", icon: "M", color: "black", published: true },
      { name: "LinkedIn", icon: "in", color: "blue", published: false }
    ],
    views: "3,248",
    clicks: "842",
    engagement: "+4.5%",
    content: `In today's fast-paced world, there's beauty in simplicity. Minimalist event design has become a powerful tool to create memorable experiences that resonate with modern sensibilities and sophisticated tastes. Today, we're exploring everything about minimalist event design—from how to achieve minimalist aesthetics to styling tips that you can apply to your next event.`
  }
}

export default function BlogArticlePage() {
  const params = useParams()
  const postId = params.id as string
  const post = blogPostsData[postId] || blogPostsData["1"]

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Top Navigation */}
      <div className="border-b border-neutral-300 bg-white">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-[18px] font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>EVENTIQUE</h1>
            <nav className="flex gap-6">
              <a href="/dashboard" className="text-[13px] text-neutral-600 hover:text-neutral-900">DASHBOARD</a>
              <a href="/dashboard/articles" className="text-[13px] text-neutral-600 hover:text-neutral-900">LIBRARY</a>
              <a href="#" className="text-[13px] text-neutral-600 hover:text-neutral-900">SCHEDULE</a>
              <a href="/dashboard/analytics" className="text-[13px] text-neutral-600 hover:text-neutral-900">ANALYTICS</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">IM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[12px] text-neutral-500 mb-6">
                  <a href="/dashboard" className="hover:text-neutral-900">Dashboard</a>
                  <span>/</span>
                  <a href="#" className="hover:text-neutral-900">Event</a>
                  <span>/</span>
                  <span className="text-neutral-900">Article</span>
                </div>

                {/* Article Header */}
                <h1 className="text-[48px] font-normal mb-6 italic text-neutral-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-8 text-[13px] text-neutral-600 pb-6 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-neutral max-w-none">
                  <p className="text-[15px] text-neutral-700 leading-relaxed mb-6">
                    {post.content}
                  </p>

                  <h2 className="text-[32px] font-normal mb-4 mt-8 italic text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Choosing the Right Palette
                  </h2>

                  <p className="text-[15px] text-neutral-700 leading-relaxed mb-6">
                    Color plays a crucial role in setting the mood and creating visual harmony in minimalist design. Soft neutrals—whites, beiges, creams, and grays—are often preferred for their understated elegance. These colors create a sophisticated backdrop that lets key design elements and focal points truly shine. A monochromatic color palette also can add a modern edge, while subtle earth tones bring warmth and a natural feel.
                  </p>

                  {/* Feature Image */}
                  <div className="my-8 bg-neutral-100 rounded-lg overflow-hidden">
                    <div className="aspect-[16/10] flex items-center justify-center">
                      <div className="text-center p-12">
                        <div className="w-full h-64 bg-neutral-200 rounded flex items-center justify-center">
                          <span className="text-neutral-400 text-sm">Floral Centerpiece Image</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[15px] text-neutral-700 leading-relaxed mb-6">
                    Lighting plays a central role as well. Soft, even lighting can enhance minimalist spaces and create intimacy and warmth. Task lighting, such as pendant lights or statement chandeliers, can also serve as sculptural focal points within the overall design.
                  </p>

                  <h2 className="text-[32px] font-normal mb-4 mt-8 italic text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Quality Over Quantity
                  </h2>

                  <p className="text-[15px] text-neutral-700 leading-relaxed mb-6">
                    In minimalist event design, every element should serve a purpose. Rather than overwhelming the space with decorations, select a few high-quality pieces that make a statement. This could be a striking floral arrangement, elegant tableware, or unique furniture pieces. The key is to let each element breathe and contribute to the overall aesthetic without competing for attention.
                  </p>

                  <div className="bg-neutral-50 border-l-4 border-neutral-900 p-6 my-8">
                    <p className="text-[14px] text-neutral-700 italic leading-relaxed">
                      "Less is more" isn't just a design principle—it's a philosophy that allows your event's true essence to shine through, creating memorable experiences that resonate long after the last guest has left.
                    </p>
                  </div>

                  <h2 className="text-[32px] font-normal mb-4 mt-8 italic text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Embracing Negative Space
                  </h2>

                  <p className="text-[15px] text-neutral-700 leading-relaxed mb-6">
                    One of the hallmarks of minimalist design is the strategic use of negative space. Empty spaces aren't wasted—they're essential for creating balance and allowing the eye to rest. This approach helps prevent visual clutter and ensures that each design element receives the attention it deserves.
                  </p>

                  <p className="text-[15px] text-neutral-700 leading-relaxed mb-6">
                    When planning your event layout, consider the flow of space and how guests will move through it. Adequate spacing between tables, clear pathways, and uncluttered surfaces all contribute to a sense of calm and sophistication.
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-neutral-200">
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-9 text-[12px]">
                      EDIT
                    </Button>
                    <Button variant="outline" className="h-9 text-[12px]">
                      DUPLICATE
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4 text-neutral-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publication Info */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-[13px] font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Publication</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-neutral-500 mb-1">Status</p>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[11px] font-medium border-0">
                      {post.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-500 mb-1">Date</p>
                    <p className="text-[13px] text-neutral-900">{post.date}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-500 mb-1">Time</p>
                    <p className="text-[13px] text-neutral-900">{post.time}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-500 mb-1">Category</p>
                    <p className="text-[13px] text-neutral-900">{post.category}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-500 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-[10px] font-normal">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-[13px] font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Platforms</h3>
                <div className="space-y-3">
                  {post.platforms.map((platform: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full ${platform.color === 'blue' ? 'bg-blue-600' : 'bg-neutral-900'} flex items-center justify-center text-white text-[10px] font-semibold`}>
                          {platform.icon}
                        </div>
                        <span className="text-[13px] text-neutral-900">{platform.name}</span>
                      </div>
                      {platform.published ? (
                        <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-[11px] text-neutral-400">Not published</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-[13px] font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Eye className="h-4 w-4" />
                      <span className="text-[13px]">Views</span>
                    </div>
                    <span className="text-[13px] font-medium text-neutral-900">{post.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <MousePointerClick className="h-4 w-4" />
                      <span className="text-[13px]">Clicks</span>
                    </div>
                    <span className="text-[13px] font-medium text-neutral-900">{post.clicks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Heart className="h-4 w-4" />
                      <span className="text-[13px]">Engagement</span>
                    </div>
                    <span className="text-[13px] font-medium text-emerald-600">{post.engagement}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-[13px] font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Settings</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start h-9 text-[12px]" size="sm">
                    <Settings className="h-3 w-3 mr-2" />
                    SEO SETTINGS
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-9 text-[12px]" size="sm">
                    SCHEDULE POST
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-9 text-[12px] text-red-600 hover:text-red-700" size="sm">
                    DELETE
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
