"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenSquare, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useEffect, useState, Suspense } from "react"
import { toast } from "sonner"

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Verification token is missing')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error || 'Failed to verify email')
        toast.error(data.error || 'Failed to verify email')
        return
      }

      setStatus('success')
      setMessage('Your email has been verified successfully!')
      toast.success('Email verified successfully!')
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <PenSquare className="h-8 w-8" />
            <span className="text-2xl font-bold">Publish Type</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>
              {status === 'loading' && 'Verifying your email...'}
              {status === 'success' && 'Email verified successfully'}
              {status === 'error' && 'Verification failed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {status === 'loading' && (
                <div className="flex justify-center">
                  <Loader2 className="h-12 w-12 text-emerald-800 animate-spin" />
                </div>
              )}

              {status === 'success' && (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {message}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      You can now log in to your account and start using all features.
                    </p>
                  </div>
                  <Link href="/login" className="block mt-6">
                    <Button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white">
                      Continue to Login
                    </Button>
                  </Link>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {message}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      The verification link may have expired or is invalid.
                    </p>
                  </div>
                  <div className="space-y-2 mt-6">
                    <Link href="/signup" className="block">
                      <Button variant="outline" className="w-full">
                        Sign up again
                      </Button>
                    </Link>
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full">
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  )
}
