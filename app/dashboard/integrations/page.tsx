"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Plus,
  Check,
  AlertCircle,
  Loader2,
  Send,
  Globe,
  LayoutGrid,
  Sparkles,
  Share2,
  Settings,
  ChevronRight,
  Clock,
  FileText
} from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { GhostConnectModal } from "@/components/GhostConnectModal"
import { DevToConnectModal } from "@/components/DevToConnectModal"
import { HashnodeConnectModal } from "@/components/HashnodeConnectModal"
import { toast } from "sonner"

interface PlatformConnection {
  id: string
  platform: string
  status: string
  metadata: {
    blogUrl?: string
    displayName?: string
    username?: string
    apiUrl?: string
    siteName?: string
    siteUrl?: string
  }
  lastSyncAt: string
}

function IntegrationsContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [connections, setConnections] = useState<PlatformConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connectingWordPress, setConnectingWordPress] = useState(false)
  const [connectingWix, setConnectingWix] = useState(false)
  const [showGhostModal, setShowGhostModal] = useState(false)
  const [showDevToModal, setShowDevToModal] = useState(false)
  const [showHashnodeModal, setShowHashnodeModal] = useState(false)
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'CMS' | 'BLOGGING' | 'SOCIAL MEDIA'>('ALL')

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'wordpress_connected') {
      toast.success('WordPress.com connected successfully!')
      router.replace('/dashboard/integrations')
      fetchConnections()
    } else if (success === 'wix_connected') {
      toast.success('Wix connected successfully!')
      router.replace('/dashboard/integrations')
      fetchConnections()
    }

    if (error) {
      toast.error('Connection failed')
      router.replace('/dashboard/integrations')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (user) {
      fetchConnections()
    }
  }, [user])

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/platforms/connections', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setConnections(data.data.connections || [])
      }
    } catch (error) {
      console.error('Error fetching connections:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectWordPress = () => {
    if (!user) return
    setConnectingWordPress(true)
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_WORDPRESS_CLIENT_ID || '',
      redirect_uri: `${window.location.origin}/api/oauth/wordpress/callback`,
      response_type: 'code',
      state: user.id,
      scope: 'posts'
    })
    window.location.href = `https://public-api.wordpress.com/oauth2/authorize?${params.toString()}`
  }

  const connectWix = async () => {
    if (!user) return
    try {
      setConnectingWix(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/oauth/wix', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl
      } else {
        toast.error('Failed to initiate Wix connection')
        setConnectingWix(false)
      }
    } catch (error) {
      toast.error('Failed to connect Wix')
      setConnectingWix(false)
    }
  }

  const disconnectPlatform = async (connectionId: string, platform: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) return
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/platforms/connections/${connectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok && data.success) {
        toast.success(`${platform} disconnected`)
        fetchConnections()
      }
    } catch (error) {
      toast.error('Failed to disconnect platform')
    }
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><Loader2 className="animate-spin" size={40} style={{ color: '#FF7A33' }} /></div>

  const platformDefinitions = [
    { name: 'Wordpress', type: 'CMS', color: '#21759b', connect: connectWordPress, key: 'WORDPRESS', description: 'Publish your stories directly to your WordPress blog. All formatting and images are synced automatically.' },
    { name: 'Ghost', type: 'CMS', color: '#15171a', connect: () => setShowGhostModal(true), key: 'GHOST', description: 'Modern publishing platform for professionals. Connect via Admin API to sync content.' },
    { name: 'Dev.to', type: 'BLOGGING', color: '#0a0a0a', connect: () => setShowDevToModal(true), key: 'DEVTO', description: 'Share your technical articles with the developer community on Dev.to.' },
    { name: 'Hashnode', type: 'BLOGGING', color: '#2962ff', connect: () => setShowHashnodeModal(true), key: 'HASHNODE', description: 'Connect your personal domain blog on Hashnode to sync and publish instantly.' },
    { name: 'Wix', type: 'CMS', color: '#faad14', connect: connectWix, key: 'WIX', description: 'Sync and manage your content on your Wix Site with total creative control.' },
    { name: 'LinkedIn', type: 'SOCIAL MEDIA', color: '#0077b5', connect: () => { }, key: 'LINKEDIN', description: 'Draft and publish professional articles directly to your LinkedIn profile feed.', comingSoon: true },
  ]

  const connectedPlatforms = platformDefinitions.filter(p => connections.find(c => c.platform === p.key))
  const availablePlatforms = platformDefinitions.filter(p => !connections.find(c => c.platform === p.key))

  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          .integrations-hero {
            padding: 40px 20px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .integrations-hero h1 {
            font-size: 32px !important;
          }
          .integrations-hero button {
            width: 100% !important;
            justify-content: center !important;
          }
          .integrations-tabs {
            padding: 0 20px !important;
            overflow-x: auto !important;
          }
          .integrations-content {
            padding: 40px 20px !important;
          }
          .integrations-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }

        @media (max-width: 480px) {
          .integrations-hero {
            padding: 32px 16px !important;
          }
          .integrations-hero h1 {
            font-size: 28px !important;
            line-height: 1.2 !important;
          }
          .integrations-content {
            padding: 32px 12px !important;
          }
          .integrations-card {
            border-radius: 24px !important;
            padding: 24px !important;
          }
        }
      `}</style>

      <div style={{
        paddingBottom: '100px',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url("/design/BG%2023-01%202.png")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>

        {/* Header Section */}
        <section className="integrations-hero" style={{
          padding: '60px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px 0' }}>Platform Integrations</h1>
            <p style={{ color: '#666', fontSize: '15px', fontWeight: 500 }}>Connect your favorite tools to automate your publishing workflows.</p>
          </div>
          <button
            onClick={() => document.getElementById('available-platforms')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: '#FF7A33',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)'
            }}>
            <Plus size={18} strokeWidth={3} /> ADD NEW PLATFORMS
          </button>
        </section>

        <section className="integrations-content" style={{ padding: '40px' }}>

          {/* Section 1: Connected Platforms */}
          {connectedPlatforms.length > 0 && (
            <div style={{ marginBottom: '80px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '32px' }}>Connected Platforms</h2>
              <div className="integrations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                {connectedPlatforms.map((p) => {
                  const conn = connections.find(c => c.platform === p.key)!
                  return (
                    <div key={p.key} style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '32px',
                      border: '1px solid rgba(238, 238, 238, 0.5)',
                      padding: '32px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#FFF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7A33' }}>
                            <Share2 size={24} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{p.name}</h3>
                              <span style={{ backgroundColor: '#e7f9ee', color: '#22c55e', padding: '2px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>ACTIVE</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999', fontWeight: 600 }}>{conn.metadata?.blogUrl || conn.metadata?.apiUrl || conn.metadata?.siteName || 'Connected'}</p>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700 }}>
                          <span style={{ color: '#999' }}>Last synced</span>
                          <span style={{ color: '#1a1a1a' }}>10 mins ago</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700 }}>
                          <span style={{ color: '#999' }}>Article Published</span>
                          <span style={{ color: '#1a1a1a' }}>1,248</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '98%', backgroundColor: '#FF7A33', borderRadius: '4px' }}></div>
                        </div>
                        <p style={{ margin: 0, textAlign: 'right', fontSize: '12px', fontWeight: 800, color: '#1a1a1a' }}>98% success rate</p>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => window.open(conn.metadata?.blogUrl || conn.metadata?.apiUrl || conn.metadata?.siteUrl || '#', '_blank')}
                          style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fff', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>MANAGE</button>
                        <button
                          onClick={() => disconnectPlatform(conn.id, p.name)}
                          style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', cursor: 'pointer' }}>
                          <Settings size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Section 2: Available Platforms */}
          <div id="available-platforms">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Available Platforms</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['ALL', 'CMS', 'BLOGGING', 'SOCIAL MEDIA'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setPlatformFilter(f as any)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '50px',
                      border: platformFilter === f ? 'none' : '1px solid #eee',
                      backgroundColor: platformFilter === f ? '#FF7A33' : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(5px)',
                      color: platformFilter === f ? '#fff' : '#666',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="integrations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
              {availablePlatforms.filter(p => platformFilter === 'ALL' || p.type === platformFilter).map((p) => (
                <div key={p.key} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '32px',
                  border: '1px solid rgba(238, 238, 238, 0.5)',
                  padding: '32px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '340px',
                  opacity: p.comingSoon ? 0.6 : 1
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#fcfcfc', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7A33' }}>
                        <Share2 size={24} />
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 900, color: '#999', backgroundColor: 'rgba(249, 249, 249, 0.8)', padding: '4px 12px', borderRadius: '50px' }}>{p.type}</span>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px 0' }}>{p.name}</h3>
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>{p.description}</p>
                  </div>

                  <button
                    onClick={p.connect}
                    disabled={p.comingSoon || (p.key === 'WORDPRESS' && connectingWordPress) || (p.key === 'WIX' && connectingWix)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '16px',
                      backgroundColor: p.comingSoon ? 'rgba(249, 249, 249, 0.5)' : '#1a1a1a',
                      color: p.comingSoon ? '#999' : '#fff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: p.comingSoon ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}>
                    {p.comingSoon ? 'COMING SOON' : (
                      <>
                        {((p.key === 'WORDPRESS' && connectingWordPress) || (p.key === 'WIX' && connectingWix)) ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
                        CONNECT {p.name.toUpperCase()}
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Info Footer */}
          <div style={{
            marginTop: '100px',
            backgroundColor: 'rgba(255, 245, 240, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '40px',
            padding: '60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid rgba(255, 122, 51, 0.1)'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7A33' }}>
                  <Sparkles size={20} />
                </div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#1a1a1a' }}>Omni-Channel Sync</h2>
              </div>
              <p style={{ fontSize: '16px', color: '#1a1a1a', opacity: 0.7, lineHeight: '1.7', marginBottom: '0' }}>
                Your content is valuable. We ensure it reaches every audience across your blogs, CMS, and social platforms with pixel-perfect accuracy and real-time syncing.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1a1a1a' }}>5+</p>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#FF7A33' }}>CMS PLATFORMS</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1a1a1a' }}>100%</p>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#FF7A33' }}>SYNC ACCURACY</p>
              </div>
            </div>
          </div>

        </section>

        {/* Modals */}
        <GhostConnectModal open={showGhostModal} onClose={() => setShowGhostModal(false)} onSuccess={() => fetchConnections()} />
        <DevToConnectModal open={showDevToModal} onClose={() => setShowDevToModal(false)} onSuccess={() => fetchConnections()} />
        <HashnodeConnectModal open={showHashnodeModal} onClose={() => setShowHashnodeModal(false)} onSuccess={() => fetchConnections()} />
      </div>
    </>
  )
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><Loader2 className="animate-spin" size={40} style={{ color: '#FF7A33' }} /></div>}>
      <IntegrationsContent />
    </Suspense>
  )
}
