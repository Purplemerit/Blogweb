'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Dev.to",
      description: "Publish your articles directly to Dev.to",
      icon: "📝",
    },
    {
      name: "Hashnode",
      description: "Cross-post to Hashnode's blogging platform",
      icon: "📚",
    },
    {
      name: "Ghost",
      description: "Integrate with Ghost for professional blogging",
      icon: "👻",
    },
    {
      name: "WordPress.com",
      description: "Publish to WordPress.com sites",
      icon: "📕",
    },
    {
      name: "Wix",
      description: "Integrate with Wix blogs",
      icon: "🔗",
    },
    {
      name: "Medium",
      description: "Share your content on Medium",
      icon: "🎯",
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
          <h1 className="text-4xl font-bold mb-4">Integrations</h1>
          <p className="text-lg text-neutral-600">
            Connect with your favorite platforms and tools
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="p-6 border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">{integration.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{integration.name}</h3>
              <p className="text-neutral-600 text-sm mb-4">{integration.description}</p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
