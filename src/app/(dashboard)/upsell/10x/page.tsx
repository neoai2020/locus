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
  BarChart3,
  Lightbulb,
  Clock,
  Users,
  MessageCircle,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useAppStore } from '@/store'
import { AffiliateLink as AffiliateLinkType } from '@/types'

const LOADING_MESSAGES = [
  'Analyzing your link...',
  'Crafting urgency hooks...',
  'Writing social proof angles...',
  'Building storytelling posts...',
  'Adding curiosity triggers...',
  'Optimizing for engagement...',
  'Creating contrarian angles...',
  'Polishing call-to-actions...',
  'Making posts scroll-stopping...',
  'Finalizing your 10 posts...',
]

interface GeneratedPost {
  hook: string
  body: string
  cta: string
  angle: string
}

export default function TenXPage() {
  const router = useRouter()
  const { isUpsellUnlocked, affiliateLinks } = useAppStore()
  const [isChecking, setIsChecking] = useState(true)
  
  const [selectedLink, setSelectedLink] = useState('')
  const [linkLabel, setLinkLabel] = useState('')
  const [linkSaved, setLinkSaved] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)

  useEffect(() => {
    if (!isUpsellUnlocked('10x')) {
      router.push('/unlock/10x')
    } else {
      setIsChecking(false)
    }
  }, [isUpsellUnlocked, router])

  useEffect(() => {
    if (!isGenerating) return
    const interval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isGenerating])

  const handleGenerate10Posts = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLink.trim()) return

    setIsGenerating(true)
    setGeneratedPosts([])
    setError('')
    setLoadingMsgIdx(0)

    try {
      const response = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link: selectedLink.trim(),
          linkName: linkLabel.trim() || undefined,
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate posts')
      }
      
      const data = await response.json()
      setGeneratedPosts(data.posts || [])
    } catch (err: any) {
      console.error('Error generating posts:', err)
      setError(err.message || 'Failed to generate posts. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getPostText = (post: GeneratedPost) => {
    return `${post.hook}\n\n${post.body}\n\n${post.cta}`
  }

  const handleCopy = (index: number) => {
    const post = generatedPosts[index]
    if (!post) return
    navigator.clipboard.writeText(getPostText(post))
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyAll = () => {
    const allText = generatedPosts.map((post, i) =>
      `--- Post ${i + 1}: ${post.angle} ---\n\n${getPostText(post)}`
    ).join('\n\n\n')
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
          Generate 10 unique, high-converting Facebook posts from a single link — each with a different angle to maximize reach and clicks.
        </p>
      </div>

      {/* What You Get Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in stagger-1">
        {[
          { icon: Share2, title: '10 Unique Posts', desc: '10 different hooks & angles per link', gradient: 'from-blue-500 to-blue-400' },
          { icon: Target, title: 'High-Converting Copy', desc: 'Optimized for clicks & engagement', gradient: 'from-orange-500 to-amber-500' },
          { icon: BarChart3, title: 'Ready to Post', desc: 'Copy-paste directly into Facebook', gradient: 'from-emerald-500 to-teal-500' },
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
            <Badge variant="warning" className="ml-auto">10X</Badge>
          </div>

          <form onSubmit={handleGenerate10Posts} className="space-y-5">
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
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${isSelected ? 'border-locus-teal bg-locus-teal/10' : 'border-locus-border bg-[rgba(255,255,255,0.02)] hover:border-locus-teal/50'}`}
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

            <div className="space-y-3">
              <Input
                label="Link Name"
                placeholder="e.g. My Fitness eBook, Water Filter System, etc."
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

            {isGenerating && (
              <div className="flex items-center justify-center gap-3 py-3 animate-fade-in">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-sm text-amber-400 transition-all duration-300">{LOADING_MESSAGES[loadingMsgIdx]}</span>
              </div>
            )}
            
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}
          </form>
        </div>
      </Card>

      {/* Generated Posts */}
      {generatedPosts.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              {generatedPosts.length} Facebook Posts Ready
            </h3>
            <button 
              onClick={handleCopyAll}
              className="flex items-center gap-2 text-sm font-medium text-locus-teal hover:text-white transition-colors px-4 py-2 rounded-xl border border-locus-border hover:border-locus-teal"
            >
              {copiedIndex === -1 ? <Check size={14} /> : <Copy size={14} />}
              {copiedIndex === -1 ? 'All Copied!' : 'Copy All Posts'}
            </button>
          </div>
          
          <div className="space-y-4">
            {generatedPosts.map((post, index) => (
              <Card
                key={index}
                className="group hover:border-[rgba(59,130,246,0.3)] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-white">Post {index + 1}</span>
                      <span className="text-xs text-blue-400/70 ml-2">{post.angle}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(index)}
                    className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-all border border-locus-border hover:border-locus-teal text-locus-muted hover:text-locus-teal"
                  >
                    {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
                    {copiedIndex === index ? 'Copied!' : 'Copy Post'}
                  </button>
                </div>

                <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-5 border border-white/5">
                  <p className="font-bold text-white text-[15px] mb-3 leading-relaxed whitespace-pre-wrap">{post.hook}</p>
                  <p className="text-sm text-locus-text mb-3 leading-relaxed whitespace-pre-wrap">{post.body}</p>
                  <p className="text-sm text-locus-teal leading-relaxed whitespace-pre-wrap">{post.cta}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Facebook Tips Box */}
      <Card className="mt-8 animate-fade-in stagger-3 border-blue-500/20 bg-[rgba(59,130,246,0.03)]">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb size={18} className="text-blue-400" />
          <h3 className="font-bold text-white">Pro Tips: How to Go Viral on Facebook</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users size={14} className="text-blue-400" />
              Where to Share
            </h4>
            <ul className="space-y-2.5 text-sm text-locus-text">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-white">Niche Facebook Groups</strong> — Find groups with 10K–100K members related to your product. Avoid spammy mega-groups.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-white">Your Profile & Stories</strong> — Post on your personal profile too. Facebook's algorithm favors personal accounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-white">Facebook Pages You Manage</strong> — If you have a page, post there and boost the best-performing posts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-white">Comment Sections</strong> — Reply to relevant viral posts with your take and a subtle link. High-traffic comments = free visibility.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Clock size={14} className="text-amber-400" />
              When & How to Post
            </h4>
            <ul className="space-y-2.5 text-sm text-locus-text">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span><strong className="text-white">Best times:</strong> 9–11 AM and 7–9 PM in your audience's timezone. Tuesday–Thursday perform best.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span><strong className="text-white">Space them out:</strong> Post 1–2 per day across different groups. Never spam the same group twice in a day.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span><strong className="text-white">Engage immediately:</strong> Reply to every comment within the first hour. Facebook rewards fast engagement with more reach.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span><strong className="text-white">Use all 10 angles:</strong> Different posts resonate with different people. The curiosity angle might flop where storytelling goes viral.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <MessageCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-1">The Golden Rule of Facebook Groups</p>
              <p className="text-xs text-locus-text leading-relaxed">
                Contribute value to the group FIRST. Comment on other people's posts, answer questions, and be helpful for a few days before sharing your own link posts. Group admins are more likely to approve your posts, and members are more likely to engage with someone they recognize. A warm audience converts 5–10x better than cold posting.
              </p>
            </div>
          </div>
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
