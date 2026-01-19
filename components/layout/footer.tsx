import Link from "next/link"
import { PenSquare, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <PenSquare className="h-6 w-6" />
              <span className="text-lg font-bold">Publish Type</span>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              AI-powered blog generation and multi-platform publishing platform.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-900">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-900">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-900">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-neutral-600 hover:text-neutral-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-600 hover:text-neutral-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-neutral-600 hover:text-neutral-900">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-neutral-600 hover:text-neutral-900">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/docs" className="text-neutral-600 hover:text-neutral-900">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-600 hover:text-neutral-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-neutral-600 hover:text-neutral-900">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-neutral-600 hover:text-neutral-900">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-neutral-600 hover:text-neutral-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-600 hover:text-neutral-900">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-600 hover:text-neutral-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-center text-sm text-neutral-600">
            © {new Date().getFullYear()} Publish Type. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
