'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ChangelogPage() {
  const entries = [
    {
      version: "2.0.0",
      date: "January 19, 2026",
      changes: [
        "Added multi-platform publishing support",
        "Improved AI model selection",
        "Enhanced editor with real-time collaboration",
        "New analytics dashboard",
      ],
    },
    {
      version: "1.5.0",
      date: "January 1, 2026",
      changes: [
        "Added newsletter integration",
        "Improved SEO analysis tools",
        "Better export options",
        "Performance improvements",
      ],
    },
    {
      version: "1.0.0",
      date: "December 15, 2025",
      changes: [
        "Initial release",
        "AI-powered blog generation",
        "Basic publishing features",
        "User authentication system",
      ],
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
          <h1 className="text-4xl font-bold mb-4">Changelog</h1>
          <p className="text-lg text-neutral-600">
            Latest updates and improvements to Publish Type
          </p>
        </div>
      </div>

      {/* Changelog Entries */}
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <div className="space-y-8">
          {entries.map((entry) => (
            <div key={entry.version} className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-baseline gap-3 mb-3">
                <h3 className="text-2xl font-bold">{entry.version}</h3>
                <p className="text-neutral-600 text-sm">{entry.date}</p>
              </div>
              <ul className="space-y-2">
                {entry.changes.map((change, idx) => (
                  <li key={idx} className="text-neutral-700">
                    • {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
