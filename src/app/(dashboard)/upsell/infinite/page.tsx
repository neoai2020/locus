'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Infinity, 
  Zap, 
  FileText, 
  Clock, 
  TrendingUp,
  Check,
  ArrowRight
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'

const benefits = [
  {
    icon: FileText,
    title: 'Unlimited Articles',
    description: 'Generate as many articles as you need, no daily or monthly caps',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Clock,
    title: 'No Throttling',
    description: 'Full-speed generation without artificial delays',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: TrendingUp,
    title: 'Priority Processing',
    description: 'Your requests are processed before free tier users',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Instant Access',
    description: 'All premium features available immediately',
    gradient: 'from-yellow-500 to-orange-500'
  },
]

export default function InfinitePage() {
  const router = useRouter()
  const { isUpsellUnlocked, articles } = useAppStore()
  const [isChecking, setIsChecking] = useState(true)

  // Check if unlocked and redirect if not
  useEffect(() => {
    if (!isUpsellUnlocked('infinite')) {
      router.push('/unlock/infinite')
    } else {
      setIsChecking(false)
    }
  }, [isUpsellUnlocked, router])

  // Show loading while checking unlock status
  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-burst-border)] animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <Infinity size={20} className="text-white" />
          </div>
          <Badge variant="cyan">Infinite Mode Active</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Unlimited Everything
        </h1>
        <p className="text-[var(--color-burst-muted)]">
          You now have unlimited access to all Burst features
        </p>
      </div>

      {/* Status Card */}
      <Card className="mb-8 animate-fade-in stagger-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Your Usage</h2>
            <Badge variant="success">
              <Infinity size={12} className="mr-1" />
              Unlimited
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-[rgba(255,255,255,0.03)]">
              <p className="text-3xl font-bold text-white mb-1">{articles.length}</p>
              <p className="text-sm text-[var(--color-burst-muted)]">Articles Generated</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[rgba(255,255,255,0.03)]">
              <p className="text-3xl font-bold gradient-text mb-1">∞</p>
              <p className="text-sm text-[var(--color-burst-muted)]">Remaining</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[rgba(255,255,255,0.03)]">
              <p className="text-3xl font-bold text-white mb-1">0ms</p>
              <p className="text-sm text-[var(--color-burst-muted)]">Throttle Delay</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {benefits.map((benefit, index) => (
          <Card 
            key={benefit.title}
            className="animate-fade-in"
            style={{ animationDelay: `${(index + 2) * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center flex-shrink-0`}>
                <benefit.icon size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{benefit.title}</h3>
                  <Check size={14} className="text-[var(--color-burst-success)]" />
                </div>
                <p className="text-sm text-[var(--color-burst-muted)]">
                  {benefit.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="animate-fade-in text-center" style={{ animationDelay: '0.6s' }}>
        <h3 className="text-xl font-semibold text-white mb-2">Ready to Create?</h3>
        <p className="text-[var(--color-burst-muted)] mb-6">
          Start generating unlimited content right now
        </p>
        <Button onClick={() => router.push('/create')} size="lg">
          <span>Create Article</span>
          <ArrowRight size={18} />
        </Button>
      </Card>
    </div>
  )
}
