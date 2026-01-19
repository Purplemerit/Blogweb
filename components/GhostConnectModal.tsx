"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface GhostConnectModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function GhostConnectModal({ open, onClose, onSuccess }: GhostConnectModalProps) {
  const [apiUrl, setApiUrl] = useState("")
  const [adminApiKey, setAdminApiKey] = useState("")
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async () => {
    if (!apiUrl.trim() || !adminApiKey.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    // Validate API URL format
    try {
      new URL(apiUrl)
    } catch {
      toast.error("Please enter a valid URL (e.g., https://yourblog.ghost.io)")
      return
    }

    // Validate API key format (should be id:secret)
    if (!adminApiKey.includes(':')) {
      toast.error("Invalid API key format. Should be in format: id:secret")
      return
    }

    try {
      setConnecting(true)
      const token = localStorage.getItem('accessToken')

      const response = await fetch('/api/platforms/ghost/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          apiUrl: apiUrl.trim(),
          adminApiKey: adminApiKey.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Ghost site connected: ${data.data.siteName}`)
        setApiUrl("")
        setAdminApiKey("")
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || 'Failed to connect Ghost site')
      }
    } catch (error) {
      console.error('Error connecting Ghost:', error)
      toast.error('Failed to connect Ghost site')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Connect Ghost Site</DialogTitle>
          <DialogDescription className="text-sm text-neutral-600">
            Connect your Ghost blog to publish articles directly from Publish Type
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl" className="text-sm font-medium text-neutral-700">
              Ghost Site URL
            </Label>
            <Input
              id="apiUrl"
              type="url"
              placeholder="https://yourblog.ghost.io"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="h-11"
              disabled={connecting}
            />
            <p className="text-xs text-neutral-500">
              Your Ghost site URL (e.g., https://yourblog.ghost.io)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminApiKey" className="text-sm font-medium text-neutral-700">
              Admin API Key
            </Label>
            <Input
              id="adminApiKey"
              type="password"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={adminApiKey}
              onChange={(e) => setAdminApiKey(e.target.value)}
              className="h-11 font-mono text-xs"
              disabled={connecting}
            />
            <p className="text-xs text-neutral-500">
              Format: id:secret (get from Ghost Admin → Integrations → Add custom integration)
            </p>
          </div>

          {/* Help section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-blue-900">How to get your Admin API Key:</h4>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to your Ghost Admin panel</li>
                  <li>Navigate to Settings → Integrations</li>
                  <li>Click "Add custom integration"</li>
                  <li>Give it a name (e.g., "Publish Type")</li>
                  <li>Copy the "Admin API Key"</li>
                </ol>
                <a
                  href="https://ghost.org/docs/admin-api/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
                >
                  View Ghost API Documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={connecting}
            className="px-5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={connecting || !apiUrl.trim() || !adminApiKey.trim()}
            className="bg-neutral-900 hover:bg-neutral-800 text-white px-5"
          >
            {connecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Ghost'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
