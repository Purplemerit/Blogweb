"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, X, Globe, Calendar, Clock } from "lucide-react"
import { toast } from "sonner"

interface Platform {
  id: string
  platform: string
  status: string
  metadata: {
    blogUrl?: string
    displayName?: string
    username?: string
    apiUrl?: string
    siteName?: string
  }
}

interface PublishModalProps {
  open: boolean
  onClose: () => void
  articleId: string
  articleTitle: string
}

export function PublishModal({ open, onClose, articleId, articleTitle }: PublishModalProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState<Record<string, { success: boolean; url?: string; error?: string }>>({})
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  useEffect(() => {
    if (open) {
      fetchPlatforms()
      setPublishResults({})
      setScheduleEnabled(false)
      setScheduleDate('')
      setScheduleTime('')
    }
  }, [open])

  const fetchPlatforms = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      // Always include PublishType as a built-in platform
      const publishTypePlatform: Platform = {
        id: 'publishtype-builtin',
        platform: 'PUBLISHTYPE',
        status: 'CONNECTED',
        metadata: {
          displayName: 'Publish Type',
          blogUrl: window.location.origin
        }
      }

      const response = await fetch('/api/platforms/connections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const connectedPlatforms = data.data.connections.filter((p: Platform) => p.status === 'CONNECTED')

        // Combine PublishType with other connected platforms
        const allPlatforms = [publishTypePlatform, ...connectedPlatforms]
        setPlatforms(allPlatforms)

        // Auto-select all platforms including PublishType
        const selectedIds = allPlatforms.map((p: Platform) => p.id)
        setSelectedPlatforms(selectedIds)
      } else {
        // Even if API fails, show PublishType
        setPlatforms([publishTypePlatform])
        setSelectedPlatforms([publishTypePlatform.id])
      }
    } catch (error) {
      console.error('Error fetching platforms:', error)
      // On error, still show PublishType platform
      const publishTypePlatform: Platform = {
        id: 'publishtype-builtin',
        platform: 'PUBLISHTYPE',
        status: 'CONNECTED',
        metadata: {
          displayName: 'Publish Type',
          blogUrl: window.location.origin
        }
      }
      setPlatforms([publishTypePlatform])
      setSelectedPlatforms([publishTypePlatform.id])
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    // Validate schedule if enabled
    if (scheduleEnabled) {
      if (!scheduleDate || !scheduleTime) {
        toast.error('Please set both date and time for scheduling')
        return
      }

      const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`)
      if (scheduleDateTime <= new Date()) {
        toast.error('Schedule time must be in the future')
        return
      }
    }

    try {
      setPublishing(true)
      const token = localStorage.getItem('accessToken')

      // Get platform names from IDs
      const platformNames = selectedPlatforms.map(id => {
        const platform = platforms.find(p => p.id === id)
        return platform?.platform
      }).filter(Boolean)

      // If scheduling, use the multi-platform publish API
      if (scheduleEnabled) {
        const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`)

        const response = await fetch('/api/platforms/publish-multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            articleId,
            platforms: platformNames,
            scheduleAt: scheduleDateTime.toISOString()
          })
        })

        const data = await response.json()

        if (data.success) {
          toast.success(`Article scheduled for ${scheduleDateTime.toLocaleString()}`)

          // Update article status to SCHEDULED
          await fetch(`/api/articles/${articleId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              status: 'SCHEDULED',
              scheduledAt: scheduleDateTime.toISOString()
            })
          })

          setTimeout(() => {
            onClose()
            window.location.reload() // Refresh to show in Scheduled tab
          }, 1500)
        } else {
          toast.error(data.error || 'Failed to schedule article')
        }
      } else {
        // Handle PublishType publishing separately
        const isPublishTypeSelected = selectedPlatforms.includes('publishtype-builtin')
        const otherPlatforms = platformNames.filter(p => p !== 'PUBLISHTYPE')

        // IMPORTANT: Update article status to PUBLISHED FIRST
        // This must happen before PublishType publish because that API requires status to be PUBLISHED
        const statusResponse = await fetch(`/api/articles/${articleId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'PUBLISHED',
            publishedAt: new Date().toISOString()
          })
        })

        const statusData = await statusResponse.json()

        // Publish to PublishType if selected (now article is PUBLISHED)
        if (isPublishTypeSelected) {
          try {
            const publishTypeResponse = await fetch(`/api/articles/${articleId}/publish-publishtype`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                isPublicOnPublishType: true
              })
            })

            const publishTypeData = await publishTypeResponse.json()

            if (!publishTypeData.success) {
              console.error('PublishType publish failed:', publishTypeData.error)
              toast.error(`PublishType: ${publishTypeData.error}`)
            } else {
              toast.success('Published to Publish Type!')
            }
          } catch (publishTypeError) {
            console.error('PublishType fetch error:', publishTypeError)
            toast.error('Failed to publish to Publish Type')
          }
        }

        // Publish to other platforms if any selected
        if (otherPlatforms.length > 0) {
          const response = await fetch('/api/platforms/publish-multiple', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              articleId,
              platforms: otherPlatforms,
              published: true
            })
          })

          const data = await response.json()

          if (data.success) {
            const successful = data.data.results.filter((r: any) => r.success)
            const failed = data.data.results.filter((r: any) => !r.success)

            if (successful.length > 0 || isPublishTypeSelected) {
              const totalSuccess = successful.length + (isPublishTypeSelected ? 1 : 0)
              toast.success(`Published to ${totalSuccess}/${platformNames.length} platform(s)`)
            }

            if (failed.length > 0) {
              failed.forEach((result: any) => {
                toast.error(`Failed to publish to ${result.platform}: ${result.error}`)
              })
            }
          }
        } else if (isPublishTypeSelected) {
          // Only PublishType was selected - already showed toast above
        }

        setTimeout(() => {
          onClose()
          window.location.reload() // Refresh to update status
        }, 1500)
      }
    } catch (error) {
      console.error('Publish error:', error)
      toast.error('Failed to publish')
    } finally {
      setPublishing(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'PUBLISHTYPE':
        return (
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <div className="h-6 w-6 rounded bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              P
            </div>
          </div>
        )
      case 'WORDPRESS':
        return (
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              W
            </div>
          </div>
        )
      case 'GHOST':
        return (
          <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
            <div className="h-6 w-6 rounded bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
              G
            </div>
          </div>
        )
      case 'DEVTO':
        return (
          <div className="h-10 w-10 rounded-lg bg-neutral-900 flex items-center justify-center">
            <div className="h-6 w-6 text-white flex items-center justify-center text-[10px] font-bold">
              DEV
            </div>
          </div>
        )
      case 'HASHNODE':
        return (
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <div className="h-6 w-6 text-white flex items-center justify-center text-xs font-bold">
              H
            </div>
          </div>
        )
      case 'WIX':
        return (
          <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <div className="h-6 w-6 rounded bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
              W
            </div>
          </div>
        )
      case 'MEDIUM':
        return (
          <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
            <div className="h-6 w-6 rounded bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
              M
            </div>
          </div>
        )
      default:
        return <Globe className="h-10 w-10 text-neutral-400" />
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'PUBLISHTYPE':
        return 'Publish Type (Your Website)'
      case 'WORDPRESS':
        return 'WordPress.com'
      case 'GHOST':
        return 'Ghost'
      case 'DEVTO':
        return 'Dev.to'
      case 'HASHNODE':
        return 'Hashnode'
      case 'WIX':
        return 'Wix'
      case 'MEDIUM':
        return 'Medium'
      case 'LINKEDIN':
        return 'LinkedIn'
      default:
        return platform
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Publish Article</DialogTitle>
          <DialogDescription>
            Select the platforms where you want to publish "{articleTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id)
                  const result = publishResults[platform.id]

                  return (
                    <div
                      key={platform.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleTogglePlatform(platform.id)}
                        disabled={publishing}
                      />

                      {getPlatformIcon(platform.platform)}

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{getPlatformName(platform.platform)}</p>
                          {result && (
                            result.success ? (
                              <Badge className="bg-emerald-500 text-white gap-1">
                                <Check className="h-3 w-3" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <X className="h-3 w-3" />
                                Failed
                              </Badge>
                            )
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">
                          {platform.metadata?.blogUrl || platform.metadata?.siteName || platform.metadata?.displayName || 'Connected'}
                        </p>
                        {result?.url && (
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View post →
                          </a>
                        )}
                        {result?.error && (
                          <p className="text-xs text-red-600 mt-1">{result.error}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {platforms.length > 1 && (
                <div className="text-xs text-center text-neutral-500 py-2">
                  Want to publish to more platforms?{' '}
                  <button
                    onClick={() => {
                      onClose()
                      window.location.href = '/dashboard/integrations'
                    }}
                    className="text-emerald-600 hover:underline font-medium"
                  >
                    Connect platforms
                  </button>
                </div>
              )}
            </>
          )}

          {/* Scheduling Section */}
          {!loading && platforms.length > 0 && (
            <div className="border-t border-neutral-200 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  id="schedule-toggle"
                  checked={scheduleEnabled}
                  onCheckedChange={(checked) => setScheduleEnabled(checked as boolean)}
                  disabled={publishing}
                />
                <Label htmlFor="schedule-toggle" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Schedule for later
                </Label>
              </div>

              {scheduleEnabled && (
                <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label htmlFor="schedule-date" className="text-xs text-neutral-700 mb-1.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Date
                    </Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="text-sm"
                      disabled={publishing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule-time" className="text-xs text-neutral-700 mb-1.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Time
                    </Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="text-sm"
                      disabled={publishing}
                    />
                  </div>
                  {scheduleDate && scheduleTime && (
                    <div className="col-span-2 text-xs text-blue-700 bg-blue-100 p-2 rounded flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Will publish on {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={publishing}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishing || selectedPlatforms.length === 0 || loading}
            className={scheduleEnabled ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}
          >
            {publishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {scheduleEnabled ? 'Scheduling...' : 'Publishing...'}
              </>
            ) : scheduleEnabled ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Schedule for {selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'Platform' : 'Platforms'}
              </>
            ) : (
              `Publish to ${selectedPlatforms.length} ${selectedPlatforms.length === 1 ? 'Platform' : 'Platforms'}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
