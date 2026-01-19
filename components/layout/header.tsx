"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenSquare, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/context/AuthContext"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex items-center gap-2">
          <PenSquare className="h-7 w-7" />
          <Link href="/" className="text-xl font-bold">
            Publish Type
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          <Link href="/features" className="text-sm font-medium hover:text-neutral-600 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-neutral-600 transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-neutral-600 transition-colors">
            Blog
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:text-neutral-600 transition-colors">
            Docs
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/features"
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-neutral-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-neutral-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-neutral-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/docs"
              className="block rounded-lg px-3 py-2 text-base font-medium hover:bg-neutral-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <div className="pt-4 space-y-2">
              {user ? (
                <Link href="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
