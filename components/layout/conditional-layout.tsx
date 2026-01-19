"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if we're on a dashboard route
  const isDashboard = pathname?.startsWith('/dashboard')

  // If it's a dashboard route, don't render Header and Footer
  if (isDashboard) {
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
