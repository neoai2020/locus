'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Zap, 
  FileText, 
  TrendingUp,
  Check,
  ArrowRight,
  Facebook,
  Link as LinkIcon,
  Sparkles,
  Copy,
  Loader2,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Share2,
  Target,
  BarChart3
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useAppStore } from '@/store'
import { AffiliateLink as AffiliateLinkType } from '@/types'

export default function TenXPage() {
  const router = useRouter()
  const { isUpsellUnlocked, affiliateLinks } = useAppStore()
  const [isChecking, setIsChecking] = useState(true)
  
  const [selectedLink, setSelectedLink] = useState('')
  const [linkLabel, setLinkLabel] = useState('')
  const [linkSaved, setLinkSaved] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isUpsellUnlocked('10x')) {
      router.push('/unlock/10x')
    } else {
      setIsChecking(false)
    }
  }, [isUpsellUnlocked, router])

  const handleGenerate10Posts = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLink.trim()) return

    setIsGenerating(true)
    setGeneratedPosts([])
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `Generate exactly 10 unique, high-converting Facebook posts promoting the product at: ${selectedLink}. Each post should have a different angle/hook — urgency, social proof, storytelling, curiosity, pain point, benefit-focused, contrarian, question-based, listicle, and testimonial style. Return a JSON array of 10 objects, each with "hook" (attention-grabbing first line), "body" (main post content, 3-5 sentences), and "cta" (call-to-action with the link). Make each post ready to copy-paste into Facebook.`,
          platform: 'facebook',
          tone: 'bold',
          length: 'medium',
          affiliateLink: selectedLink,
          niche: 'ecommerce',
          raw: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate posts')
      }
      
      const data = await response.json()

      let posts: any[] = []
      const content = data.body || data.content || ''
      const raw = typeof content === 'string' ? content : JSON.stringify(content)
      
      try {
        const jsonMatch = raw.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          posts = JSON.parse(jsonMatch[0])
        }
      } catch {}

      if (posts.length === 0) {
        posts = [{
          hook: data.hook || 'Your attention-grabbing hook',
          body: data.body || raw || 'Post content',
          cta: data.cta || `Check it out here: ${selectedLink}`
        }]
      }

      setGeneratedPosts(posts)
    } catch (error: any) {
      console.error('Error generating posts:', error)
      setError(error.message || 'Failed to generate posts. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (index: number) => {
    const post = generatedPosts[index]
    if (!post) return
    const hook = (post.hook || '').replace(/<[^>]*>/g, '')
    const body = (post.body || '').replace(/<[^>]*>/g, '')
    const cta = (post.cta || '').replace(/<[^>]*>/g, '')
    navigator.clipboard.writeText(`${hook}\n\n${body}\n\n${cta}`)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyAll = () => {
    const allText = generatedPosts.map((post, i) => {
      const hook = (post.hook || '').replace(/<[^>]*>/g, '')
      const body = (post.body || '').replace(/<[^>]*>/g, '')
      const cta = (post.cta || '').replace(/<[^>]*>/g, '')
      return `--- Post ${i + 1} ---\n\n${hook}\n\n${body}\n\n${cta}`
    }).join('\n\n\n')
    navigator.clipboard.writeText(allText)
    setCopiedIndex(-1)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSaveLink = () => {
    if (!selectedLink.trim()) return
    const newLink: AffiliateLinkType = {
      id: crypto.randomUUID(),
      link: selectedLink.trim(),
      label: linkLabel.trim() || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    useAppStore.getState().addAffiliateLink(newLink)
    setLinkSaved(true)
  }

  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-locus-border animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <Badge variant="warning">10X Mode Active</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          10X Facebook Post Generator
        </h1>
        <p className="text-locus-muted">
          Generate 10 unique, high-converting Facebook posts from a single link — each with a different angle to maximize reach.
        </p>
      </div>

      {/* What You Get Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in stagger-1">
        {[
          { icon: Share2, title: '10 Unique Posts', desc: 'Different hooks, angles & styles per generation', gradient: 'from-blue-500 to-blue-400' },
          { icon: Target, title: 'High-Converting Copy', desc: 'Each post optimized for clicks & engagement', gradient: 'from-orange-500 to-amber-500' },
          { icon: BarChart3, title: 'Ready to Publish', desc: 'Copy-paste directly into Facebook', gradient: 'from-emerald-500 to-teal-500' },
        ].map((item) => (
          <Card key={item.title} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg bg-linear-to-r ${item.gradient} flex items-center justify-center shrink-0`}>
                <item.icon size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-xs text-locus-muted">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Generator Card */}
      <Card className="animate-fade-in stagger-2 relative overflow-hidden border-orange-500/20">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 flex items-center justify-center">
              <Facebook size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Generate 10 Facebook Posts</h2>
            <Badge variant="warning" className="ml-auto">10X Exclusive</Badge>
          </div>

          <form onSubmit={handleGenerate10Posts} className="space-y-5">
            {/* Saved Links from Portfolio */}
            {affiliateLinks.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowPortfolio(!showPortfolio)}
                  className="flex items-center gap-2 text-sm font-medium text-locus-teal hover:text-white transition-colors mb-2"
                >
                  <LinkIcon size={14} />
                  Select from My Portfolio ({affiliateLinks.length})
                  {showPortfolio ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                
                {showPortfolio && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4">
                    {affiliateLinks.map((sl) => {
                      const isSelected = selectedLink === sl.link
                      return (
                        <button
                          key={sl.id}
                          type="button"
                          onClick={() => {
                            setSelectedLink(sl.link)
                            setLinkLabel(sl.label || '')
                            setLinkSaved(true)
                            setShowPortfolio(false)
                          }}
                          className={`
                            w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200
                            ${isSelected
                              ? 'border-locus-teal bg-locus-teal/10'
                              : 'border-locus-border bg-[rgba(255,255,255,0.02)] hover:border-locus-teal/50'
                            }
                          `}
                        >
                          <LinkIcon size={16} className={isSelected ? 'text-locus-teal shrink-0' : 'text-locus-muted shrink-0'} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-locus-text'}`}>
                              {sl.label || 'Untitled Link'}
                            </p>
                            <p className="text-xs text-locus-muted truncate">{sl.link}</p>
                          </div>
                          {isSelected && <Check size={16} className="text-locus-teal shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Manual Input */}
            <div className="space-y-3">
              <Input
                label="Link Name"
                placeholder="e.g. My Fitness eBook, Keto Supplement, etc."
                value={linkLabel}
                onChange={(e) => { setLinkLabel(e.target.value); setLinkSaved(false) }}
              />
              <Input
                label="Promotional Link"
                placeholder="https://example.com/product?ref=your-id"
                value={selectedLink}
                onChange={(e) => { setSelectedLink(e.target.value); setLinkSaved(false) }}
                icon={<LinkIcon size={18} />}
                required
              />
            </div>

            {/* Save Link Option */}
            {selectedLink.trim() && !linkSaved && (
              <button
                type="button"
                onClick={handleSaveLink}
                className="flex items-center gap-2 text-xs text-locus-muted hover:text-locus-teal transition-colors"
              >
                <Save size={13} />
                Save this link to My Portfolio
              </button>
            )}
            {linkSaved && (
              <span className="flex items-center gap-1.5 text-xs text-locus-teal">
                <CheckCircle2 size={13} />
                Saved to portfolio
              </span>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400" 
              disabled={isGenerating || !selectedLink.trim()}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generating 10 Posts...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate 10 Facebook Posts</span>
                </>
              )}
            </Button>
            
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}
          </form>

          {/* Generated Posts */}
          {generatedPosts.length > 0 && (
            <div className="mt-8 border-t border-white/5 pt-6 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  {generatedPosts.length} Posts Generated
                </h3>
                <button 
                  onClick={handleCopyAll}
                  className="flex items-center gap-2 text-xs font-medium text-locus-teal hover:text-white transition-colors"
                >
                  {copiedIndex === -1 ? <Check size={14} /> : <Copy size={14} />}
                  {copiedIndex === -1 ? 'All Copied!' : 'Copy All Posts'}
                </button>
              </div>
              
              <div className="space-y-4">
                {generatedPosts.map((post, index) => (
                  <div
                    key={index}
                    className="bg-[rgba(255,255,255,0.03)] rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-xs text-locus-muted font-medium">Post {index + 1}</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(index)}
                        className="flex items-center gap-1.5 text-xs text-locus-muted hover:text-locus-teal transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
                        {copiedIndex === index ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="font-bold text-white text-sm mb-2" dangerouslySetInnerHTML={{ __html: post.hook || '' }} />
                    <div className="text-sm text-locus-text mb-2 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.body || '' }} />
                    <div className="text-sm text-locus-teal italic" dangerouslySetInnerHTML={{ __html: post.cta || '' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* How It Works */}
      <Card className="mt-8 animate-fade-in stagger-3 border-amber-500/15 bg-[rgba(245,158,11,0.02)]">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-amber-400" />
          How to Maximize Your Results
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Generate', desc: 'Enter your promotional link and generate 10 unique Facebook posts with different hooks and angles.' },
            { step: '2', title: 'Schedule', desc: 'Space the posts out over 1-2 weeks. Different angles hit different audiences at different times.' },
            { step: '3', title: 'Engage', desc: 'Reply to comments on each post. The algorithm rewards engagement and pushes your posts to more people.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-sm font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-locus-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-fade-in stagger-3">
        <Card className="p-4 cursor-pointer hover:border-locus-teal/30 transition-all" onClick={() => router.push('/create')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-locus-teal/15 flex items-center justify-center">
              <FileText size={18} className="text-locus-teal" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">Create Full Article</h4>
              <p className="text-xs text-locus-muted">Write a long-form SEO article instead</p>
            </div>
            <ArrowRight size={16} className="text-locus-muted" />
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:border-locus-teal/30 transition-all" onClick={() => router.push('/saved')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-locus-teal/15 flex items-center justify-center">
              <LinkIcon size={18} className="text-locus-teal" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">My Portfolio</h4>
              <p className="text-xs text-locus-muted">Manage your saved links & articles</p>
            </div>
            <ArrowRight size={16} className="text-locus-muted" />
          </div>
        </Card>
      </div>
    </div>
  )
}
