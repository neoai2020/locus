'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  PenTool, 
  FileText, 
  Send, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Play,
  GraduationCap,
  DollarSign,
  Users,
  Star,
  Headphones,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { createClient } from '@/lib/supabase/client'

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

export default function DashboardPage() {
  const router = useRouter()
  const { articles } = useAppStore()
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

  // Member earnings carousel with slide animation
  const [activeMemberIndex, setActiveMemberIndex] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('up')
  const [communityTotal, setCommunityTotal] = useState(847000)
  const [activeEarners, setActiveEarners] = useState(1847)
  const [avgPerMember, setAvgPerMember] = useState(459)

  useEffect(() => {
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 3000) + 2000
      return setTimeout(() => {
        setSlideDirection(Math.random() > 0.5 ? 'up' : 'down')
        setIsSliding(true)

        setTimeout(() => {
          setActiveMemberIndex(prev => {
            let next: number
            do { next = Math.floor(Math.random() * earningsMembers.length) } while (next === prev)
            return next
          })
          setCommunityTotal(prev => prev + Math.floor(Math.random() * 800) + 200)
          setActiveEarners(prev => prev + (Math.random() > 0.6 ? 1 : 0))
          setAvgPerMember(prev => prev + Math.floor(Math.random() * 5) - 2)
          setIsSliding(false)
        }, 300)

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
      {/* 1. Welcome Section */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome back, <span className="gradient-text">{userName}</span>
        </h1>
        <p className="text-locus-muted text-lg">
          Ready to dominate authority platforms today?
        </p>
      </div>

      {/* 2. Training Section */}
      <Card className="mb-10 animate-fade-in stagger-1 p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto bg-linear-to-br from-locus-darker to-locus-dark">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-r from-locus-teal to-locus-cyan flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform group">
                  <Play size={32} className="text-white ml-1 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-sm text-locus-muted">Watch: 3 min</p>
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <Badge variant="purple">
                <GraduationCap size={12} className="mr-1" />
                Training
              </Badge>
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-locus-dark via-transparent to-transparent opacity-50" />
          </div>
          
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

      {/* 3. Member Earnings Dashboard — with slide animations */}
      <Card className="mb-10 animate-fade-in stagger-2 border border-amber-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>
          </div>

          {/* Featured Member — animated slide on change */}
          <div className="bg-locus-darker/60 rounded-xl p-5 mb-6 border border-white/5 overflow-hidden">
            <div
              className={`flex items-center gap-4 transition-all duration-300 ${
                isSliding
                  ? slideDirection === 'up'
                    ? 'opacity-0 -translate-y-4'
                    : 'opacity-0 translate-y-4'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              <div className={`w-14 h-14 rounded-full ${activeMember.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                {activeMember.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-white text-lg">{activeMember.name}</span>
                  <Star className="text-amber-400 fill-amber-400" size={16} />
                  <Badge variant="success" className="text-[10px] uppercase tracking-wider">Verified Member</Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-amber-400 tabular-nums">
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

          {/* Community Stats — values tick up live */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-locus-darker/60 rounded-xl p-4 border border-amber-500/20 text-center">
              <DollarSign className="text-amber-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white tabular-nums transition-all duration-700">
                ${(communityTotal / 1000).toFixed(0)}K+
              </p>
              <p className="text-locus-muted text-xs">Community Total</p>
            </div>
            <div className="bg-locus-darker/60 rounded-xl p-4 border border-amber-500/20 text-center">
              <Users className="text-amber-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white tabular-nums transition-all duration-700">
                {activeEarners.toLocaleString()}
              </p>
              <p className="text-locus-muted text-xs">Active Earners</p>
            </div>
            <div className="bg-locus-darker/60 rounded-xl p-4 border border-amber-500/20 text-center">
              <TrendingUp className="text-amber-400 mx-auto mb-1" size={20} />
              <p className="text-2xl font-bold text-white tabular-nums transition-all duration-700">
                ${avgPerMember}
              </p>
              <p className="text-locus-muted text-xs">Avg/Member</p>
            </div>
          </div>

          <p className="text-[11px] text-locus-muted/60 leading-relaxed">
            Results shown are from select members and not typical. Your results will vary. No earnings are guaranteed. Past performance does not indicate future results.
          </p>
        </div>
      </Card>

      {/* 4. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="animate-fade-in stagger-3">
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

        <Card className="animate-fade-in stagger-4">
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

        <Card className="animate-fade-in stagger-5">
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

      {/* 5. Quick Actions */}
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
                className="animate-fade-in cursor-pointer group"
                style={{ animationDelay: `${(index + 6) * 0.1}s` }}
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

      {/* 6. Support Bar */}
      <Card className="animate-fade-in border border-[rgba(20,184,166,0.2)] bg-[rgba(20,184,166,0.03)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(20,184,166,0.15)] border border-[rgba(20,184,166,0.3)] flex items-center justify-center shrink-0">
              <Headphones className="text-locus-teal" size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Need Help?</h3>
              <p className="text-sm text-locus-muted">Our support team is here to assist you 24/7</p>
            </div>
          </div>
          <Link href="/support">
            <Button size="sm">
              Contact Support
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
