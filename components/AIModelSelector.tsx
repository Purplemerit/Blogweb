"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Lock, Sparkles, Zap, Crown, Info } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import Link from "next/link"

interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  requiredPlan: string
  badge: string
  isLocked?: boolean
  capabilities?: {
    contentGeneration: boolean
    seoAnalysis: boolean
    grammarCheck: boolean
    toneAdjustment: boolean
    factChecking: boolean
  }
  pricing?: {
    costPer1kTokens: number
    currency: string
  }
}

interface AIModelSelectorProps {
  value?: string
  onChange: (modelId: string) => void
  className?: string
}

export function AIModelSelector({ value, onChange, className }: AIModelSelectorProps) {
  const { user } = useAuth()
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedModel, setSelectedModel] = useState(value || '')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeInfo, setUpgradeInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModels()
  }, [])

  useEffect(() => {
    if (value) {
      setSelectedModel(value)
    }
  }, [value])

  const fetchModels = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/ai/models', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setModels(data.data.models)
        if (!value) {
          setSelectedModel(data.data.defaultModel)
          onChange(data.data.defaultModel)
        }
      }
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === modelId)

    if (model?.isLocked) {
      // Show upgrade modal
      setUpgradeInfo({
        model: model.name,
        requiredPlan: model.requiredPlan,
        badge: model.badge,
        description: model.description,
      })
      setShowUpgradeModal(true)
    } else {
      setSelectedModel(modelId)
      onChange(modelId)
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return '🤖'
      case 'openai': return '🧠'
      case 'anthropic': return '🎯'
      default: return '✨'
    }
  }

  const getPlanIcon = (badge: string) => {
    switch (badge) {
      case 'FREE': return <Zap className="h-3 w-3" />
      case 'STARTER+': return <Sparkles className="h-3 w-3" />
      case 'CREATOR+': return <Sparkles className="h-3 w-3" />
      case 'PRO': return <Crown className="h-3 w-3" />
      default: return null
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'FREE': return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'STARTER+': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'CREATOR+': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'PRO': return 'bg-amber-100 text-amber-700 border-amber-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const selectedModelData = models.find(m => m.id === selectedModel)

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <>
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Model
          <span className="ml-2 text-xs text-gray-500">({models.filter(m => !m.isLocked).length}/{models.length} available)</span>
        </label>

        <select
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.isLocked ? '🔒 ' : '✅ '}
              {getProviderIcon(model.provider)} {model.name} [{model.badge}]
            </option>
          ))}
        </select>

        {selectedModelData && (
          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{selectedModelData.name}</span>
                  <Badge variant="outline" className={`text-xs ${getBadgeColor(selectedModelData.badge)}`}>
                    {getPlanIcon(selectedModelData.badge)}
                    <span className="ml-1">{selectedModelData.badge}</span>
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{selectedModelData.description}</p>
                {selectedModelData.capabilities && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedModelData.capabilities.contentGeneration && (
                      <Badge variant="secondary" className="text-xs">Content Generation</Badge>
                    )}
                    {selectedModelData.capabilities.seoAnalysis && (
                      <Badge variant="secondary" className="text-xs">SEO Analysis</Badge>
                    )}
                    {selectedModelData.capabilities.factChecking && (
                      <Badge variant="secondary" className="text-xs">Fact Checking</Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Show locked models count */}
        {models.some(m => m.isLocked) && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-800">
              <Lock className="h-3 w-3 inline mr-1" />
              {models.filter(m => m.isLocked).length} premium model{models.filter(m => m.isLocked).length > 1 ? 's' : ''} available with upgrade
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              Upgrade Required
            </DialogTitle>
            <DialogDescription>
              This AI model requires a higher subscription plan
            </DialogDescription>
          </DialogHeader>

          {upgradeInfo && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getProviderIcon(upgradeInfo.provider || 'openai')}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{upgradeInfo.model}</h3>
                    <Badge className={`text-xs ${getBadgeColor(upgradeInfo.badge)}`}>
                      {getPlanIcon(upgradeInfo.badge)}
                      <span className="ml-1">{upgradeInfo.badge}</span>
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{upgradeInfo.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">Benefits of upgrading to {upgradeInfo.requiredPlan}:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {upgradeInfo.requiredPlan === 'STARTER' && (
                    <>
                      <li>✅ Access to GPT-4o Mini & Gemini Pro</li>
                      <li>✅ 20 articles/month (vs 5)</li>
                      <li>✅ Unlimited platform connections</li>
                      <li>✅ Multi-platform publishing</li>
                      <li>✅ Competitor SEO analysis</li>
                      <li className="font-semibold text-blue-600 mt-2">Only ₹50/month</li>
                    </>
                  )}
                  {upgradeInfo.requiredPlan === 'CREATOR' && (
                    <>
                      <li>✅ Access to GPT-4o & Claude 3.5 Sonnet</li>
                      <li>✅ 100 articles/month</li>
                      <li>✅ Advanced AI editor</li>
                      <li>✅ Content gap analysis</li>
                      <li>✅ API access & webhooks</li>
                      <li className="font-semibold text-purple-600 mt-2">Only ₹150/month</li>
                    </>
                  )}
                  {upgradeInfo.requiredPlan === 'PROFESSIONAL' && (
                    <>
                      <li>✅ Access to ALL AI models</li>
                      <li>✅ Unlimited articles</li>
                      <li>✅ Comprehensive SEO analysis</li>
                      <li>✅ White label branding</li>
                      <li>✅ Dedicated account manager</li>
                      <li className="font-semibold text-amber-600 mt-2">Only ₹200/month</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex gap-2">
                <Link href="/dashboard/settings/billing" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
                  Maybe Later
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
