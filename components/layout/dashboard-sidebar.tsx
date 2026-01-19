"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"
import { useAuth } from "@/lib/context/AuthContext"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Sparkles,
  Download,
  UserPlus,
  PenTool,
  Crown,
} from "lucide-react"

const generalNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
]

const articlesNavigation = [
  { name: "Articles", href: "/dashboard/articles", icon: FileText },
  { name: "Collaborate", href: "/dashboard/collaborate", icon: UserPlus },
  { name: "Integrations", href: "/dashboard/integrations", icon: BarChart3 },
]

const infoNavigation = [
  { name: "Analytics", href: "/dashboard/analytics", icon: Sparkles },
  { name: "Export", href: "/dashboard/export", icon: Download },
]

const systemNavigation = [
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const isPaidUser = user?.subscriptionPlan && user.subscriptionPlan !== 'FREE'

  const renderNavSection = (title: string, items: typeof generalNavigation) => (
    <div className="mb-6 px-6">
      <div className="mb-2">
        <p style={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.15em',
          color: theme.colors.text.muted,
          textTransform: 'uppercase'
        }}>
          {title}
        </p>
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                fontSize: '14px',
                fontWeight: 400,
                borderRadius: '6px',
                transition: 'all 200ms',
                textDecoration: 'none',
                position: 'relative',
                color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
                backgroundColor: isActive ? theme.colors.secondary : 'transparent',
              }}
              className={cn(
                isActive
                  ? ""
                  : "hover:bg-[rgba(235,228,213,0.5)]"
              )}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '0 2px 2px 0'
                }} />
              )}
              <Icon style={{ height: '18px', width: '18px', flexShrink: 0 }} strokeWidth={1.5} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      width: '256px',
      flexDirection: 'column',
      backgroundColor: theme.colors.background,
      borderRight: `1px solid ${theme.colors.border}`,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        height: '64px',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: `1px solid ${theme.colors.border}`,
      }}>
        <Link href="/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
        }}>
          <PenTool style={{ height: '20px', width: '20px', color: theme.colors.text.primary }} strokeWidth={2} />
          <span style={{
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: theme.colors.text.primary,
          }}>PublishType</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        paddingTop: '24px',
        overflowY: 'auto',
      }}>
        {renderNavSection("GENERAL", generalNavigation)}
        {renderNavSection("ARTICLES", articlesNavigation)}
        {renderNavSection("INFO", infoNavigation)}
        {renderNavSection("SYSTEM", systemNavigation)}
      </nav>

      {/* Bottom Section */}
      <div style={{
        padding: '16px',
        borderTop: `1px solid ${theme.colors.border}`,
      }}>
        <Link
          href="/help"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            fontSize: '14px',
            fontWeight: 400,
            color: theme.colors.text.secondary,
            borderRadius: '6px',
            transition: 'all 200ms',
            textDecoration: 'none',
            marginBottom: '12px',
          }}
          className="hover:bg-[rgba(235,228,213,0.5)]"
        >
          <HelpCircle style={{ height: '18px', width: '18px' }} strokeWidth={1.5} />
          <span>Help & Docs</span>
        </Link>
        {!isPaidUser ? (
          <button
            onClick={() => router.push('/pricing')}
            style={{
              width: '100%',
              borderRadius: '8px',
              backgroundColor: theme.colors.primary,
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 400,
              color: theme.colors.text.inverse,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            className="hover:opacity-90"
          >
            <Crown style={{ height: '16px', width: '16px' }} />
            Upgrade Pro
          </button>
        ) : (
          <div style={{
            width: '100%',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1f3529 0%, #2d4a3a 100%)',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            <Crown style={{ height: '14px', width: '14px', color: '#fbbf24' }} />
            {user?.subscriptionPlan} Plan
          </div>
        )}
      </div>
    </div>
  )
}
