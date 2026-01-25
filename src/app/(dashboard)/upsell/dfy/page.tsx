'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  Copy, 
  Check, 
  Edit3,
  Download,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Code,
  TrendingUp,
  Heart,
  Rocket,
  Users
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { Article } from '@/types'

const contentPacks = [
  {
    id: 'startup-founder',
    name: 'Startup Founder',
    description: 'Leadership, fundraising, and growth content',
    icon: Rocket,
    articleCount: 10,
    gradient: 'from-purple-500 to-pink-500',
    articles: [
      { title: '5 Lessons from Raising Our First $1M', preview: 'When I started my fundraising journey...' },
      { title: 'Why I Fire Fast and Hire Slow', preview: 'The hardest lesson I learned as a founder...' },
      { title: 'The Real Cost of Technical Debt', preview: 'We thought we were moving fast...' },
    ]
  },
  {
    id: 'marketing-expert',
    name: 'Marketing Expert',
    description: 'Growth tactics, branding, and strategy',
    icon: TrendingUp,
    articleCount: 10,
    gradient: 'from-blue-500 to-cyan-500',
    articles: [
      { title: 'The $0 Marketing Strategy That Got Us 10K Users', preview: 'We had no budget. Zero. Nada...' },
      { title: 'Why Your Brand Voice Is Killing Conversions', preview: 'I audited 50 landing pages last month...' },
      { title: 'The Death of Traditional Funnels', preview: 'The funnel is dead. Long live the...' },
    ]
  },
  {
    id: 'tech-leader',
    name: 'Tech Leader',
    description: 'Engineering management and technical insights',
    icon: Code,
    articleCount: 10,
    gradient: 'from-green-500 to-emerald-500',
    articles: [
      { title: 'How I Scaled My Team from 5 to 50 Engineers', preview: 'Scaling isn\'t just about hiring...' },
      { title: 'The Architecture Decision That Saved Us', preview: 'We were about to make a huge mistake...' },
      { title: 'Why Senior Engineers Should Code Less', preview: 'This might be controversial, but...' },
    ]
  },
  {
    id: 'career-coach',
    name: 'Career Coach',
    description: 'Professional development and career growth',
    icon: Briefcase,
    articleCount: 10,
    gradient: 'from-yellow-500 to-orange-500',
    articles: [
      { title: 'The Promotion You Deserve Is Being Blocked', preview: 'Let me tell you about Sarah...' },
      { title: 'Why Your Resume Isn\'t Getting Callbacks', preview: 'I\'ve reviewed 1000+ resumes...' },
      { title: 'The Salary Negotiation Script That Works', preview: 'I was terrified to ask for more...' },
    ]
  },
  {
    id: 'wellness-coach',
    name: 'Wellness Coach',
    description: 'Health, productivity, and work-life balance',
    icon: Heart,
    articleCount: 10,
    gradient: 'from-red-500 to-pink-500',
    articles: [
      { title: 'The Morning Routine That Changed Everything', preview: 'I was burning out. Fast...' },
      { title: 'Why High Performers Take More Breaks', preview: 'Hustle culture lied to us...' },
      { title: 'The Science of Sustainable Productivity', preview: 'Forget 80-hour weeks...' },
    ]
  },
  {
    id: 'community-builder',
    name: 'Community Builder',
    description: 'Engagement, events, and community growth',
    icon: Users,
    articleCount: 10,
    gradient: 'from-indigo-500 to-purple-500',
    articles: [
      { title: 'How I Built a 10K Member Community', preview: 'It started with just 5 people...' },
      { title: 'The Event Format That Gets 95% Attendance', preview: 'Most virtual events fail because...' },
      { title: 'Why Your Community Needs Rules', preview: 'Freedom without structure is chaos...' },
    ]
  },
]

export default function DFYPage() {
  const router = useRouter()
  const { isUpsellUnlocked, addArticle, setCurrentArticle } = useAppStore()
  const [expandedPack, setExpandedPack] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  // Check if unlocked and redirect if not
  useEffect(() => {
    if (!isUpsellUnlocked('dfy')) {
      router.push('/unlock/dfy')
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

  const handleUseArticle = (packId: string, articleIndex: number) => {
    const pack = contentPacks.find(p => p.id === packId)
    if (pack) {
      const articleData = pack.articles[articleIndex]
      const article: Article = {
        id: crypto.randomUUID(),
        user_id: '',
        title: articleData.title,
        content: `${articleData.preview}\n\n[Full article content would be loaded here]\n\nThis is a premium DFY article from the ${pack.name} pack. Edit it to match your voice and experience.`,
        platform: 'linkedin',
        tone: 'authoritative',
        length: 'medium',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      addArticle(article)
      setCurrentArticle(article)
      router.push('/create')
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Package size={20} className="text-white" />
          </div>
          <Badge variant="purple">Done-For-You</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Pre-Written Content Packs
        </h1>
        <p className="text-[var(--color-burst-muted)]">
          Professional articles ready to customize and publish. Pick a niche that matches your brand.
        </p>
      </div>

      {/* Content Packs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contentPacks.map((pack, index) => (
          <Card 
            key={pack.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${pack.gradient} flex items-center justify-center`}>
                  <pack.icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{pack.name}</h3>
                  <p className="text-sm text-[var(--color-burst-muted)]">{pack.description}</p>
                </div>
              </div>
              <Badge variant="cyan">{pack.articleCount} articles</Badge>
            </div>

            {/* Preview Articles */}
            <div className="space-y-2 mb-4">
              {pack.articles.slice(0, expandedPack === pack.id ? 3 : 2).map((article, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--color-burst-border)] group hover:border-[var(--color-burst-purple)] transition-all cursor-pointer"
                  onClick={() => handleUseArticle(pack.id, i)}
                >
                  <h4 className="text-sm font-medium text-white mb-1 group-hover:text-[var(--color-burst-purple)] transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-[var(--color-burst-muted)] line-clamp-1">
                    {article.preview}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setExpandedPack(expandedPack === pack.id ? null : pack.id)}
                className="text-sm text-[var(--color-burst-muted)] hover:text-[var(--color-burst-purple)] transition-colors flex items-center gap-1"
              >
                {expandedPack === pack.id ? (
                  <>Show less <ChevronUp size={14} /></>
                ) : (
                  <>Show more <ChevronDown size={14} /></>
                )}
              </button>
              
              <Button variant="secondary" size="sm" onClick={() => handleUseArticle(pack.id, 0)}>
                <Edit3 size={14} />
                <span>Use Pack</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <h3 className="font-semibold text-white mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 text-white font-bold">
              1
            </div>
            <h4 className="font-medium text-white mb-1">Choose a Pack</h4>
            <p className="text-sm text-[var(--color-burst-muted)]">
              Select a content pack that matches your niche
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 text-white font-bold">
              2
            </div>
            <h4 className="font-medium text-white mb-1">Customize</h4>
            <p className="text-sm text-[var(--color-burst-muted)]">
              Edit the content to match your voice and experience
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 text-white font-bold">
              3
            </div>
            <h4 className="font-medium text-white mb-1">Publish</h4>
            <p className="text-sm text-[var(--color-burst-muted)]">
              Post to your favorite platforms and build authority
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
