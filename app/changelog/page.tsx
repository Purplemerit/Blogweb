'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Zap, Shield, Check } from "lucide-react"

export default function ChangelogPage() {
  const entries = [
    {
      version: "2.0.0",
      date: "January 19, 2026",
      tag: "Latest",
      tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      type: "major",
      changes: [
        { text: "Added multi-platform publishing support", type: "new" },
        { text: "Improved AI model selection", type: "improvement" },
        { text: "Enhanced editor with real-time collaboration", type: "new" },
        { text: "New analytics dashboard", type: "new" },
      ],
    },
    {
      version: "1.5.0",
      date: "January 1, 2026",
      type: "minor",
      changes: [
        { text: "Added newsletter integration", type: "new" },
        { text: "Improved SEO analysis tools", type: "improvement" },
        { text: "Better export options", type: "improvement" },
        { text: "Performance improvements", type: "fix" },
      ],
    },
    {
      version: "1.0.0",
      date: "December 15, 2025",
      tag: "Initial Release",
      tagColor: "bg-blue-100 text-blue-700 border-blue-200",
      type: "major",
      changes: [
        { text: "Initial release", type: "new" },
        { text: "AI-powered blog generation", type: "new" },
        { text: "Basic publishing features", type: "new" },
        { text: "User authentication system", type: "new" },
      ],
    },
  ]

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "new":
        return <Sparkles className="h-4 w-4 text-emerald-600" />
      case "improvement":
        return <Zap className="h-4 w-4 text-blue-600" />
      case "fix":
        return <Shield className="h-4 w-4 text-orange-600" />
      default:
        return <Check className="h-4 w-4 text-neutral-600" />
    }
  }

  const getChangeBadge = (type: string) => {
    switch (type) {
      case "new":
        return <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">NEW</span>
      case "improvement":
        return <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">IMPROVED</span>
      case "fix":
        return <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">FIXED</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 hover:bg-neutral-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
              Changelog
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and bug fixes
            </p>
          </div>
        </div>
      </div>

      {/* Changelog Entries */}
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.version}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Entry Header */}
              <div className="bg-gradient-to-r from-neutral-50 to-white p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-neutral-900">v{entry.version}</span>
                      {entry.tag && (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${entry.tagColor}`}>
                          {entry.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{entry.date}</span>
                  </div>
                </div>
              </div>

              {/* Entry Content */}
              <div className="p-6">
                <ul className="space-y-3">
                  {entry.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className="mt-0.5 flex-shrink-0">
                        {getChangeIcon(change.type)}
                      </div>
                      <div className="flex-1 flex items-center justify-between gap-3">
                        <span className="text-neutral-700 group-hover:text-neutral-900 transition-colors">
                          {change.text}
                        </span>
                        {getChangeBadge(change.type)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe Section */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="text-emerald-100 mb-6">
            Subscribe to our newsletter to get notified about new features and updates
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-neutral-50">
              Contact Us for Updates
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

