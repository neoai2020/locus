'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [ready, setReady] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const urlParams = new URLSearchParams(window.location.search)

      const urlError = urlParams.get('error')
      if (urlError) {
        setError(urlError)
        setChecking(false)
        return
      }

      const tokenHash = urlParams.get('token_hash')
      const type = urlParams.get('type')
      if (tokenHash && type === 'recovery') {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          })
          if (verifyError) {
            setError(verifyError.message)
          } else {
            setReady(true)
          }
        } catch {
          setError('Failed to verify reset link. Please request a new one.')
        }
        setChecking(false)
        return
      }

      const code = urlParams.get('code')
      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            setError(exchangeError.message)
          } else {
            setReady(true)
          }
        } catch {
          setError('Failed to verify reset code. Please request a new link.')
        }
        setChecking(false)
        return
      }

      const hash = window.location.hash.substring(1)
      const hashParams = new URLSearchParams(hash)
      const hashError = hashParams.get('error_description')
      if (hashError) {
        setError(hashError.replace(/\+/g, ' '))
        setChecking(false)
        return
      }
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      if (accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (sessionError) {
            setError(sessionError.message)
          } else {
            setReady(true)
          }
        } catch {
          setError('Failed to verify reset link. Please request a new one.')
        }
        setChecking(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
      } else {
        setError('No active reset session. Please request a new password reset link.')
      }
      setChecking(false)
    }

    init()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="animate-fade-in max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <Card className="p-8">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-[var(--color-locus-teal)] mx-auto mb-4" />
            <p className="text-[var(--color-locus-muted)]">Verifying your reset link...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="animate-fade-in max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <Card className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] flex items-center justify-center">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Password Updated!
            </h1>
            <p className="text-[var(--color-locus-muted)] mb-6">
              Your password has been changed successfully. You can now sign in with your new password.
            </p>
            <Link href="/login">
              <Button variant="primary" className="w-full" size="lg">
                <span>Back to Login</span>
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (!ready && error) {
    return (
      <div className="animate-fade-in max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <Card className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
              <AlertTriangle size={32} className="text-[var(--color-locus-error)]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Reset Failed
            </h1>
            <p className="text-[var(--color-locus-muted)] mb-6">{error}</p>
            <div className="flex gap-3">
              <Link href="/forgot-password" className="flex-1">
                <Button variant="primary" className="w-full">
                  Request New Link
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button variant="secondary" className="w-full">
                  <ArrowLeft size={18} />
                  <span>Login</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-md mx-auto">
      <div className="flex justify-center mb-8">
        <Logo size="lg" />
      </div>

      <Card className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Set New Password
          </h1>
          <p className="text-[var(--color-locus-muted)]">
            Choose a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[var(--color-locus-error)] text-sm">
              {error}
            </div>
          )}

          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
          />

          <Input
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            icon={<Lock size={18} />}
            rightElement={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="focus:outline-none">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            <span>Update Password</span>
            <ArrowRight size={18} />
          </Button>
        </form>

        <p className="text-center mt-6 text-[var(--color-locus-muted)] text-sm">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-[var(--color-locus-teal)] hover:text-[var(--color-locus-emerald)] transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="animate-fade-in max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <Card className="p-8">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-[var(--color-locus-teal)] mx-auto mb-4" />
            <p className="text-[var(--color-locus-muted)]">Loading...</p>
          </div>
        </Card>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
