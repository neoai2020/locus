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
      <Card className="mb-10 animate-fade-in stagger-1 p-0 overflow-hidden rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto md:min-h-[320px] bg-locus-darker overflow-hidden">
            <iframe
              src="https://player.vimeo.com/video/1172911144?badge=0&autopause=0&player_id=0&app_id=58479"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              title="Quick Start Training"
            />
          </div>
          
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Quick Start: Create Your First Viral Article
            </h2>
            <p className="text-locus-muted mb-6">
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
