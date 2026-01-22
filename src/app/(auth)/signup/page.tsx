'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

const features = [
  'Generate authority articles in seconds',
  'Publish on LinkedIn, Medium & more',
  'No coding or SEO knowledge required',
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
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
            Start Building Authority
          </h1>
          <p className="text-[var(--color-burst-muted)]">
            Create your free account and launch in minutes
          </p>
        </div>

        {/* Feature list */}
        <div className="mb-8 space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 text-sm text-[var(--color-burst-text)]">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
              {feature}
            </div>
          ))}
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[var(--color-burst-error)] text-sm">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User size={18} />}
            required
          />

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
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            required
          />

          <Button 
            type="submit" 
            loading={loading} 
            className="w-full"
            size="lg"
          >
            <span>Create Account</span>
            <ArrowRight size={18} />
          </Button>
        </form>

        <p className="text-center mt-6 text-[var(--color-burst-muted)] text-sm">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-[var(--color-burst-purple)] hover:text-[var(--color-burst-violet)] transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </Card>

      <p className="text-center mt-8 text-xs text-[var(--color-burst-muted)]">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
