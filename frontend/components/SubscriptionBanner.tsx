"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { AlertCircle, Crown, Zap, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
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

        if (data.data.articlesThisMonth >= data.data.maxArticlesPerMonth) {
          setShowUpgrade(true)
        }
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    }
  }

  if (!user) return null

  const plan = user.subscriptionPlan || 'FREE'

  // Refined theme colors for the banner
  const getBannerStyles = () => {
    if (plan === 'FREE') return { bg: '#fff', border: '1px solid #eee', accent: '#FF7A33' }
    return { bg: '#fff', border: '1px solid #eee', accent: '#FF7A33' }
  }

  const styles = getBannerStyles()

  return (
    <div style={{
      backgroundColor: styles.bg,
      border: styles.border,
      borderRadius: '32px',
      padding: '24px 32px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: '#fcfcfc',
          border: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: styles.accent
        }}>
          {plan === 'FREE' ? <AlertCircle size={28} /> : <ShieldCheck size={28} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 900,
              color: styles.accent,
              backgroundColor: '#FFF5F0',
              padding: '4px 12px',
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {plan} PLAN
            </span>
            {plan === 'FREE' && showUpgrade && (
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#ff4b2b', backgroundColor: '#fff5f5', padding: '4px 12px', borderRadius: '50px' }}>
                LIMIT REACHED
              </span>
            )}
          </div>

          {usage && (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: usage.articlesThisMonth >= usage.maxArticlesPerMonth ? '#ff4b2b' : '#666' }}>
                <span style={{ opacity: 0.6 }}>📝</span> {usage.articlesThisMonth}/{usage.maxArticlesPerMonth === -1 ? '∞' : usage.maxArticlesPerMonth} articles
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#666' }}>
                <span style={{ opacity: 0.6 }}>💾</span> {usage.drafts}/{usage.maxDrafts === -1 ? '∞' : usage.maxDrafts} drafts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#666' }}>
                <span style={{ opacity: 0.6 }}>🔌</span> {usage.platformConnections}/{usage.maxPlatformConnections === -1 ? '∞' : usage.maxPlatformConnections} platforms
              </div>
            </div>
          )}
        </div>
      </div>

      {(plan === 'FREE' || plan === 'STARTER') && (
        <Link href="/pricing" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: styles.accent,
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '50px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 25px rgba(255, 122, 51, 0.2)',
            transition: 'transform 0.2s'
          }}>
            <Sparkles size={16} />
            UPGRADE TO {plan === 'FREE' ? 'STARTER' : 'CREATOR'}
            <span style={{ opacity: 0.8, fontSize: '11px' }}>- ₹{PLAN_PRICING_DISPLAY[plan === 'FREE' ? 'STARTER' : 'CREATOR'].monthly.inr.toLocaleString('en-IN')}/mo</span>
            <ChevronRight size={16} />
          </button>
        </Link>
      )}
    </div>
  )
}

function ChevronRight({ size }: { size: number }) {
  return <ArrowRight size={size} />
}
