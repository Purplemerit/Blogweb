import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Publish Type, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Publish Type provides an AI-powered content creation and publishing platform that allows users to write, edit, and publish articles across multiple platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use certain features of our service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Content Ownership</h2>
            <p className="text-gray-700 leading-relaxed">
              You retain all rights to the content you create using Publish Type. We do not claim ownership of your content. However, you grant us a license to host, store, and display your content as necessary to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use Publish Type to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Distribute spam or malicious content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Create content that is illegal, harmful, or offensive</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Subscription and Payments</h2>
            <p className="text-gray-700 leading-relaxed">
              Some features require a paid subscription. Subscription fees are billed in advance and are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these terms. You may cancel your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              Publish Type is provided "as is" without warranties of any kind. We do not guarantee that our service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Publish Type shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-700 mt-2">
              Email: <a href="mailto:legal@publishtype.com" className="text-blue-600 hover:underline">legal@publishtype.com</a>
            </p>
          </section>

          <div className="pt-6 border-t mt-8">
            <p className="text-sm text-gray-500">
              Last Updated: January 19, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
