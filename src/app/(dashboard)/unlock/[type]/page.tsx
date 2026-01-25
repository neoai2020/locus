'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Zap, 
  Infinity, 
  Bot, 
  Package, 
  Check, 
  ArrowRight,
  Sparkles,
  Mail
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAppStore } from '@/store'
import { UPSELL_CONFIGS, UpsellType } from '@/types'

const iconMap = {
  '10x': Zap,
  'infinite': Infinity,
  'automation': Bot,
  'dfy': Package,
}

const gradientMap = {
  '10x': 'from-yellow-500 to-orange-500',
  'infinite': 'from-blue-500 to-cyan-500',
  'automation': 'from-green-500 to-emerald-500',
  'dfy': 'from-purple-500 to-pink-500',
}

export default function UnlockPage() {
  const router = useRouter()
  const params = useParams()
  const type = params.type as UpsellType
  const { unlockUpsell, isUpsellUnlocked } = useAppStore()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const config = UPSELL_CONFIGS[type]
  const Icon = iconMap[type]
  const gradient = gradientMap[type]

  // Check if already unlocked and redirect
  useEffect(() => {
    if (isUpsellUnlocked(type)) {
      router.push(`/upsell/${type}`)
    } else {
      setIsChecking(false)
    }
  }, [type, isUpsellUnlocked, router])

  // Show loading while checking unlock status
  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-burst-border)] animate-pulse" />
      </div>
    )
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    unlockUpsell(type)
    setUnlocked(true)
    setLoading(false)
    
    // Redirect after animation
    setTimeout(() => {
      router.push(`/upsell/${type}`)
    }, 2000)
  }

  if (unlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-6 animate-pulse-glow`}>
            <Check size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {config.name} Unlocked!
          </h1>
          <p className="text-[var(--color-burst-muted)]">
            Redirecting you to your new power...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-6 animate-pulse-glow`}>
          <Icon size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {config.headline}
        </h1>
        <p className="text-lg text-[var(--color-burst-muted)]">
          {config.description}
        </p>
      </div>

      {/* Features */}
      <Card className="mb-8 animate-fade-in stagger-1">
        <h2 className="text-lg font-semibold text-white mb-6">What You Get</h2>
        <div className="space-y-4">
          {config.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center flex-shrink-0`}>
                <Check size={14} className="text-white" />
              </div>
              <span className="text-[var(--color-burst-text)]">{feature}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Unlock Form */}
      <Card className="animate-fade-in stagger-2 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5`} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-[var(--color-burst-purple)]" />
            <h2 className="text-lg font-semibold text-white">Unlock {config.name}</h2>
          </div>

          <form onSubmit={handleUnlock} className="space-y-5">
            <Input
              label="Confirm your email to unlock"
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
              <span>Unlock {config.name}</span>
              <ArrowRight size={18} />
            </Button>

            <p className="text-center text-xs text-[var(--color-burst-muted)]">
              By unlocking, you agree to receive updates about this feature.
              <br />No spam, ever.
            </p>
          </form>
        </div>
      </Card>
    </div>
  )
}
