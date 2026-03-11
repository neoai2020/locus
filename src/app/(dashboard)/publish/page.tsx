'use client'

import { useState } from 'react'
import { 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Linkedin, 
  FileText, 
  Mail, 
  Globe,
  Lightbulb,
  AlertTriangle
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { PLATFORM_INFO, Platform } from '@/types'

const platformCards = [
  { 
    id: 'linkedin' as Platform, 
    icon: Linkedin, 
    name: 'LinkedIn', 
    url: 'https://www.linkedin.com/feed/',
    gradient: 'from-blue-600 to-blue-700',
    description: 'Best for B2B, professional insights, and thought leadership'
  },
  { 
    id: 'medium' as Platform, 
    icon: FileText, 
    name: 'Medium', 
    url: 'https://medium.com/new-story',
    gradient: 'from-gray-700 to-gray-800',
    description: 'Best for long-form content, tutorials, and in-depth analysis'
  },
  { 
    id: 'substack' as Platform, 
    icon: Mail, 
    name: 'Substack', 
    url: 'https://substack.com/publish/post',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Best for newsletters, personal branding, and subscriber growth'
  },
  { 
    id: 'general' as Platform, 
    icon: Globe, 
    name: 'Other Publications', 
    url: '#',
    gradient: 'from-locus-teal to-[var(--color-locus-indigo)]',
    description: 'Guest posts, industry blogs, and niche publications'
  },
]

export default function PublishPage() {
  const { currentArticle, updateArticle } = useAppStore()
  const [copied, setCopied] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    currentArticle?.platform 
      ? (Array.isArray(currentArticle.platform) ? currentArticle.platform[0] as Platform : currentArticle.platform as Platform)
      : null
  )

  const handleCopy = async () => {
    if (currentArticle) {
      await navigator.clipboard.writeText(currentArticle.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleMarkPublished = () => {
    if (currentArticle) {
      updateArticle(currentArticle.id, { status: 'published' })
    }
  }

  const tips = selectedPlatform ? PLATFORM_INFO[selectedPlatform].tips : []

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Publish & Distribute
        </h1>
        <p className="text-locus-muted">
          Deploy your article to high-authority platforms and maximize your reach
        </p>
      </div>

      {/* Important Notice */}
      <Card className="mb-8 animate-fade-in stagger-1 border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.05)]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[rgba(245,158,11,0.15)] flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-(--color-locus-warning)" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Manual Posting Required</h3>
            <p className="text-sm text-locus-muted">
              Locus generates content but does <strong className="text-white">not auto-post</strong> to any platform. 
              This keeps your accounts safe and compliant. Copy your article and paste it directly on your chosen platform.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Selection */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Choose Your Platform
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platformCards.map((platform, index) => (
              <Card 
                key={platform.id}
                className={`
                  animate-fade-in cursor-pointer group
                  ${selectedPlatform === platform.id ? 'border-locus-teal ring-2 ring-[rgba(20,184,166,0.2)]' : ''}
                `}
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${platform.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <platform.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1">{platform.name}</h3>
                    <p className="text-sm text-locus-muted">
                      {platform.description}
                    </p>
                  </div>
                </div>
                
                {selectedPlatform === platform.id && (
                  <div className="mt-4 pt-4 border-t border-locus-border">
                    <a 
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-locus-teal hover:text-(--color-locus-emerald) transition-colors"
                    >
                      <span>Open {platform.name}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Current Article */}
          {currentArticle && (
            <Card className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
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

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleCopy} className="flex-1">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied!' : 'Copy Article'}</span>
                </Button>
                
                {currentArticle.status !== 'published' && (
                  <Button variant="secondary" onClick={handleMarkPublished}>
                    <Check size={18} />
                    <span>Mark as Published</span>
                  </Button>
                )}
              </div>
            </Card>
          )}

          {!currentArticle && (
            <Card className="animate-fade-in text-center py-12" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 rounded-2xl bg-locus-border flex items-center justify-center mx-auto mb-4">
                <Send className="text-locus-muted" size={28} />
              </div>
              <p className="text-locus-muted mb-2">No article selected</p>
              <p className="text-sm text-locus-muted opacity-75">
                Create or select an article from your saved drafts to publish
              </p>
            </Card>
          )}
        </div>

        {/* Tips Panel */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Card className="sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-r from-locus-teal to-locus-cyan flex items-center justify-center">
                <Lightbulb size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-white">Posting Tips</h3>
            </div>

            {selectedPlatform ? (
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-locus-teal mt-2 shrink-0" />
                    <span className="text-locus-text">{tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-locus-muted">
                Select a platform to see posting tips
              </p>
            )}

            <div className="mt-6 pt-6 border-t border-locus-border">
              <h4 className="font-medium text-white text-sm mb-3">Quick Links</h4>
              <div className="space-y-2">
                {platformCards.filter(p => p.url !== '#').map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-locus-muted hover:text-locus-teal transition-colors"
                  >
                    <platform.icon size={14} />
                    <span>{platform.name}</span>
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
