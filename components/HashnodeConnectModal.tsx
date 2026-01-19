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

interface HashnodeConnectModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function HashnodeConnectModal({ open, onClose, onSuccess }: HashnodeConnectModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your API key")
      return
    }

    try {
      setConnecting(true)
      const token = localStorage.getItem('accessToken')

      const response = await fetch('/api/platforms/hashnode/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          apiKey: apiKey.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Hashnode connected: @${data.data.username}`)
        setApiKey("")
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || 'Failed to connect Hashnode account')
      }
    } catch (error) {
      console.error('Error connecting Hashnode:', error)
      toast.error('Failed to connect Hashnode account')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Connect Hashnode Account</DialogTitle>
          <DialogDescription className="text-sm text-neutral-600">
            Connect your Hashnode blog to publish articles directly from Publish Type
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium text-neutral-700">
              Hashnode API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Hashnode Personal Access Token"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-11 font-mono text-sm"
              disabled={connecting}
            />
            <p className="text-xs text-neutral-500">
              Get your Personal Access Token from Hashnode Settings → Developer
            </p>
          </div>

          {/* Help section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-blue-900">How to get your API Key:</h4>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to your Hashnode account settings</li>
                  <li>Click on "Developer" in the left sidebar</li>
                  <li>Scroll to "Personal Access Tokens"</li>
                  <li>Click "Generate New Token"</li>
                  <li>Give it a name and select required permissions</li>
                  <li>Copy the token and paste it here</li>
                </ol>
                <a
                  href="https://hashnode.com/settings/developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
                >
                  Open Hashnode Developer Settings
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-2">What you can do:</h4>
            <ul className="text-xs text-neutral-600 space-y-1">
              <li>✅ Publish articles to your Hashnode blog</li>
              <li>✅ Auto-convert HTML to Markdown</li>
              <li>✅ Include tags and subtitle</li>
              <li>✅ Add cover images</li>
              <li>✅ SEO-friendly content</li>
            </ul>
          </div>

          {/* Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> You must have a Hashnode blog created before connecting.
              Visit <a href="https://hashnode.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">hashnode.com</a> to create one if you haven't already.
            </p>
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
            disabled={connecting || !apiKey.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5"
          >
            {connecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Hashnode'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
