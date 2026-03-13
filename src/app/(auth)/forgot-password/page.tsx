'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="animate-fade-in max-w-md mx-auto">
      <div className="flex justify-center mb-8">
        <Logo size="lg" />
      </div>

      <Card className="p-8">
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] flex items-center justify-center">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Check Your Email
            </h1>
            <p className="text-[var(--color-locus-muted)] mb-6">
              We&apos;ve sent a password reset link to <span className="text-white">{email}</span>
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                <ArrowLeft size={18} />
                <span>Back to Login</span>
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Reset Password
              </h1>
              <p className="text-[var(--color-locus-muted)]">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[var(--color-locus-error)] text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />

              <Button 
                type="submit" 
                loading={loading} 
                className="w-full"
                size="lg"
              >
                <span>Send Reset Link</span>
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
          </>
        )}
      </Card>
    </div>
  )
}
