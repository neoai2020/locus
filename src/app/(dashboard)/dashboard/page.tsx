'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  PenTool, 
  FileText, 
  Send, 
  TrendingUp, 
  Zap, 
  Infinity, 
  Bot, 
  Package,
  ArrowRight,
  Sparkles,
  Play,
  GraduationCap,
  DollarSign,
  Users,
  Star
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { createClient } from '@/lib/supabase/client'
import { UPSELL_CONFIGS, UpsellType } from '@/types'

const earningsMembers = [
  { name: 'Ashley D.', initial: 'A', color: 'bg-rose-500', amount: 2150, timeframe: 'past 3 weeks', badge: 'consistent daily posting' },
  { name: 'Marcus T.', initial: 'M', color: 'bg-blue-500', amount: 1875, timeframe: 'past month', badge: '3 articles/week' },
  { name: 'Jordan K.', initial: 'J', color: 'bg-emerald-500', amount: 980, timeframe: 'past 2 weeks', badge: 'daily content creator' },
  { name: 'Priya S.', initial: 'P', color: 'bg-violet-500', amount: 2340, timeframe: 'past month', badge: 'power user' },
  { name: 'Tyler R.', initial: 'T', color: 'bg-cyan-500', amount: 425, timeframe: 'past 2 weeks', badge: 'weekly publisher' },
  { name: 'Samantha L.', initial: 'S', color: 'bg-pink-500', amount: 1590, timeframe: 'past 3 weeks', badge: 'consistent daily posting' },
  { name: 'Derek W.', initial: 'D', color: 'bg-orange-500', amount: 760, timeframe: 'past 2 weeks', badge: '3 articles/week' },
  { name: 'Nina C.', initial: 'N', color: 'bg-teal-500', amount: 2480, timeframe: 'past month', badge: 'power user' },
  { name: 'Ethan B.', initial: 'E', color: 'bg-indigo-500', amount: 310, timeframe: 'past 2 weeks', badge: 'weekly publisher' },
  { name: 'Rachel M.', initial: 'R', color: 'bg-amber-500', amount: 1220, timeframe: 'past 3 weeks', badge: 'daily content creator' },
  { name: 'Chris F.', initial: 'C', color: 'bg-lime-500', amount: 1950, timeframe: 'past month', badge: 'consistent daily posting' },
  { name: 'Olivia H.', initial: 'O', color: 'bg-fuchsia-500', amount: 540, timeframe: 'past 2 weeks', badge: '3 articles/week' },
  { name: 'Brandon J.', initial: 'B', color: 'bg-sky-500', amount: 1680, timeframe: 'past 3 weeks', badge: 'power user' },
  { name: 'Kayla P.', initial: 'K', color: 'bg-red-500', amount: 890, timeframe: 'past 2 weeks', badge: 'daily content creator' },
  { name: 'Liam G.', initial: 'L', color: 'bg-green-500', amount: 150, timeframe: 'past 2 weeks', badge: 'weekly publisher' },
]

const quickActions = [
  { 
    href: '/create', 
    icon: PenTool, 
    label: 'Create Article', 
    description: 'Generate a new authority article',
    gradient: 'from-locus-teal to-locus-indigo'
  },
  { 
    href: '/saved', 
    icon: FileText, 
    label: 'My Portfolio', 
    description: 'View articles and affiliate links',
    gradient: 'from-locus-cyan to-locus-blue'
  },
  { 
    href: '/publish', 
    icon: Send, 
    label: 'Publish', 
    description: 'Deploy to authority platforms',
    gradient: 'from-[var(--color-locus-amber)] to-[var(--color-locus-teal)]'
  },
]

const upsellPreviews = [
  { type: '10x' as UpsellType, icon: Zap, gradient: 'from-yellow-500 to-orange-500' },
  { type: 'infinite' as UpsellType, icon: Infinity, gradient: 'from-blue-500 to-cyan-500' },
  { type: 'automation' as UpsellType, icon: Bot, gradient: 'from-green-500 to-emerald-500' },
  { type: 'dfy' as UpsellType, icon: Package, gradient: 'from-purple-500 to-pink-500' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { articles, unlockedUpsells } = useAppStore()
  const [userName, setUserName] = useState('there')

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(' ')[0])
      }
    }
    
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles')
        if (response.ok) {
          const data = await response.json()
          useAppStore.getState().setArticles(data.articles || [])
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      }
    }

    fetchUser()
    fetchArticles()
  }, [])

  const [activeMemberIndex, setActiveMemberIndex] = useState(0)

  useEffect(() => {
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 5000) + 3000
      return setTimeout(() => {
        setActiveMemberIndex(prev => {
          let next: number
          do { next = Math.floor(Math.random() * earningsMembers.length) } while (next === prev)
          return next
        })
        timerId = scheduleNext()
      }, delay)
    }
    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [])

  const activeMember = earningsMembers[activeMemberIndex]

  const stats = {
    articlesGenerated: articles.length,
    savedDrafts: articles.filter(a => a.status === 'draft').length,
    publishedArticles: articles.filter(a => a.status === 'published').length,
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome back, <span className="gradient-text">{userName}</span>
        </h1>
        <p className="text-locus-muted text-lg">
          Ready to dominate authority platforms today?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="animate-fade-in stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-locus-muted text-sm mb-1">Articles Generated</p>
              <p className="text-3xl font-bold text-white">{stats.articlesGenerated}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-locus-teal to-locus-indigo flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in stagger-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-locus-muted text-sm mb-1">Saved Drafts</p>
              <p className="text-3xl font-bold text-white">{stats.savedDrafts}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-locus-cyan to-locus-blue flex items-center justify-center">
              <FileText className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-locus-muted text-sm mb-1">Published</p>
              <p className="text-3xl font-bold text-white">{stats.publishedArticles}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-locus-success to-locus-cyan flex items-center justify-center">
              <Send className="text-white" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Member Earnings Dashboard */}
      <Card className="mb-10 animate-fade-in border border-amber-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <DollarSign className="text-amber-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Member Earnings Dashboard
              </h2>
              <p className="text-locus-muted text-sm">Real results from Locus members</p>
            </div>
          </div>

          {/* Featured Member Spotlight */}
          <div className="bg-locus-darker/60 rounded-xl p-5 mb-6 border border-white/5 transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full ${activeMember.color} flex items-center justify-center text-white text-xl font-bold shrink-0 transition-all duration-500`}>
                {activeMember.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-white text-lg">{activeMember.name}</span>
                  <Star className="text-amber-400 fill-amber-400" size={16} />
                  <Badge variant="success" className="text-[10px] uppercase tracking-wider">Verified Member</Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-amber-400 tabular-nums transition-all duration-500">
                    ${activeMember.amount.toLocaleString()}
                  </span>
                  <span className="text-locus-muted text-sm">Earned in {activeMember.timeframe}</span>
                </div>
                <Badge variant="default" className="text-xs">
                  {activeMember.badge}
                </Badge>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-locus-darker/60 rounded-xl p-4 border border-amber-500/20 text-center">
              <DollarSign className="text-amber-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white">$847K+</p>
              <p className="text-locus-muted text-xs">Community Total</p>
            </div>
            <div className="bg-locus-darker/60 rounded-xl p-4 border border-amber-500/20 text-center">
              <Users className="text-amber-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white">1,847</p>
              <p className="text-locus-muted text-xs">Active Earners</p>
            </div>
            <div className="bg-locus-darker/60 rounded-xl p-4 border border-amber-500/20 text-center">
              <TrendingUp className="text-amber-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white">$459</p>
              <p className="text-locus-muted text-xs">Avg/Member</p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-locus-muted/60 leading-relaxed">
            Results shown are from select members and not typical. Your results will vary. No earnings are guaranteed. Past performance does not indicate future results.
          </p>
        </div>
      </Card>

      {/* Primary CTA */}
      <Card className="mb-10 animate-fade-in stagger-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-[rgba(20,184,166,0.1)] to-[rgba(6,182,212,0.1)]" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-locus-teal to-locus-cyan flex items-center justify-center animate-pulse-glow">
              <Sparkles className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                Create Your Next Authority Article
              </h2>
              <p className="text-locus-muted">
                Generate publication-ready content in seconds with AI
              </p>
            </div>
          </div>
          <div 
            className="cursor-pointer"
            onClick={() => {
              useAppStore.getState().setCurrentArticle(null)
              router.push('/create')
            }}
          >
            <Button size="lg" className="whitespace-nowrap">
              <PenTool size={18} />
              <span>Start Creating</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Video Training Card */}
      <Card className="mb-10 animate-fade-in stagger-5 p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Video Thumbnail */}
          <div className="relative aspect-video md:aspect-auto bg-linear-to-br from-locus-darker to-locus-dark">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-r from-locus-teal to-locus-cyan flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform group">
                  <Play size={32} className="text-white ml-1 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-sm text-locus-muted">Watch: 3 min</p>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4">
              <Badge variant="purple">
                <GraduationCap size={12} className="mr-1" />
                Training
              </Badge>
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-locus-dark via-transparent to-transparent opacity-50" />
          </div>
          
          {/* Content */}
          <div className="p-6 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Quick Start: Create Your First Viral Article
            </h2>
            <p className="text-locus-muted mb-4">
              Learn how to generate authority-building content in under 3 minutes. 
              This video walks you through the entire process from topic to publish.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/training">
                <Button size="sm">
                  <Play size={16} />
                  <span>Watch Now</span>
                </Button>
              </Link>
              <Link href="/training">
                <Button variant="ghost" size="sm">
                  <span>View All Training</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <div 
              key={action.href} 
              onClick={() => {
                if (action.href === '/create') {
                  useAppStore.getState().setCurrentArticle(null)
                }
                router.push(action.href)
              }}
            >
              <Card 
                className={`animate-fade-in cursor-pointer group`}
                style={{ animationDelay: `${(index + 5) * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-r ${action.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <action.icon className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1 group-hover:text-locus-teal transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-sm text-locus-muted">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="text-locus-muted group-hover:text-locus-teal group-hover:translate-x-1 transition-all shrink-0" size={18} />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Upsell Teasers */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Unlock Premium Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upsellPreviews.map((upsell, index) => {
            const config = UPSELL_CONFIGS[upsell.type]
            const isUnlocked = unlockedUpsells.includes(upsell.type)
            
            return (
              <Link 
                key={upsell.type} 
                href={isUnlocked ? `/upsell/${upsell.type}` : `/unlock/${upsell.type}`}
              >
                <Card 
                  className={`animate-fade-in cursor-pointer group relative overflow-hidden h-full`}
                  style={{ animationDelay: `${(index + 8) * 0.1}s` }}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-locus-dark bg-opacity-60 backdrop-blur-sm z-10 flex items-center justify-center">
                      <Badge variant="purple">Locked</Badge>
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-r ${upsell.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <upsell.icon className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{config.name}</h3>
                  <p className="text-sm text-locus-muted">{config.description}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
