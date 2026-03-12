'use client'

import { useState } from 'react'
import {
  Send,
  Copy,
  Check,
  ExternalLink,
  Linkedin,
  FileText,
  Hash,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  Loader2,
  Wand2,
  ChevronRight,
  BookOpen,
  TrendingUp,
  ArrowLeft,
  Twitter,
  Sparkles,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { PLATFORM_INFO, Platform } from '@/types'

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
  {
    id: 'linkedin',
    name: 'LinkedIn',
    gradient: 'from-blue-600 to-blue-700',
    tagline: 'B2B, thought leadership & professional authority',
  },
  {
    id: 'quora',
    name: 'Quora',
    gradient: 'from-red-600 to-red-700',
    tagline: 'Answer-based SEO & evergreen Google traffic',
  },
  {
    id: 'medium',
    name: 'Medium',
    gradient: 'from-gray-700 to-gray-800',
    tagline: 'Long-form content, tutorials & publication reach',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    gradient: 'from-orange-500 to-orange-600',
    tagline: 'Community-driven traffic & niche subreddit reach',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    gradient: 'from-sky-500 to-sky-600',
    tagline: 'Viral threads, hot takes & real-time engagement',
  },
]

interface SuggestedTag {
  tag: string
  reason: string
}

export default function PublishPage() {
  const { currentArticle, updateArticle } = useAppStore()
  const [copied, setCopied] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [activeTab, setActiveTab] = useState<'instructions' | 'seo' | 'tags'>('instructions')
  const [suggestedTags, setSuggestedTags] = useState<SuggestedTag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [copiedTag, setCopiedTag] = useState<string | null>(null)

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

  const handleSelectPlatform = (id: Platform) => {
    setSelectedPlatform(id)
    setActiveTab('instructions')
    setSuggestedTags([])
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
      if (data.tags && data.tags.length > 0) {
        setSuggestedTags(data.tags)
      }
    } catch (err) {
      console.error('Failed to suggest tags:', err)
    } finally {
      setIsLoadingTags(false)
    }
  }

  const platformInfo = selectedPlatform ? PLATFORM_INFO[selectedPlatform] : null
  const PlatformIcon = selectedPlatform ? iconMap[PLATFORM_INFO[selectedPlatform].icon] : null
  const selectedCard = platformCards.find(p => p.id === selectedPlatform)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Publish & Distribute
        </h1>
        <p className="text-locus-muted">
          Choose a platform, follow the step-by-step guide, and let AI suggest the best tags to maximize reach
        </p>
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
              Copy your article below and paste it on your chosen platform following the instructions.
            </p>
          </div>
        </div>
      </Card>

      {/* Platform Selection Row */}
      {!selectedPlatform && (
        <div className="space-y-6 animate-fade-in stagger-2">
          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Choose Your Platform
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformCards.map((platform, index) => {
              const Icon = iconMap[PLATFORM_INFO[platform.id].icon]
              return (
                <Card
                  key={platform.id}
                  className="animate-fade-in cursor-pointer group hover:border-locus-teal transition-all"
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
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

          {/* Article Preview (no platform selected) */}
          {currentArticle ? (
            <Card className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Your Article</h3>
                <Badge variant={currentArticle.status === 'published' ? 'success' : 'purple'}>
                  {currentArticle.status}
                </Badge>
              </div>
              <div className="bg-[rgba(255,255,255,0.02)] border border-locus-border rounded-xl p-4 mb-4">
                <h4 className="font-medium text-white mb-2">{currentArticle.title}</h4>
                <p className="text-sm text-locus-muted line-clamp-3">
                  {currentArticle.content.substring(0, 200)}...
                </p>
              </div>
              <Button onClick={handleCopy}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copied!' : 'Copy Article'}</span>
              </Button>
            </Card>
          ) : (
            <Card className="animate-fade-in text-center py-12" style={{ animationDelay: '0.7s' }}>
              <div className="w-16 h-16 rounded-2xl bg-locus-border flex items-center justify-center mx-auto mb-4">
                <Send className="text-locus-muted" size={28} />
              </div>
              <p className="text-locus-muted mb-2">No article selected</p>
              <p className="text-sm text-locus-muted opacity-75">
                Create or select an article from your portfolio to publish
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Selected Platform Detail View */}
      {selectedPlatform && platformInfo && (
        <div className="space-y-6 animate-fade-in">
          {/* Back + Platform Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectedPlatform(null); setSuggestedTags([]) }}
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
                    {platformInfo.instructions.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(20,184,166,0.15)] flex items-center justify-center shrink-0 text-sm font-bold text-locus-teal">
                          {index + 1}
                        </div>
                        <p className="text-sm text-locus-text leading-relaxed pt-1">{step}</p>
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
              {/* Article Card */}
              {currentArticle ? (
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

                  <div className="space-y-2">
                    <Button onClick={handleCopy} className="w-full">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copied ? 'Copied!' : 'Copy Article'}</span>
                    </Button>

                    {currentArticle.status !== 'published' && (
                      <Button variant="secondary" onClick={handleMarkPublished} className="w-full">
                        <Check size={16} />
                        <span>Mark as Published</span>
                      </Button>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="mt-6 pt-4 border-t border-locus-border">
                    <h4 className="text-xs font-medium text-locus-muted uppercase tracking-wider mb-3">All Platforms</h4>
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
              ) : (
                <Card className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-locus-border flex items-center justify-center mx-auto mb-3">
                    <Send className="text-locus-muted" size={20} />
                  </div>
                  <p className="text-sm text-locus-muted mb-1">No article selected</p>
                  <p className="text-xs text-locus-muted opacity-75">
                    Create or select an article first
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
