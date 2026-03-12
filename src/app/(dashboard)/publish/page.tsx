'use client'

import { useState, useEffect } from 'react'
import {
  Send,
  Copy,
  Check,
  ExternalLink,
  Linkedin,
  FileText,
  Hash,
  MessageSquare,
  AlertTriangle,
  Loader2,
  Wand2,
  ChevronRight,
  BookOpen,
  TrendingUp,
  ArrowLeft,
  Twitter,
  Sparkles,
  Download,
  Image as ImageIcon,
  Clock,
  Search,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { PLATFORM_INFO, Platform, Article } from '@/types'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Linkedin,
  FileText,
  MessageSquare,
  Hash,
  Twitter,
}

const platformCards: {
  id: Platform
  name: string
  gradient: string
  tagline: string
}[] = [
  { id: 'linkedin', name: 'LinkedIn', gradient: 'from-blue-600 to-blue-700', tagline: 'B2B, thought leadership & professional authority' },
  { id: 'quora', name: 'Quora', gradient: 'from-red-600 to-red-700', tagline: 'Answer-based SEO & evergreen Google traffic' },
  { id: 'medium', name: 'Medium', gradient: 'from-gray-700 to-gray-800', tagline: 'Long-form content, tutorials & publication reach' },
  { id: 'reddit', name: 'Reddit', gradient: 'from-orange-500 to-orange-600', tagline: 'Community-driven traffic & niche subreddit reach' },
  { id: 'twitter', name: 'X (Twitter)', gradient: 'from-sky-500 to-sky-600', tagline: 'Viral threads, hot takes & real-time engagement' },
]

interface SuggestedTag {
  tag: string
  reason: string
}

export default function PublishPage() {
  const { currentArticle, setCurrentArticle, updateArticle, articles } = useAppStore()

  // If an article was pre-selected (e.g. from Save & Publish), start at step 2
  const [step, setStep] = useState<1 | 2 | 3>(currentArticle ? 2 : 1)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [activeTab, setActiveTab] = useState<'instructions' | 'seo' | 'tags'>('instructions')
  const [suggestedTags, setSuggestedTags] = useState<SuggestedTag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [copiedTag, setCopiedTag] = useState<string | null>(null)
  const [isLoadingArticles, setIsLoadingArticles] = useState(false)

  useEffect(() => {
    if (articles.length === 0) {
      setIsLoadingArticles(true)
      fetch('/api/articles')
        .then(r => r.ok ? r.json() : { articles: [] })
        .then(data => {
          useAppStore.getState().setArticles(data.articles || [])
        })
        .catch(() => {})
        .finally(() => setIsLoadingArticles(false))
    }
  }, [articles.length])

  const filteredArticles = articles.filter(a =>
    !searchQuery.trim() ||
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectArticle = (article: Article) => {
    setCurrentArticle(article)
    setStep(2)
  }

  const handleSelectPlatform = (id: Platform) => {
    setSelectedPlatform(id)
    setStep(3)
    setActiveTab('instructions')
    setSuggestedTags([])
  }

  const handleCopy = async () => {
    if (currentArticle) {
      await navigator.clipboard.writeText(currentArticle.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyTag = async (tag: string) => {
    await navigator.clipboard.writeText(tag)
    setCopiedTag(tag)
    setTimeout(() => setCopiedTag(null), 1500)
  }

  const handleCopyAllTags = async () => {
    const allTags = suggestedTags.map(t => t.tag).join(' ')
    await navigator.clipboard.writeText(allTags)
    setCopiedTag('__all__')
    setTimeout(() => setCopiedTag(null), 1500)
  }

  const handleMarkPublished = () => {
    if (currentArticle) {
      updateArticle(currentArticle.id, { status: 'published' })
    }
  }

  const handleDownloadImages = async () => {
    if (!currentArticle?.images || currentArticle.images.length === 0) return
    for (const img of currentArticle.images) {
      try {
        const response = await fetch(img.url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${currentArticle.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40)}_${img.section || img.position}.${blob.type.split('/')[1] || 'png'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Failed to download image:', err)
      }
    }
  }

  const handleSuggestTags = async () => {
    if (!selectedPlatform || !currentArticle) return
    setIsLoadingTags(true)
    setSuggestedTags([])
    try {
      const res = await fetch('/api/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          articleTitle: currentArticle.title,
          articleContent: currentArticle.content,
          niche: currentArticle.niche || '',
        }),
      })
      const data = await res.json()
      if (data.tags && data.tags.length > 0) setSuggestedTags(data.tags)
    } catch (err) {
      console.error('Failed to suggest tags:', err)
    } finally {
      setIsLoadingTags(false)
    }
  }

  const platformInfo = selectedPlatform ? PLATFORM_INFO[selectedPlatform] : null
  const PlatformIcon = selectedPlatform ? iconMap[PLATFORM_INFO[selectedPlatform].icon] : null
  const selectedCard = platformCards.find(p => p.id === selectedPlatform)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Publish & Distribute
        </h1>
        <p className="text-locus-muted">
          Select your article, choose a platform, and follow the guide to publish
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in stagger-1">
        {[
          { num: 1, label: 'Select Article' },
          { num: 2, label: 'Choose Platform' },
          { num: 3, label: 'Publish' },
        ].map((s, i) => {
          const isActive = step === s.num
          const isDone = step > s.num
          return (
            <div key={s.num} className="flex items-center gap-3 flex-1">
              <button
                onClick={() => {
                  if (s.num === 1) { setStep(1); setSelectedPlatform(null) }
                  else if (s.num === 2 && currentArticle) { setStep(2); setSelectedPlatform(null) }
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full ${
                  isActive
                    ? 'bg-[rgba(20,184,166,0.15)] text-locus-teal border border-[rgba(20,184,166,0.3)]'
                    : isDone
                      ? 'bg-[rgba(20,184,166,0.08)] text-locus-teal/70 border border-transparent cursor-pointer'
                      : 'bg-[rgba(255,255,255,0.03)] text-locus-muted border border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone
                    ? 'bg-locus-teal text-white'
                    : isActive
                      ? 'bg-locus-teal/20 text-locus-teal'
                      : 'bg-[rgba(255,255,255,0.08)] text-locus-muted'
                }`}>
                  {isDone ? <Check size={12} /> : s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 2 && <ChevronRight size={16} className="text-locus-muted/40 shrink-0" />}
            </div>
          )
        })}
      </div>

      {/* Manual Posting Notice */}
      <Card className="mb-8 animate-fade-in stagger-1 border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.05)]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[rgba(245,158,11,0.15)] flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-(--color-locus-warning)" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Manual Posting Required</h3>
            <p className="text-sm text-locus-muted">
              Locus generates content but does <strong className="text-white">not auto-post</strong> to any platform.
              Copy your article and paste it on your chosen platform following the instructions.
            </p>
          </div>
        </div>
      </Card>

      {/* ─── Step 1: Select Article ─── */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Step 1: Select Your Article
          </h2>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-locus-muted" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-locus-border text-white placeholder-locus-muted text-sm focus:outline-none focus:border-locus-teal transition-colors"
            />
          </div>

          {isLoadingArticles ? (
            <div className="flex flex-col items-center py-16">
              <Loader2 size={32} className="animate-spin text-locus-teal mb-4" />
              <p className="text-locus-muted">Loading your articles...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="space-y-3">
              {filteredArticles.map((article, index) => {
                const isSelected = currentArticle?.id === article.id
                return (
                  <Card
                    key={article.id}
                    className={`animate-fade-in cursor-pointer group transition-all ${
                      isSelected
                        ? 'border-locus-teal ring-2 ring-[rgba(20,184,166,0.2)]'
                        : 'hover:border-locus-teal/50'
                    }`}
                    style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
                    onClick={() => handleSelectArticle(article)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-locus-border flex items-center justify-center shrink-0">
                        <FileText size={20} className="text-locus-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1 group-hover:text-locus-teal transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-locus-muted line-clamp-1 mb-2">
                          {article.content.substring(0, 120)}...
                        </p>
                        <div className="flex items-center gap-3 text-xs text-locus-muted">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {formatDate(article.created_at)}
                          </span>
                          <Badge variant={article.status === 'published' ? 'success' : 'purple'} className="text-[10px]">
                            {article.status}
                          </Badge>
                          {article.images && article.images.length > 0 && (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <ImageIcon size={11} />
                              {article.images.length} images
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-locus-muted group-hover:text-locus-teal transition-colors shrink-0 mt-1" />
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-locus-border flex items-center justify-center mx-auto mb-4">
                <FileText className="text-locus-muted" size={28} />
              </div>
              <p className="text-locus-muted mb-2">
                {searchQuery ? 'No articles match your search' : 'No articles yet'}
              </p>
              <p className="text-sm text-locus-muted opacity-75">
                {searchQuery ? 'Try a different search term' : 'Create an article first, then come back to publish'}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* ─── Step 2: Choose Platform ─── */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          {/* Selected article summary */}
          {currentArticle && (
            <Card className="border-locus-teal/30 bg-[rgba(20,184,166,0.03)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-locus-teal/15 flex items-center justify-center shrink-0">
                  <Check size={18} className="text-locus-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-locus-teal font-medium uppercase tracking-wider mb-1">Selected Article</p>
                  <h3 className="font-semibold text-white text-sm line-clamp-1">{currentArticle.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-locus-muted">
                    <Badge variant={currentArticle.status === 'published' ? 'success' : 'purple'} className="text-[10px]">
                      {currentArticle.status}
                    </Badge>
                    {currentArticle.images && currentArticle.images.length > 0 && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <ImageIcon size={11} />
                        {currentArticle.images.length} images
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-locus-muted hover:text-white transition-colors underline underline-offset-2"
                >
                  Change
                </button>
              </div>
            </Card>
          )}

          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Step 2: Choose Your Platform
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformCards.map((platform, index) => {
              const Icon = iconMap[PLATFORM_INFO[platform.id].icon]
              return (
                <Card
                  key={platform.id}
                  className="animate-fade-in cursor-pointer group hover:border-locus-teal transition-all"
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onClick={() => handleSelectPlatform(platform.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${platform.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      {Icon && <Icon size={24} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1">{platform.name}</h3>
                      <p className="text-sm text-locus-muted">{platform.tagline}</p>
                    </div>
                    <ChevronRight size={18} className="text-locus-muted group-hover:text-locus-teal transition-colors mt-1 shrink-0" />
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Step 3: Publish (Instructions / Tips / Tags) ─── */}
      {step === 3 && selectedPlatform && platformInfo && (
        <div className="space-y-6 animate-fade-in">
          {/* Back + Platform Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setStep(2); setSelectedPlatform(null); setSuggestedTags([]) }}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-locus-border flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <ArrowLeft size={18} className="text-locus-muted" />
            </button>
            <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${selectedCard?.gradient} flex items-center justify-center shrink-0`}>
              {PlatformIcon && <PlatformIcon size={24} className="text-white" />}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Publish on {platformInfo.name}
              </h2>
              <p className="text-sm text-locus-muted">{selectedCard?.tagline}</p>
            </div>
            <a
              href={platformInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-locus-border text-sm text-locus-teal hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              Open {platformInfo.name}
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Navigation */}
              <div className="flex gap-1 bg-[rgba(255,255,255,0.03)] border border-locus-border rounded-xl p-1">
                {[
                  { id: 'instructions' as const, label: 'How to Post', icon: BookOpen },
                  { id: 'seo' as const, label: 'Ranking Tips', icon: TrendingUp },
                  { id: 'tags' as const, label: `AI ${platformInfo.tagLabel}`, icon: Sparkles },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-[rgba(20,184,166,0.15)] text-locus-teal'
                        : 'text-locus-muted hover:text-white'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Instructions Tab */}
              {activeTab === 'instructions' && (
                <Card className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen size={20} className="text-locus-teal" />
                    <h3 className="font-semibold text-white">Step-by-Step: Post on {platformInfo.name}</h3>
                  </div>
                  <div className="space-y-4">
                    {platformInfo.instructions.map((s, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(20,184,166,0.15)] flex items-center justify-center shrink-0 text-sm font-bold text-locus-teal">
                          {index + 1}
                        </div>
                        <p className="text-sm text-locus-text leading-relaxed pt-1">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-locus-border">
                    <a
                      href={platformInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-locus-teal to-locus-cyan text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Open {platformInfo.name}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </Card>
              )}

              {/* SEO / Ranking Tips Tab */}
              {activeTab === 'seo' && (
                <Card className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-locus-teal" />
                    <h3 className="font-semibold text-white">Rank Higher on {platformInfo.name}</h3>
                  </div>
                  <div className="space-y-4">
                    {platformInfo.seoTips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-locus-teal mt-2 shrink-0" />
                        <p className="text-sm text-locus-text leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* AI Tags Tab */}
              {activeTab === 'tags' && (
                <Card className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles size={20} className="text-locus-teal" />
                      <h3 className="font-semibold text-white">AI-Suggested {platformInfo.tagLabel}</h3>
                    </div>
                    {suggestedTags.length > 0 && (
                      <button
                        onClick={handleCopyAllTags}
                        className="text-xs text-locus-muted hover:text-locus-teal transition-colors flex items-center gap-1"
                      >
                        {copiedTag === '__all__' ? <Check size={12} /> : <Copy size={12} />}
                        {copiedTag === '__all__' ? 'Copied!' : 'Copy All'}
                      </button>
                    )}
                  </div>

                  {!currentArticle ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-locus-muted">Select an article first to generate tags</p>
                    </div>
                  ) : suggestedTags.length === 0 && !isLoadingTags ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 rounded-2xl bg-[rgba(20,184,166,0.1)] flex items-center justify-center mx-auto mb-4">
                        <Wand2 size={24} className="text-locus-teal" />
                      </div>
                      <p className="text-white font-medium mb-2">
                        Generate {platformInfo.tagLabel} for Your Article
                      </p>
                      <p className="text-sm text-locus-muted mb-6 max-w-md mx-auto">
                        AI will analyze your article &ldquo;{currentArticle.title.substring(0, 60)}{currentArticle.title.length > 60 ? '...' : ''}&rdquo; and suggest the best {platformInfo.tagLabel.toLowerCase()} to maximize reach on {platformInfo.name}.
                      </p>
                      <Button onClick={handleSuggestTags}>
                        <Sparkles size={18} />
                        <span>Generate {platformInfo.tagLabel}</span>
                      </Button>
                    </div>
                  ) : isLoadingTags ? (
                    <div className="text-center py-12">
                      <Loader2 size={32} className="animate-spin text-locus-teal mx-auto mb-4" />
                      <p className="text-sm text-locus-muted">
                        AI is analyzing your article for the best {platformInfo.tagLabel.toLowerCase()}...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suggestedTags.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-locus-border hover:border-[rgba(20,184,166,0.3)] transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-white font-medium text-sm">{item.tag}</span>
                            <p className="text-xs text-locus-muted mt-0.5">{item.reason}</p>
                          </div>
                          <button
                            onClick={() => handleCopyTag(item.tag)}
                            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-locus-muted hover:text-locus-teal hover:bg-[rgba(20,184,166,0.1)] transition-all"
                          >
                            {copiedTag === item.tag ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      ))}
                      <div className="pt-4 flex gap-3">
                        <Button onClick={handleSuggestTags} variant="secondary" className="flex-1">
                          <Wand2 size={16} />
                          <span>Regenerate</span>
                        </Button>
                        <Button onClick={handleCopyAllTags} className="flex-1">
                          {copiedTag === '__all__' ? <Check size={16} /> : <Copy size={16} />}
                          <span>{copiedTag === '__all__' ? 'Copied!' : `Copy All ${platformInfo.tagLabel}`}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {currentArticle && (
                <Card className="sticky top-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white text-sm">Your Article</h3>
                    <Badge variant={currentArticle.status === 'published' ? 'success' : 'purple'}>
                      {currentArticle.status}
                    </Badge>
                  </div>

                  <div className="bg-[rgba(255,255,255,0.02)] border border-locus-border rounded-xl p-3 mb-4">
                    <h4 className="font-medium text-white text-sm mb-1">{currentArticle.title}</h4>
                    <p className="text-xs text-locus-muted line-clamp-3">
                      {currentArticle.content.substring(0, 150)}...
                    </p>
                  </div>

                  {currentArticle.images && currentArticle.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-locus-muted mb-2">{currentArticle.images.length} image{currentArticle.images.length !== 1 ? 's' : ''} attached</p>
                      <div className="flex gap-2">
                        {currentArticle.images.map((img, i) => (
                          <div key={i} className="w-14 h-14 rounded-lg bg-[rgba(255,255,255,0.05)] border border-locus-border overflow-hidden">
                            <img src={img.url} alt={img.alt || 'Article image'} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button onClick={handleCopy} className="w-full">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copied ? 'Copied!' : 'Copy Article'}</span>
                    </Button>

                    {currentArticle.images && currentArticle.images.length > 0 && (
                      <Button variant="secondary" onClick={handleDownloadImages} className="w-full">
                        <Download size={16} />
                        <span>Download Images</span>
                      </Button>
                    )}

                    {currentArticle.status !== 'published' && (
                      <Button variant="secondary" onClick={handleMarkPublished} className="w-full">
                        <Check size={16} />
                        <span>Mark as Published</span>
                      </Button>
                    )}
                  </div>

                  {/* Platform Switcher */}
                  <div className="mt-6 pt-4 border-t border-locus-border">
                    <h4 className="text-xs font-medium text-locus-muted uppercase tracking-wider mb-3">Switch Platform</h4>
                    <div className="space-y-1.5">
                      {platformCards.map(p => {
                        const PIcon = iconMap[PLATFORM_INFO[p.id].icon]
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSelectPlatform(p.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedPlatform === p.id
                                ? 'bg-[rgba(20,184,166,0.1)] text-locus-teal'
                                : 'text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                            }`}
                          >
                            {PIcon && <PIcon size={14} />}
                            <span>{p.name}</span>
                            {selectedPlatform === p.id && <Check size={12} className="ml-auto" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
