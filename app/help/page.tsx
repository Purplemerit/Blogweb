import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, MessageSquare, FileText, Zap, HelpCircle, Mail } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-gray-600 text-lg">Find answers to common questions and get support</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Comprehensive guides and tutorials</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs">
                <Button variant="outline" className="w-full">
                  View Docs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get help from our team</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contact">
                <Button variant="outline" className="w-full">
                  Contact Us
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Get started in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/signup">
                <Button variant="outline" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">How do I create my first article?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    After logging in, click the "New Article" button in your dashboard. You can start writing manually or use our AI-powered editor to generate content based on your topic and requirements.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Can I publish to multiple platforms at once?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes! Publish Type supports multi-platform publishing to WordPress, Medium, Dev.to, Hashnode, Ghost, and LinkedIn. Connect your accounts in the Platforms section and publish with one click.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">What's included in the free plan?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The free plan includes 5 articles per month, AI writing assistance, basic SEO analysis, 3 platform connections, and access to stock images from Pexels and Unsplash.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">How does the AI content generation work?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our AI uses advanced language models (Google Gemini, Claude, GPT-4) to generate high-quality content based on your inputs. You provide the topic, tone, and key points, and the AI creates a complete article that you can edit and customize.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Can I schedule posts for later?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes! All plans support scheduled publishing. Simply select a future date and time when creating or editing your article, and it will automatically publish at that time.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">How do I upgrade my plan?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Visit the <Link href="/pricing" className="text-blue-600 hover:underline">Pricing page</Link> to view available plans. Click "Upgrade" on your desired plan and complete the payment process. Your upgrade will be immediate.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Is my content secure?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Yes, we take security seriously. All data is encrypted in transit and at rest. Your content is private and only you have access to it. We never share or sell your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center bg-white rounded-lg shadow-sm p-8">
          <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Our support team is here to help</p>
          <Link href="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
