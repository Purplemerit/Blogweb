"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, Check, AlertCircle, Loader2 } from "lucide-react"
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
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'CMS' | 'BLOGGING'>('ALL')

  useEffect(() => {
    // Handle OAuth callback messages
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'wordpress_connected') {
      toast.success('WordPress.com connected successfully!')
      // Remove query params
      router.replace('/dashboard/integrations')
      fetchConnections()
    }

    if (success === 'wix_connected') {
      toast.success('Wix connected successfully!')
      router.replace('/dashboard/integrations')
      fetchConnections()
    }

    if (error) {
      const errorMessages: Record<string, string> = {
        no_code: 'Authorization code not received',
        invalid_state: 'Invalid authorization state',
        token_exchange_failed: 'Failed to exchange authorization code',
        connection_failed: 'Failed to connect to WordPress.com'
      }
      toast.error(errorMessages[error] || 'Connection failed')
      router.replace('/dashboard/integrations')
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      fetchConnections()
    }
  }, [user])

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/platforms/connections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

    // Build WordPress.com OAuth URL
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_WORDPRESS_CLIENT_ID || '',
      redirect_uri: `${window.location.origin}/api/oauth/wordpress/callback`,
      response_type: 'code',
      state: user.id,
      scope: 'posts'
    })

    const authUrl = `https://public-api.wordpress.com/oauth2/authorize?${params.toString()}`
    window.location.href = authUrl
  }

  const connectWix = async () => {
    if (!user) return

    try {
      setConnectingWix(true)
      const token = localStorage.getItem('accessToken')

      const response = await fetch('/api/oauth/wix', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success && data.authUrl) {
        window.location.href = data.authUrl
      } else {
        toast.error('Failed to initiate Wix connection')
        setConnectingWix(false)
      }
    } catch (error) {
      console.error('Error connecting Wix:', error)
      toast.error('Failed to connect Wix')
      setConnectingWix(false)
    }
  }

  const disconnectPlatform = async (connectionId: string, platform: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/platforms/connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(`${platform} disconnected`)
        fetchConnections()
      } else {
        console.error('Disconnect error:', data)
        toast.error(data.error || 'Failed to disconnect platform')
      }
    } catch (error) {
      console.error('Error disconnecting platform:', error)
      toast.error('Failed to disconnect platform')
    }
  }

  const wpConnection = connections.find(c => c.platform === 'WORDPRESS')
  const ghostConnection = connections.find(c => c.platform === 'GHOST')
  const devtoConnection = connections.find(c => c.platform === 'DEVTO')
  const hashnodeConnection = connections.find(c => c.platform === 'HASHNODE')
  const wixConnection = connections.find(c => c.platform === 'WIX')

  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-neutral-900 mb-1 tracking-tight">Platform Integrations</h1>
        <p className="text-[13px] text-neutral-500">Connect your favorite platforms to auto-publish your content</p>
      </div>

      {/* Connected Platforms */}
      {connections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">Connected Platforms</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {wpConnection && (
              <Card className="border border-neutral-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        W
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[11px] font-medium border-0 gap-1">
                      <Check className="h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                  <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">WordPress.com</h3>
                  <p className="text-[12px] text-neutral-500 mb-1">Account</p>
                  <p className="text-[13px] text-neutral-900 mb-3 truncate">{wpConnection.metadata?.displayName || wpConnection.metadata?.username || 'Connected'}</p>
                  <p className="text-[12px] text-neutral-500 mb-1">Blog URL</p>
                  <p className="text-[13px] text-neutral-900 mb-4 truncate">{wpConnection.metadata?.blogUrl || 'N/A'}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-[12px] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => disconnectPlatform(wpConnection.id, 'WordPress.com')}
                    >
                      DISCONNECT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {ghostConnection && (
              <Card className="border border-neutral-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <div className="h-6 w-6 rounded bg-neutral-900 flex items-center justify-center text-white text-xs font-bold">
                        G
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[11px] font-medium border-0 gap-1">
                      <Check className="h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                  <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">Ghost</h3>
                  <p className="text-[12px] text-neutral-500 mb-1">Site Name</p>
                  <p className="text-[13px] text-neutral-900 mb-3 truncate">{ghostConnection.metadata?.siteName || 'Ghost Site'}</p>
                  <p className="text-[12px] text-neutral-500 mb-1">Site URL</p>
                  <p className="text-[13px] text-neutral-900 mb-4 truncate">{ghostConnection.metadata?.apiUrl || 'N/A'}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-[12px] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => disconnectPlatform(ghostConnection.id, 'Ghost')}
                    >
                      DISCONNECT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {devtoConnection && (
              <Card className="border border-neutral-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-neutral-900 flex items-center justify-center">
                      <div className="h-6 w-6 text-white flex items-center justify-center text-[10px] font-bold">
                        DEV
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[11px] font-medium border-0 gap-1">
                      <Check className="h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                  <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">Dev.to</h3>
                  <p className="text-[12px] text-neutral-500 mb-1">Username</p>
                  <p className="text-[13px] text-neutral-900 mb-4 truncate">@{devtoConnection.metadata?.username || 'Connected'}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-[12px] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => disconnectPlatform(devtoConnection.id, 'Dev.to')}
                    >
                      DISCONNECT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {hashnodeConnection && (
              <Card className="border border-neutral-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                      <div className="h-6 w-6 text-white flex items-center justify-center text-xs font-bold">
                        H
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[11px] font-medium border-0 gap-1">
                      <Check className="h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                  <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">Hashnode</h3>
                  <p className="text-[12px] text-neutral-500 mb-1">Username</p>
                  <p className="text-[13px] text-neutral-900 mb-4 truncate">@{hashnodeConnection.metadata?.username || 'Connected'}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-[12px] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => disconnectPlatform(hashnodeConnection.id, 'Hashnode')}
                    >
                      DISCONNECT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {wixConnection && (
              <Card className="border border-neutral-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center">
                      <div className="h-6 w-6 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        W
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[11px] font-medium border-0 gap-1">
                      <Check className="h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                  <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">Wix</h3>
                  <p className="text-[12px] text-neutral-500 mb-1">Site</p>
                  <p className="text-[13px] text-neutral-900 mb-3 truncate">{wixConnection.metadata?.siteName || 'Connected'}</p>
                  <p className="text-[12px] text-neutral-500 mb-1">Site URL</p>
                  <p className="text-[13px] text-neutral-900 mb-4 truncate">{wixConnection.metadata?.siteUrl || 'N/A'}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-[12px] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => disconnectPlatform(wixConnection.id, 'Wix')}
                    >
                      DISCONNECT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-neutral-900">Available Platforms</h2>
          <div className="flex gap-2">
            <Button
              variant={platformFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-[11px] font-medium"
              onClick={() => setPlatformFilter('ALL')}
            >
              ALL
            </Button>
            <Button
              variant={platformFilter === 'CMS' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-[11px] font-medium"
              onClick={() => setPlatformFilter('CMS')}
            >
              CMS
            </Button>
            <Button
              variant={platformFilter === 'BLOGGING' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-[11px] font-medium"
              onClick={() => setPlatformFilter('BLOGGING')}
            >
              BLOGGING
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* WordPress.com - CMS */}
          {!wpConnection && (platformFilter === 'ALL' || platformFilter === 'CMS') && (
            <Card className="border border-neutral-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      W
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10px] font-medium border-0">
                    READY
                  </Badge>
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">WordPress.com</h3>
                <p className="text-[12px] text-neutral-500 mb-4">
                  Automatically publish your articles to WordPress.com blogs.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full h-8 text-[12px] bg-blue-600 hover:bg-blue-700"
                  onClick={connectWordPress}
                  disabled={connectingWordPress}
                >
                  {connectingWordPress ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      CONNECTING...
                    </>
                  ) : (
                    'CONNECT'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Dev.to - BLOGGING */}
          {!devtoConnection && (platformFilter === 'ALL' || platformFilter === 'BLOGGING') && (
            <Card className="border border-neutral-200 shadow-sm hover:border-neutral-300 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 text-white flex items-center justify-center text-[10px] font-bold">
                      DEV
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10px] font-medium border-0">
                    READY
                  </Badge>
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">Dev.to</h3>
                <p className="text-[12px] text-neutral-500 mb-4">
                  Publish to Dev.to community. Auto-converts HTML to Markdown.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full h-8 text-[12px] bg-neutral-900 hover:bg-neutral-800"
                  onClick={() => setShowDevToModal(true)}
                >
                  CONNECT
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Ghost - CMS */}
          {!ghostConnection && (platformFilter === 'ALL' || platformFilter === 'CMS') && (
            <Card className="border border-neutral-200 shadow-sm hover:border-neutral-300 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 rounded bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                      G
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10px] font-medium border-0">
                    READY
                  </Badge>
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">Ghost</h3>
                <p className="text-[12px] text-neutral-500 mb-4">
                  Connect your Ghost site to publish content automatically.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full h-8 text-[12px] bg-neutral-900 hover:bg-neutral-800"
                  onClick={() => setShowGhostModal(true)}
                >
                  CONNECT
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Hashnode - BLOGGING */}
          {!hashnodeConnection && (platformFilter === 'ALL' || platformFilter === 'BLOGGING') && (
            <Card className="border border-neutral-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 text-white flex items-center justify-center text-xs font-bold">
                      H
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10px] font-medium border-0">
                    READY
                  </Badge>
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">Hashnode</h3>
                <p className="text-[12px] text-neutral-500 mb-4">
                  Publish to your Hashnode blog. Auto-converts HTML to Markdown.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full h-8 text-[12px] bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowHashnodeModal(true)}
                >
                  CONNECT
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Wix - CMS */}
          {!wixConnection && (platformFilter === 'ALL' || platformFilter === 'CMS') && (
            <Card className="border border-neutral-200 shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 rounded bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                      W
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10px] font-medium border-0">
                    READY
                  </Badge>
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">Wix</h3>
                <p className="text-[12px] text-neutral-500 mb-4">
                  Publish articles to your Wix Blog. Perfect for business sites.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full h-8 text-[12px] bg-orange-500 hover:bg-orange-600"
                  onClick={connectWix}
                  disabled={connectingWix}
                >
                  {connectingWix ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      CONNECTING...
                    </>
                  ) : (
                    'CONNECT'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* LinkedIn - BLOGGING */}
          {(platformFilter === 'ALL' || platformFilter === 'BLOGGING') && (
          <Card className="border border-neutral-200 shadow-sm opacity-60">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    in
                  </div>
                </div>
                <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-[10px] font-medium border-0">
                  SOON
                </Badge>
              </div>
              <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">LinkedIn</h3>
              <p className="text-[12px] text-neutral-500 mb-4">
                Publish articles to your LinkedIn profile. Coming soon.
              </p>
              <Button variant="outline" size="sm" className="w-full h-8 text-[12px]" disabled>
                COMING SOON
              </Button>
            </CardContent>
          </Card>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[13px] font-semibold text-blue-900 mb-1">Platform Setup Instructions</h3>
            <p className="text-[12px] text-blue-700 mb-2">
              <strong>WordPress.com:</strong> Click CONNECT and authorize on WordPress.com to link your blog.
            </p>
            <p className="text-[12px] text-blue-700 mb-2">
              <strong>Ghost:</strong> Click CONNECT and enter your Ghost site URL and Admin API Key from Settings → Integrations.
            </p>
            <p className="text-[12px] text-blue-700 mb-2">
              <strong>Dev.to:</strong> Click CONNECT and enter your Dev.to API key from Settings → Extensions.
            </p>
            <p className="text-[12px] text-blue-700">
              <strong>Hashnode:</strong> Click CONNECT and enter your Personal Access Token from Settings → Developer.
            </p>
          </div>
        </div>
      </div>

      {/* Ghost Connect Modal */}
      <GhostConnectModal
        open={showGhostModal}
        onClose={() => setShowGhostModal(false)}
        onSuccess={() => fetchConnections()}
      />

      {/* Dev.to Connect Modal */}
      <DevToConnectModal
        open={showDevToModal}
        onClose={() => setShowDevToModal(false)}
        onSuccess={() => fetchConnections()}
      />

      {/* Hashnode Connect Modal */}
      <HashnodeConnectModal
        open={showHashnodeModal}
        onClose={() => setShowHashnodeModal(false)}
        onSuccess={() => fetchConnections()}
      />
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    }>
      <IntegrationsContent />
    </Suspense>
  )
}
