"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if we're on a dashboard or auth route
  const isDashboard = pathname?.startsWith('/dashboard')
  const isAuth = pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/verify-email')

  // If it's a dashboard or auth route, don't render Header and Footer
  if (isDashboard || isAuth) {
    return <>{children}</>
  }

  // For all other routes, render with Header and Footer
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
