"use client"

import { Search, Settings, Maximize2, TrendingUp, LogOut, Menu, X, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { theme } from "@/lib/theme"
import Link from "next/link"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [stats, setStats] = useState({ totalViews: 0, totalPosts: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const mobileNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Articles", href: "/dashboard/articles" },
    { name: "Collaborate", href: "/dashboard/collaborate" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Settings", href: "/dashboard/settings" },
  ]

  useEffect(() => {
    // Fetch user stats (with caching to avoid duplicate requests)
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        // Check if we have cached stats (within 30 seconds)
        const cachedStats = sessionStorage.getItem('headerStats')
        const cachedTime = sessionStorage.getItem('headerStatsTime')
        if (cachedStats && cachedTime && (Date.now() - parseInt(cachedTime)) < 30000) {
          const cached = JSON.parse(cachedStats)
          setStats(cached)
          return
        }

        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const newStats = {
            totalViews: data.data.totalViews || 0,
            totalPosts: data.data.totalArticles || 0,
          }
          setStats(newStats)
          // Cache the stats
          sessionStorage.setItem('headerStats', JSON.stringify(newStats))
          sessionStorage.setItem('headerStatsTime', Date.now().toString())
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
    <header style={{
      display: 'flex',
      height: '64px',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.background,
      padding: '0 16px',
    }}>
      {/* Mobile Menu Button - only visible on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="mobile-menu-toggle"
        style={{
          height: '36px',
          width: '36px',
          color: theme.colors.text.secondary,
        }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X style={{ height: '20px', width: '20px' }} strokeWidth={1.5} />
        ) : (
          <Menu style={{ height: '20px', width: '20px' }} strokeWidth={1.5} />
        )}
      </Button>

      {/* Mobile Logo - only visible on mobile */}
      <Link href="/dashboard" className="show-mobile-flex" style={{ alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <PenTool style={{ height: '20px', width: '20px', color: theme.colors.text.primary }} strokeWidth={2} />
        <span style={{ fontSize: '16px', fontWeight: 500, color: theme.colors.text.primary }}>PublishType</span>
      </Link>

      <div className="hidden md:flex" style={{ flex: 1, alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            height: '16px',
            width: '16px',
            transform: 'translateY(-50%)',
            color: theme.colors.text.muted,
          }} />
          <Input
            type="search"
            placeholder="Search articles, platforms, or settings..."
            style={{
              paddingLeft: '40px',
              height: '36px',
              fontSize: '13px',
              border: `1px solid ${theme.colors.borderStrong}`,
              backgroundColor: theme.colors.surface,
              borderRadius: '6px',
            }}
            className="focus:ring-1 focus:ring-[#1f3529]"
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Stat Boxes - Hidden on mobile */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 16px',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            backgroundColor: theme.colors.surface,
            minWidth: '70px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp style={{ height: '12px', width: '12px', color: theme.colors.primary }} strokeWidth={2} />
              <span style={{ fontSize: '11px', color: theme.colors.text.muted }}>Views</span>
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.colors.text.primary,
            }}>
              {stats.totalViews >= 1000
                ? `${(stats.totalViews / 1000).toFixed(1)}K`
                : stats.totalViews}
            </span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 16px',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            backgroundColor: theme.colors.surface,
            minWidth: '70px',
          }}>
            <span style={{ fontSize: '11px', color: theme.colors.text.muted }}>Posts</span>
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.colors.text.primary,
            }}>{stats.totalPosts}</span>
          </div>
        </div>

        <div className="hidden lg:block" style={{ height: '32px', width: '1px', backgroundColor: theme.colors.border }} />

        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex hover:bg-[rgba(235,228,213,0.5)]"
          style={{
            height: '36px',
            width: '36px',
            color: theme.colors.text.secondary,
          }}
          onClick={() => router.push('/dashboard/settings')}
        >
          <Settings style={{ height: '18px', width: '18px' }} strokeWidth={1.5} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          style={{
            height: '36px',
            width: '36px',
            color: theme.colors.text.secondary,
          }}
          onClick={logout}
          title="Logout"
          className="hover:bg-[rgba(235,228,213,0.5)]"
        >
          <LogOut style={{ height: '18px', width: '18px' }} strokeWidth={1.5} />
        </Button>

        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
          <span className="hidden md:inline" style={{ fontSize: '13px', color: theme.colors.text.secondary }}>{user?.name || 'User'}</span>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                height: '32px',
                width: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              height: '32px',
              width: '32px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {user ? getInitials(user.name) : 'U'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Mobile Navigation Menu */}
    {mobileMenuOpen && (
      <div className="show-mobile" style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.background,
        zIndex: 50,
        padding: '16px',
        borderTop: `1px solid ${theme.colors.border}`,
      }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 16px',
                  fontSize: '16px',
                  fontWeight: isActive ? 600 : 400,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
                  backgroundColor: isActive ? theme.colors.secondary : 'transparent',
                }}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User info in mobile menu */}
        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              height: '40px',
              width: '40px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                {user ? getInitials(user.name) : 'U'}
              </span>
            </div>
          )}
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: theme.colors.text.primary }}>{user?.name || 'User'}</p>
            <p style={{ fontSize: '12px', color: theme.colors.text.muted }}>{user?.email || ''}</p>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
