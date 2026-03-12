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
  ArrowRight,
  Facebook,
  Link as LinkIcon,
  Sparkles,
  Copy,
  Loader2
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useAppStore } from '@/store'

const benefits = [
  {
    icon: FileText,
    title: 'Unlimited Articles',
    description: 'Generate as many articles as you need, no daily or monthly caps',
    gradient: 'from-orange-500 to-yellow-500'
  },
  {
    icon: Clock,
    title: 'No Throttling',
    description: 'Full-speed generation without artificial delays',
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    icon: TrendingUp,
    title: 'Priority Processing',
    description: 'Your requests are processed before free tier users',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: Zap,
    title: 'Instant Access',
    description: 'All premium features available immediately',
    gradient: 'from-orange-500 to-amber-500'
  },
]

export default function TenXPage() {
  const router = useRouter()
  const { isUpsellUnlocked, articles } = useAppStore()
  const [isChecking, setIsChecking] = useState(true)
  
  // Facebook Post Generation State
  const [affiliateLink, setAffiliateLink] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [isScraping, setIsScraping] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isUpsellUnlocked('10x')) {
      router.push('/unlock/10x')
    } else {
      setIsChecking(false)
    }
  }, [isUpsellUnlocked, router])

  const handleGenerateFacebookPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!affiliateLink.trim()) return

    setIsGenerating(true)
    setGeneratedPost(null)
    setError('')

    try {
      // Step 2: Generate the post (scraping now happens on server)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `A promotional Facebook post for the product at this link: ${affiliateLink}`,
          platform: 'facebook',
          tone: 'bold',
          length: 'short',
          affiliateLink: affiliateLink,
          niche: 'ecommerce'
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate post')
      }
      
      const data = await response.json()
      setGeneratedPost(data)
    } catch (error: any) {
      console.error('Error generating Facebook post:', error)
      setError(error.message || 'Failed to generate post. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!generatedPost) return
    const content = `${generatedPost.hook}\n\n${generatedPost.body}\n\n${generatedPost.cta}`.replace(/<[^>]*>/g, '')
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-locus-border animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <Badge variant="warning">10X Mode Active</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Unlimited Everything (10X Mode)
        </h1>
        <p className="text-locus-muted">
          You now have 10X power with unlimited access to all features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Facebook Post Generator */}
          <Card className="animate-fade-in stagger-1 relative overflow-hidden active-gradient border-orange-500/20">
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                  <Facebook size={18} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Facebook Post Generator</h2>
                <Badge variant="warning" className="ml-auto">10X Exclusive</Badge>
              </div>

              <form onSubmit={handleGenerateFacebookPost} className="space-y-4">
                <Input
                  label="Product Affiliate Link"
                  placeholder="Paste your link here (e.g., Digistore24, Amazon...)"
                  value={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.value)}
                  icon={<LinkIcon size={18} />}
                  required
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400" 
                  disabled={isGenerating || isScraping || !affiliateLink.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Generating Magical Post...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Generate Facebook Post</span>
                    </>
                  )}
                </Button>
                
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                    {error}
                  </div>
                )}
              </form>

              {generatedPost && (
                <div className="mt-8 animate-fade-in border-t border-white/5 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-locus-muted uppercase tracking-wider">Generated Result</h3>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-xs font-medium text-locus-teal hover:text-locus-cyan transition-colors"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-5 border border-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div className="font-bold text-white mb-4" dangerouslySetInnerHTML={{ __html: generatedPost.hook }} />
                      <div className="text-locus-text mb-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: generatedPost.body }} />
                      <div className="italic text-locus-muted" dangerouslySetInnerHTML={{ __html: generatedPost.cta }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <Card 
                key={benefit.title}
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-r ${benefit.gradient} flex items-center justify-center shrink-0`}>
                    <benefit.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{benefit.title}</h3>
                      <Check size={14} className="text-locus-success" />
                    </div>
                    <p className="text-sm text-locus-muted">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="animate-fade-in stagger-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-yellow-500/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Your Usage</h2>
                <Badge variant="warning">
                  <Infinity size={12} className="mr-1" />
                  Unlimited
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] flex items-center justify-between">
                  <span className="text-sm text-locus-muted">Articles</span>
                  <span className="text-xl font-bold text-white">{articles.length}</span>
                </div>
                <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] flex items-center justify-between">
                  <span className="text-sm text-locus-muted">FB Posts</span>
                  <span className="text-xl font-bold text-white">Unlimited</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="animate-fade-in text-center" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-locus-muted mb-6">
              Learn how to maximize your 10X Mode potential
            </p>
            <Button onClick={() => router.push('/create')} className="w-full">
              <span>Create Article</span>
              <ArrowRight size={18} />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
