'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Video, Code, FileText } from "lucide-react"

export default function GuidesPage() {
  const guides = [
    {
      title: "Getting Started with AI Blog Generation",
      description: "Learn how to create your first AI-powered blog post in minutes",
      icon: BookOpen,
      category: "Beginner",
    },
    {
      title: "Multi-Platform Publishing Guide",
      description: "Publish to multiple platforms simultaneously with one click",
      icon: Code,
      category: "Intermediate",
    },
    {
      title: "Optimizing Content for SEO",
      description: "Learn how to use Publish Type's SEO tools to rank higher",
      icon: FileText,
      category: "Advanced",
    },
    {
      title: "Collaboration Features",
      description: "Work with team members on articles in real-time",
      icon: Video,
      category: "Intermediate",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Guides</h1>
          <p className="text-lg text-neutral-600">
            Learn how to make the most of Publish Type
          </p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <div
                key={guide.title}
                className="p-6 border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                    {guide.category}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
                <p className="text-neutral-600 text-sm mb-4">{guide.description}</p>
                <Button variant="outline" className="w-full">
                  Read Guide
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
