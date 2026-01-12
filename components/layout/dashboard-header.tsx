"use client"

import { Search, Settings, Maximize2, TrendingUp, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { theme } from "@/lib/theme"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ totalViews: 0, totalPosts: 0 })

  useEffect(() => {
    // Fetch user stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStats({
            totalViews: data.data.totalViews || 0,
            totalPosts: data.data.totalArticles || 0,
          })
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
    <header style={{
      display: 'flex',
      height: '64px',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.background,
      padding: '0 24px',
    }}>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '16px' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Stat Boxes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        <div style={{ height: '32px', width: '1px', backgroundColor: theme.colors.border }} />

        <Button
          variant="ghost"
          size="icon"
          style={{
            height: '36px',
            width: '36px',
            color: theme.colors.text.secondary,
          }}
          onClick={() => router.push('/dashboard/settings')}
          className="hover:bg-[rgba(235,228,213,0.5)]"
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
          <span style={{ fontSize: '13px', color: theme.colors.text.secondary }}>{user?.name || 'User'}</span>
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
  )
}
