import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Zap, Globe, BarChart, Settings, Users, Sparkles } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-gray-600 text-lg">Learn how to make the most of Publish Type</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Set up your account and create your first article</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Creating an account</li>
                <li>• Dashboard overview</li>
                <li>• Writing your first article</li>
                <li>• Using AI assistance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>Leverage AI to create high-quality content</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Choosing AI models</li>
                <li>• Content frameworks</li>
                <li>• Custom prompts</li>
                <li>• Tone and style settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Multi-Platform Publishing</CardTitle>
              <CardDescription>Publish to multiple platforms simultaneously</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Connecting platforms</li>
                <li>• WordPress integration</li>
                <li>• Medium, Dev.to, Hashnode</li>
                <li>• LinkedIn publishing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Organize and manage your content effectively</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Drafts and versions</li>
                <li>• Folders and organization</li>
                <li>• Scheduling posts</li>
                <li>• Content calendar</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart className="h-8 w-8 text-pink-600 mb-2" />
              <CardTitle>Analytics & SEO</CardTitle>
              <CardDescription>Track performance and optimize for search</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• SEO analysis tools</li>
                <li>• Readability scores</li>
                <li>• Analytics dashboard</li>
                <li>• Performance tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-teal-600 mb-2" />
              <CardTitle>Collaboration</CardTitle>
              <CardDescription>Work together with your team</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Inviting collaborators</li>
                <li>• Role permissions</li>
                <li>• Comments and feedback</li>
                <li>• Version control</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Platform Integrations</h3>
              <ul className="space-y-2 text-gray-700">
                <li>→ How to connect WordPress</li>
                <li>→ Publishing to Medium</li>
                <li>→ Setting up Dev.to integration</li>
                <li>→ LinkedIn article publishing</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">AI Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>→ Choosing the right AI model</li>
                <li>→ Creating effective prompts</li>
                <li>→ Using content frameworks</li>
                <li>→ AI image generation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Content Optimization</h3>
              <ul className="space-y-2 text-gray-700">
                <li>→ SEO best practices</li>
                <li>→ Improving readability</li>
                <li>→ Keyword optimization</li>
                <li>→ Meta descriptions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Account & Billing</h3>
              <ul className="space-y-2 text-gray-700">
                <li>→ Managing your subscription</li>
                <li>→ Upgrading your plan</li>
                <li>→ Payment methods</li>
                <li>→ Canceling your subscription</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">
            Can't find what you're looking for?
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/help">
              <Button variant="outline">
                Visit Help Center
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
