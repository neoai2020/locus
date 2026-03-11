'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-8">
        <Logo size="lg" />
      </div>

      <Card className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome Back
          </h1>
          <p className="text-locus-muted">
            Sign in to continue building authority
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-locus-error text-sm">
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

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
          />

          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm text-locus-teal hover:text-locus-emerald transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            loading={loading} 
            className="w-full"
            size="lg"
          >
            <span>Sign In</span>
            <ArrowRight size={18} />
          </Button>
        </form>

        <p className="text-center mt-6 text-locus-muted text-sm">
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup-pro" 
            className="text-locus-teal hover:text-locus-emerald transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      </Card>

      <p className="text-center mt-8 text-xs text-locus-muted">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
