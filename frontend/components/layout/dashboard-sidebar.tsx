"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/AuthContext"
import {
  LayoutDashboard,
  FileText,
  Send,
  BarChart3,
  LayoutGrid,
  Users2,
  Settings,
  HelpCircle,
  Download,
  UserPlus,
} from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const navGroups = [
    {
      label: "CONTENT",
      items: [
        { name: "Articles", href: "/dashboard/articles", icon: FileText },
        { name: "Collaborate", href: "/dashboard/collaborate", icon: UserPlus },
        { name: "Export", href: "/dashboard/export", icon: Download },
      ]
    },
    {
      label: "DATA",
      items: [
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Integrations", href: "/dashboard/integrations", icon: LayoutGrid },
      ]
    },
    {
      label: "SYSTEM",
      items: [
        { name: "Team", href: "/dashboard/team", icon: Users2 },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }
  ]

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      width: '260px',
      flexDirection: 'column',
      backgroundColor: '#f9f9f9',
      borderRight: '1px solid #eee',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        height: '80px',
        alignItems: 'center',
        padding: '0 24px',
        marginBottom: '20px'
      }}>
        <Link href="/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#FF7A33', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={18} color="white" />
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#1a1a1a',
            letterSpacing: '-0.02em'
          }}>PublishType</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 12px'
      }}>
        {/* Dashboard Link */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: pathname === '/dashboard' ? 800 : 600,
              borderRadius: '16px',
              transition: 'all 0.2s',
              textDecoration: 'none',
              color: pathname === '/dashboard' ? '#1a1a1a' : '#666',
              backgroundColor: pathname === '/dashboard' ? '#fff' : 'transparent',
              boxShadow: pathname === '/dashboard' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              border: pathname === '/dashboard' ? '1px solid #eee' : '1px solid transparent'
            }}
          >
            <LayoutDashboard size={18} strokeWidth={pathname === '/dashboard' ? 2.5 : 2} />
            <span>Dashboard</span>
          </Link>
        </div>

        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '32px' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: '#999',
              textTransform: 'uppercase',
              margin: '0 16px 12px'
            }}>
              {group.label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: isActive ? 800 : 600,
                      borderRadius: '16px',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      color: isActive ? '#1a1a1a' : '#666',
                      backgroundColor: isActive ? '#fff' : 'transparent',
                      boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                      border: isActive ? '1px solid #eee' : '1px solid transparent'
                    }}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div style={{
        padding: '24px 16px',
        borderTop: '1px solid #eee',
      }}>
        <Link
          href="/dashboard/help"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#666',
            borderRadius: '16px',
            transition: 'all 0.2s',
            textDecoration: 'none',
            marginBottom: '16px',
          }}
        >
          <HelpCircle size={18} strokeWidth={2.5} />
          <span>Help & Docs</span>
        </Link>

        <button
          onClick={() => router.push('/pricing')}
          style={{
            width: '100%',
            borderRadius: '50px',
            backgroundColor: '#FF7A33',
            padding: '16px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>☆</span> UPGRADE PLAN
        </button>
      </div>
    </div>
  )
}
