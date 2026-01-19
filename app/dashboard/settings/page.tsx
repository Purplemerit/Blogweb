"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, CreditCard, Bell, Lock, User, Loader2, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useRazorpay, PLAN_PRICING_DISPLAY, PLAN_NAMES, PlanType, BillingPeriod } from "@/lib/hooks/useRazorpay"

interface UserProfile {
  id: string
  name: string
  email: string
  bio?: string | null
  avatar?: string | null
  website?: string | null
  twitterHandle?: string | null
  linkedinUrl?: string | null
  emailVerified: boolean
  subscriptionPlan?: string
  subscriptionStatus?: string
  subscriptionStartDate?: string
  subscriptionEndDate?: string
}

interface UserSettings {
  emailOnPublish: boolean
  emailOnMilestone: boolean
  emailWeeklyDigest: boolean
  emailMonthlyReport: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const { loading: paymentLoading, initiatePayment } = useRazorpay()

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    emailOnPublish: true,
    emailOnMilestone: true,
    emailWeeklyDigest: true,
    emailMonthlyReport: false,
    pushNotifications: true,
    inAppNotifications: true,
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        toast.error('Please login to continue')
        router.push('/login')
        return
      }

      // Fetch user profile
      const profileResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!profileResponse.ok) {
        if (profileResponse.status === 401) {
          toast.error('Session expired. Please login again.')
          localStorage.removeItem('accessToken')
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch profile')
      }

      const profileData = await profileResponse.json()
      const user = profileData.data.user

      setProfile(user)
      setName(user.name || "")
      setBio(user.bio || "")
      setWebsite(user.website || "")
      setTwitterHandle(user.twitterHandle || "")
      setLinkedinUrl(user.linkedinUrl || "")

      // Fetch user settings
      const settingsResponse = await fetch('/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        if (settingsData.data.settings) {
          setSettings({
            emailOnPublish: settingsData.data.settings.emailOnPublish,
            emailOnMilestone: settingsData.data.settings.emailOnMilestone,
            emailWeeklyDigest: settingsData.data.settings.emailWeeklyDigest,
            emailMonthlyReport: settingsData.data.settings.emailMonthlyReport,
            pushNotifications: settingsData.data.settings.pushNotifications,
            inAppNotifications: settingsData.data.settings.inAppNotifications,
          })
        }
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load settings')
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('accessToken')

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          bio,
          website,
          twitterHandle,
          linkedinUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          const errorMap: Record<string, string> = {}
          data.details.forEach((error: any) => {
            errorMap[error.path[0]] = error.message
          })
          toast.error(Object.values(errorMap)[0] as string || 'Validation failed')
        } else {
          toast.error(data.error || 'Failed to update profile')
        }
        return
      }

      setProfile(data.data.user)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setChangingPassword(true)
    try {
      const token = localStorage.getItem('accessToken')

      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          const errorMap: Record<string, string> = {}
          data.details.forEach((error: any) => {
            errorMap[error.path[0]] = error.message
          })
          toast.error(Object.values(errorMap)[0] as string || 'Validation failed')
        } else {
          toast.error(data.error || 'Failed to change password')
        }
        return
      }

      toast.success('Password changed successfully! Please login again.')

      // Clear password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Redirect to login after a short delay
      setTimeout(() => {
        localStorage.removeItem('accessToken')
        router.push('/login')
      }, 2000)
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken')

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to update settings')
        return
      }

      toast.success('Settings updated successfully!')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Account Information</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-neutral-50 cursor-not-allowed"
                />
                <p className="text-xs text-neutral-500">Email cannot be changed</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="w-full rounded-lg border border-neutral-200 p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-neutral-500">{bio.length}/500 characters</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Handle</Label>
                <Input
                  id="twitter"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <Button
              className="gap-2 bg-emerald-800 hover:bg-emerald-900"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <p className="text-xs text-neutral-500">
                  Min 8 characters, 1 uppercase, 1 number
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleChangePassword}
              disabled={changingPassword}
            >
              {changingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email on Publish</p>
                <p className="text-sm text-neutral-600">Get notified when articles are published</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={settings.emailOnPublish}
                onChange={(e) => setSettings({...settings, emailOnPublish: e.target.checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Milestone Notifications</p>
                <p className="text-sm text-neutral-600">Celebrate your achievements and milestones</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={settings.emailOnMilestone}
                onChange={(e) => setSettings({...settings, emailOnMilestone: e.target.checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Digest</p>
                <p className="text-sm text-neutral-600">Weekly summary of your content performance</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={settings.emailWeeklyDigest}
                onChange={(e) => setSettings({...settings, emailWeeklyDigest: e.target.checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Monthly Report</p>
                <p className="text-sm text-neutral-600">Detailed monthly analytics and insights</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={settings.emailMonthlyReport}
                onChange={(e) => setSettings({...settings, emailMonthlyReport: e.target.checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-neutral-600">Receive push notifications in your browser</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">In-App Notifications</p>
                <p className="text-sm text-neutral-600">Show notifications within the app</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={settings.inAppNotifications}
                onChange={(e) => setSettings({...settings, inAppNotifications: e.target.checked})}
              />
            </div>
            <Button
              className="gap-2 bg-emerald-800 hover:bg-emerald-900"
              onClick={handleSaveSettings}
            >
              <Save className="h-4 w-4" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Billing & Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Billing & Subscription</CardTitle>
            </div>
            <CardDescription>Manage your subscription and payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Plan */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-neutral-600">
                  {PLAN_NAMES[profile?.subscriptionPlan as PlanType] || 'Free'} Plan
                </p>
                {profile?.subscriptionEndDate && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {profile?.subscriptionStatus === 'ACTIVE' ? 'Renews' : 'Expires'} on {new Date(profile.subscriptionEndDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge variant={profile?.subscriptionStatus === 'ACTIVE' ? 'default' : 'secondary'}>
                {profile?.subscriptionStatus || 'Free'}
              </Badge>
            </div>

            {/* Upgrade Options */}
            {(!profile?.subscriptionPlan || profile?.subscriptionPlan === 'FREE') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Upgrade Your Plan
                  </h4>
                  <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
                    <button
                      onClick={() => setBillingPeriod('monthly')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        billingPeriod === 'monthly' ? 'bg-white shadow-sm' : 'text-neutral-600'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingPeriod('annual')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        billingPeriod === 'annual' ? 'bg-white shadow-sm' : 'text-neutral-600'
                      }`}
                    >
                      Annual
                    </button>
                  </div>
                </div>

                {billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    Save up to 17% with annual billing
                  </p>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Starter Plan */}
                  <div className="border rounded-lg p-4 hover:border-emerald-800 transition-colors">
                    <h5 className="font-semibold text-sm uppercase text-neutral-500">Starter</h5>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">
                        ${PLAN_PRICING_DISPLAY.STARTER[billingPeriod].usd}
                      </span>
                      <span className="text-sm text-neutral-500">/mo</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Rs. {PLAN_PRICING_DISPLAY.STARTER[billingPeriod].inr.toLocaleString('en-IN')}
                      {billingPeriod === 'annual' ? '/year' : '/mo'}
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-neutral-600">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> 2 platforms
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> Basic AI editor
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> 10 scheduled posts
                      </li>
                    </ul>
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => initiatePayment('STARTER', billingPeriod)}
                      disabled={paymentLoading === 'STARTER'}
                    >
                      {paymentLoading === 'STARTER' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Upgrade'
                      )}
                    </Button>
                  </div>

                  {/* Creator Plan */}
                  <div className="border-2 border-emerald-800 rounded-lg p-4 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-800 text-white text-xs px-2 py-0.5 rounded">
                      Popular
                    </div>
                    <h5 className="font-semibold text-sm uppercase text-neutral-500">Creator</h5>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">
                        ${PLAN_PRICING_DISPLAY.CREATOR[billingPeriod].usd}
                      </span>
                      <span className="text-sm text-neutral-500">/mo</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Rs. {PLAN_PRICING_DISPLAY.CREATOR[billingPeriod].inr.toLocaleString('en-IN')}
                      {billingPeriod === 'annual' ? '/year' : '/mo'}
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-neutral-600">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> Unlimited platforms
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> Advanced AI editor
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> Team collaboration
                      </li>
                    </ul>
                    <Button
                      className="w-full mt-4 bg-emerald-800 hover:bg-emerald-900"
                      onClick={() => initiatePayment('CREATOR', billingPeriod)}
                      disabled={paymentLoading === 'CREATOR'}
                    >
                      {paymentLoading === 'CREATOR' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Upgrade'
                      )}
                    </Button>
                  </div>

                  {/* Professional Plan */}
                  <div className="border rounded-lg p-4 hover:border-emerald-800 transition-colors">
                    <h5 className="font-semibold text-sm uppercase text-neutral-500">Professional</h5>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">
                        ${PLAN_PRICING_DISPLAY.PROFESSIONAL[billingPeriod].usd}
                      </span>
                      <span className="text-sm text-neutral-500">/mo</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Rs. {PLAN_PRICING_DISPLAY.PROFESSIONAL[billingPeriod].inr.toLocaleString('en-IN')}
                      {billingPeriod === 'annual' ? '/year' : '/mo'}
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-neutral-600">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> Everything in Creator
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> White-label options
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-600" /> Dedicated support
                      </li>
                    </ul>
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => initiatePayment('PROFESSIONAL', billingPeriod)}
                      disabled={paymentLoading === 'PROFESSIONAL'}
                    >
                      {paymentLoading === 'PROFESSIONAL' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Upgrade'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* If user has a paid plan */}
            {profile?.subscriptionPlan && profile?.subscriptionPlan !== 'FREE' && (
              <div className="flex gap-2">
                <Button variant="outline">Manage Subscription</Button>
                <Button variant="outline">View Invoices</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div>
                <p className="font-medium">Export Your Data</p>
                <p className="text-sm text-neutral-600">Download all your articles and data</p>
              </div>
              <Button variant="outline">Export</Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-600">Delete Account</p>
                <p className="text-sm text-neutral-600">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
