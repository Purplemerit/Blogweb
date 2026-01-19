"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/AuthContext"
import { AlertCircle, Crown, Zap, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { PLAN_PRICING_DISPLAY } from "@/lib/hooks/useRazorpay"

interface SubscriptionUsage {
  articlesThisMonth: number
  maxArticlesPerMonth: number
  drafts: number
  maxDrafts: number
  platformConnections: number
  maxPlatformConnections: number
}

export function SubscriptionBanner() {
  const { user } = useAuth()
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUsage()
    }
  }, [user])

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/user/subscription-usage', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUsage(data.data)

        // Show upgrade if over limit
        if (data.data.articlesThisMonth >= data.data.maxArticlesPerMonth) {
          setShowUpgrade(true)
        }
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    }
  }

  if (!user) return null

  const planColors = {
    FREE: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: AlertCircle },
    STARTER: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: Zap },
    CREATOR: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: Sparkles },
    PROFESSIONAL: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', icon: Crown },
  }

  const plan = user.subscriptionPlan as keyof typeof planColors
  const color = planColors[plan] || planColors.FREE
  const Icon = color.icon

  return (
    <Card className={`border-2 ${color.border} ${color.bg}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`h-10 w-10 flex-shrink-0 rounded-full ${color.bg} flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${color.text}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={`${color.bg} ${color.text} ${color.border} font-semibold text-xs`}>
                  {plan} PLAN
                </Badge>
                {plan === 'FREE' && showUpgrade && (
                  <Badge variant="destructive" className="text-xs">
                    OVER LIMIT
                  </Badge>
                )}
              </div>
              {usage && (
                <div className="text-xs text-gray-600 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className={usage.articlesThisMonth >= usage.maxArticlesPerMonth ? 'text-red-600 font-semibold' : ''}>
                    📝 {usage.articlesThisMonth}/{usage.maxArticlesPerMonth === -1 ? '∞' : usage.maxArticlesPerMonth} articles
                  </span>
                  <span>
                    💾 {usage.drafts}/{usage.maxDrafts === -1 ? '∞' : usage.maxDrafts} drafts
                  </span>
                  <span>
                    🔌 {usage.platformConnections}/{usage.maxPlatformConnections === -1 ? '∞' : usage.maxPlatformConnections} platforms
                  </span>
                </div>
              )}
            </div>
          </div>

          {plan === 'FREE' && (
            <Link href="/pricing" className="flex-shrink-0">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full md:w-auto text-xs md:text-sm">
                <Sparkles className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Upgrade to STARTER - </span>₹{PLAN_PRICING_DISPLAY.STARTER.monthly.inr.toLocaleString('en-IN')}/mo
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          )}

          {plan === 'STARTER' && (
            <Link href="/pricing" className="flex-shrink-0">
              <Button size="sm" variant="outline" className="w-full md:w-auto text-xs md:text-sm">
                <Crown className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Upgrade to CREATOR - </span>₹{PLAN_PRICING_DISPLAY.CREATOR.monthly.inr.toLocaleString('en-IN')}/mo
              </Button>
            </Link>
          )}
        </div>

        {plan === 'FREE' && usage && usage.articlesThisMonth >= usage.maxArticlesPerMonth && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>⚠️ Article limit reached!</strong> You've created {usage.articlesThisMonth} articles this month.
              Upgrade to STARTER for 20 articles/month or wait until next month.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
