import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Users, Zap, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">About Publish Type</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Publish Type was created to empower content creators, bloggers, and businesses to produce high-quality content efficiently. We combine the power of AI with intuitive tools to make content creation accessible to everyone, regardless of their writing experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-600" />
              What We Do
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Publish Type is an all-in-one content creation and publishing platform that helps you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Generate high-quality content using advanced AI models</li>
              <li>Edit and optimize your content with built-in SEO tools</li>
              <li>Publish to multiple platforms simultaneously</li>
              <li>Track performance with comprehensive analytics</li>
              <li>Collaborate with team members in real-time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Who We Serve
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We serve a diverse community of content creators including individual bloggers, marketing teams, agencies, startups, and enterprises. Whether you're writing your first blog post or managing content for multiple clients, Publish Type scales with your needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-600" />
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-gray-700 text-sm">
                  We continuously integrate the latest AI technologies to give you the best content creation experience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Simplicity</h3>
                <p className="text-gray-700 text-sm">
                  Complex features made simple. Our intuitive interface makes professional content creation accessible to all.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quality</h3>
                <p className="text-gray-700 text-sm">
                  We're committed to helping you create content that engages readers and drives results.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Privacy</h3>
                <p className="text-gray-700 text-sm">
                  Your content is yours. We take data security seriously and never share your information.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-1">AI-Powered Writing</h3>
                <p className="text-sm text-blue-800">
                  Multiple AI models including GPT-4, Claude, and Gemini
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-1">Multi-Platform Publishing</h3>
                <p className="text-sm text-purple-800">
                  Publish to WordPress, Medium, Dev.to, and more
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-1">SEO Optimization</h3>
                <p className="text-sm text-green-800">
                  Built-in SEO analysis and recommendations
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-1">Team Collaboration</h3>
                <p className="text-sm text-orange-800">
                  Work together with real-time editing and comments
                </p>
              </div>
            </div>
          </section>

          <section className="text-center pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">Ready to transform your content creation?</h3>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
