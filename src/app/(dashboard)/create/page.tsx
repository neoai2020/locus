'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PenTool, 
  Sparkles, 
  Linkedin, 
  FileText, 
  MessageSquare,
  Hash,
  Twitter,
  Copy,
  Save,
  Check,
  RefreshCw,
  Link as LinkIcon,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Loader2,
  CheckCircle2,
  Eye,
  Image,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ShoppingBag,
  Store,
  ShoppingCart,
  Tag
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useAppStore } from '@/store'
import { Platform, ArticleTone, GeneratedArticle, AffiliateLink as AffiliateLinkType, AffiliatePlatform } from '@/types'

const nicheOptions = [
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance & Investing' },
  { value: 'tech', label: 'Technology' },
  { value: 'marketing', label: 'Digital Marketing' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'fitness', label: 'Fitness & Sports' },
  { value: 'education', label: 'Education & Learning' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'travel', label: 'Travel & Lifestyle' },
  { value: 'food', label: 'Food & Nutrition' },
  { value: 'beauty', label: 'Beauty & Skincare' },
  { value: 'business', label: 'Business & Entrepreneurship' },
  { value: 'selfhelp', label: 'Self-Help & Personal Development' },
  { value: 'crypto', label: 'Crypto & Blockchain' },
  { value: 'saas', label: 'SaaS & Software' },
]

const platformOptions = [
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'quora', label: 'Quora', icon: MessageSquare },
  { value: 'medium', label: 'Medium', icon: FileText },
  { value: 'reddit', label: 'Reddit', icon: Hash },
  { value: 'twitter', label: 'X (Twitter)', icon: Twitter },
]

const toneOptions = [
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'bold', label: 'Bold' },
]

const steps = [
  { number: 1, title: 'Link & Niche', description: 'Set your affiliate link and niche' },
  { number: 2, title: 'Topic & Settings', description: 'Choose your headline and preferences' },
  { number: 3, title: 'Generated Article', description: 'Review and save your article' },
]

const affiliatePlatforms: { value: AffiliatePlatform; label: string; description: string; icon: typeof ShoppingBag }[] = [
  { value: 'digistore24', label: 'Digistore24', description: 'Digital products marketplace', icon: ShoppingBag },
  { value: 'amazon', label: 'Amazon', description: 'Amazon Associates program', icon: ShoppingCart },
  { value: 'etsy', label: 'Etsy', description: 'Etsy affiliate program', icon: Tag },
  { value: 'ebay', label: 'eBay', description: 'eBay Partner Network', icon: Store },
]

const platformInstructions: Record<AffiliatePlatform, { steps: string[]; linkUrl: string; linkLabel: string }> = {
  digistore24: {
    steps: [
      'Go to Digistore24.com and create a free account',
      'Navigate to the Marketplace and find your product',
      'Click "Promote Now" to get your unique affiliate link',
      'Copy your affiliate link',
      'Paste it below and click "Save Link"',
    ],
    linkUrl: 'https://www.digistore24.com',
    linkLabel: 'Open Digistore24',
  },
  amazon: {
    steps: [
      'Go to Amazon Associates and create a free account',
      'Search for a product you want to promote',
      'Use the SiteStripe bar to generate your affiliate link',
      'Copy your affiliate link',
      'Paste it below and click "Save Link"',
    ],
    linkUrl: 'https://affiliate-program.amazon.com',
    linkLabel: 'Open Amazon Associates',
  },
  etsy: {
    steps: [
      "Go to Etsy's Affiliate Program via Awin",
      'Sign up and get approved as an affiliate',
      'Browse Etsy and find products to promote',
      'Generate your affiliate link through Awin dashboard',
      'Paste it below and click "Save Link"',
    ],
    linkUrl: 'https://www.awin.com/us/affiliate/etsy',
    linkLabel: 'Open Etsy Affiliates',
  },
  ebay: {
    steps: [
      'Go to eBay Partner Network',
      'Create a free account and get approved',
      'Use the link generator to create affiliate links for any eBay listing',
      'Copy your affiliate link',
      'Paste it below and click "Save Link"',
    ],
    linkUrl: 'https://partnernetwork.ebay.com',
    linkLabel: 'Open eBay Partners',
  },
}

export default function CreateArticlePage() {
  const router = useRouter()
  const { isGenerating, setIsGenerating, currentArticle } = useAppStore()
  
  // Step control
  const [currentStep, setCurrentStep] = useState(1)
  
  // Step 1 — Link & Niche
  const [affiliateLink, setAffiliateLink] = useState('')
  const [niche, setNiche] = useState('')
  const [productInfo, setProductInfo] = useState<Record<string, string> | null>(null)
  const [isScraping, setIsScraping] = useState(false)
  const [selectedAffiliatePlatform, setSelectedAffiliatePlatform] = useState<AffiliatePlatform | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [linkSaved, setLinkSaved] = useState(false)
  
  // Step 2 — Topic & Settings
  const [topic, setTopic] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin'])
  const [tone, setTone] = useState<ArticleTone>('authoritative')
  const [suggestedHeadlines, setSuggestedHeadlines] = useState<string[]>([])
  const [previousHeadlines, setPreviousHeadlines] = useState<string[]>([])
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [isSuggestingTone, setIsSuggestingTone] = useState(false)
  const [suggestedTone, setSuggestedTone] = useState<string | null>(null)
  const [suggestedToneReason, setSuggestedToneReason] = useState('')
  
  // Step 3 — Generated Article
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  const loadingMessages = [
    'Searching for best ranking keywords...',
    'Analyzing top-performing content in your niche...',
    'Crafting an attention-grabbing hook...',
    'Optimizing for engagement and shareability...',
    'Building authority-driven structure...',
    'Weaving in persuasive copy patterns...',
    'Adding high-converting call-to-action...',
    'Polishing for readability and flow...',
    'Running final quality checks...',
    'Almost there — packaging your article...',
  ]

  useEffect(() => {
    if (!isGenerating) {
      setLoadingMessageIndex(0)
      return
    }
    const interval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [isGenerating])

  // Load current article if it exists
  useEffect(() => {
    const { currentArticle } = useAppStore.getState()
    if (currentArticle) {
      setTopic(currentArticle.title)
      setEditedContent(currentArticle.content)
      setAffiliateLink(currentArticle.affiliate_link || '')
      setNiche(currentArticle.niche || '')
      setSelectedPlatforms(Array.isArray(currentArticle.platform) ? currentArticle.platform : [currentArticle.platform as string])
      setTone(currentArticle.tone)
      setGeneratedArticle({
        hook: currentArticle.hook || '',
        body: '',
        cta: currentArticle.cta || '',
        fullContent: currentArticle.content
      })
      setCurrentStep(3)
    }
  }, [])

  // Toggle platform selection (multi-select)
  const togglePlatform = (platformValue: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformValue)) {
        if (prev.length === 1) return prev // Keep at least one
        return prev.filter(p => p !== platformValue)
      }
      return [...prev, platformValue]
    })
  }

  // Step 1 → Step 2 (scrape link if provided)
  const handleNext = async () => {
    if (!niche) {
      setError('Please select a niche')
      return
    }
    setError('')

    // Scrape the affiliate link if provided
    if (affiliateLink.trim() && !productInfo) {
      setIsScraping(true)
      try {
        const response = await fetch('/api/scrape-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: affiliateLink }),
        })
        if (response.ok) {
          const data = await response.json()
          setProductInfo(data.productInfo || null)
        }
      } catch (err) {
        console.error('Scrape failed:', err)
        // Continue without product info
      } finally {
        setIsScraping(false)
      }
    }
    
    setCurrentStep(2)
  }

  // Step 2 → Step 1
  const handleBack = () => {
    setError('')
    setCurrentStep(currentStep - 1)
  }

  // Suggest Headlines (AI)
  const handleSuggestHeadlines = async () => {
    setIsSuggesting(true)
    setError('')
    try {
      const response = await fetch('/api/suggest-headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateLink,
          niche: nicheOptions.find(n => n.value === niche)?.label || niche,
          previousHeadlines,
          productInfo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || 'Failed to suggest headlines')
      }

      const data = await response.json()
      setSuggestedHeadlines(data.headlines || [])
      setPreviousHeadlines(prev => [...prev, ...(data.headlines || [])])
    } catch (err: any) {
      setError(err.message || 'Failed to suggest headlines. Please try again.')
      console.error(err)
    } finally {
      setIsSuggesting(false)
    }
  }

  // Suggest Tone (AI)
  const handleSuggestTone = async () => {
    setIsSuggestingTone(true)
    try {
      const nicheLabel = nicheOptions.find(n => n.value === niche)?.label || niche
      const response = await fetch('/api/suggest-headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateLink,
          niche: nicheLabel,
          previousHeadlines: [],
          productInfo,
          suggestTone: true,
          topic,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.suggestedTone) {
          const toneLower = data.suggestedTone.toLowerCase() as ArticleTone
          if (['authoritative', 'conversational', 'bold'].includes(toneLower)) {
            setTone(toneLower)
            setSuggestedTone(toneLower)
            setSuggestedToneReason(data.toneReason || 'Best fit for your niche and topic')
          }
        }
      }
    } catch (err) {
      console.error('Tone suggestion failed:', err)
    } finally {
      setIsSuggestingTone(false)
    }
  }

  // Generate Article
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter or select a topic')
      return
    }

    setError('')
    setIsGenerating(true)
    setGeneratedArticle(null)
    setCurrentStep(3)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platforms: selectedPlatforms,
          tone,
          length: 'long',
          affiliateLink,
          niche: nicheOptions.find(n => n.value === niche)?.label || niche,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || 'Generation failed')
      }

      const data: GeneratedArticle = await response.json()
      setGeneratedArticle(data)
      setEditedContent(data.fullContent)
    } catch (err) {
      setError('Failed to generate article. Please try again.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Save to database
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const isUpdate = !!currentArticle?.id
      const url = isUpdate ? `/api/articles?id=${currentArticle.id}` : '/api/articles'
      const method = isUpdate ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic,
          content: editedContent,
          affiliate_link: affiliateLink,
          niche,
          platform: selectedPlatforms,
          tone,
          length: 'long',
          hook: generatedArticle?.hook || currentArticle?.hook,
          cta: generatedArticle?.cta || currentArticle?.cta,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Failed to save')
      }

      const data = await response.json()
      if (data.article) {
        if (isUpdate) {
          useAppStore.getState().updateArticle(data.article.id, data.article)
        } else {
          useAppStore.getState().addArticle(data.article)
          // Set currentArticle to the newly created one so subsequent saves are updates
          useAppStore.getState().setCurrentArticle(data.article)
        }
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save article. Please try again.')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Create Article
        </h1>
        <p className="text-locus-muted">
          Generate authority-building content in 3 simple steps
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-10 animate-fade-in">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shrink-0
                  ${currentStep === step.number 
                    ? 'bg-linear-to-r from-locus-teal to-locus-emerald text-white shadow-[0_0_20px_rgba(20,184,166,0.3)]' 
                    : currentStep > step.number
                      ? 'bg-locus-teal/20 text-locus-teal border border-locus-teal/30'
                      : 'bg-locus-border text-locus-muted'
                  }
                `}
              >
                {currentStep > step.number ? <Check size={16} /> : step.number}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-white' : 'text-locus-muted'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-locus-muted truncate">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-px flex-1 mx-3 transition-colors duration-300 ${currentStep > step.number ? 'bg-locus-teal/50' : 'bg-locus-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      
      {/* ═══════════════ STEP 1: Link & Niche ═══════════════ */}
      {currentStep === 1 && (
        <div className="animate-fade-in space-y-6">
          {/* Part A: Platform Selection */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <LinkIcon size={20} className="text-locus-teal" />
              Step 1: Link & Niche
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-locus-text mb-3">
                  Choose Your Affiliate Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {affiliatePlatforms.map((platform) => {
                    const isSelected = selectedAffiliatePlatform === platform.value
                    return (
                      <button
                        key={platform.value}
                        onClick={() => {
                          setSelectedAffiliatePlatform(platform.value)
                          setLinkSaved(false)
                        }}
                        className={`
                          flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left
                          ${isSelected
                            ? 'border-locus-teal bg-locus-teal/10 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                            : 'border-locus-border bg-[rgba(255,255,255,0.02)] hover:border-locus-teal/50 hover:bg-[rgba(255,255,255,0.04)]'
                          }
                        `}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-locus-teal/20' : 'bg-locus-border'}`}>
                          <platform.icon size={20} className={isSelected ? 'text-locus-teal' : 'text-locus-muted'} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-locus-text'}`}>
                            {platform.label}
                          </p>
                          <p className="text-xs text-locus-muted truncate">{platform.description}</p>
                        </div>
                        {isSelected && <Check size={16} className="ml-auto text-locus-teal shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Part B: Collapsible Instructions */}
          {selectedAffiliatePlatform && (
            <Card>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb size={16} className="text-locus-teal" />
                  How to Get Your Affiliate Link
                </h3>
                {showInstructions ? (
                  <ChevronUp size={18} className="text-locus-muted" />
                ) : (
                  <ChevronDown size={18} className="text-locus-muted" />
                )}
              </button>

              {showInstructions && (
                <div className="mt-5 space-y-3">
                  {platformInstructions[selectedAffiliatePlatform].steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-locus-teal/20 text-locus-teal flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="text-sm text-locus-text pt-1">
                        {step}
                        {i === 0 && (
                          <a
                            href={platformInstructions[selectedAffiliatePlatform].linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 ml-2 text-locus-teal hover:underline font-medium"
                          >
                            {platformInstructions[selectedAffiliatePlatform].linkLabel}
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Part C: Link Input & Save */}
          {selectedAffiliatePlatform && (
            <Card>
              <div className="space-y-4">
                <Input
                  label="Your Affiliate Link"
                  placeholder="https://example.com/product?ref=your-id"
                  value={affiliateLink}
                  onChange={(e) => {
                    setAffiliateLink(e.target.value)
                    setLinkSaved(false)
                  }}
                />

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      if (!affiliateLink.trim()) return
                      const newLink: AffiliateLinkType = {
                        id: crypto.randomUUID(),
                        platform: selectedAffiliatePlatform,
                        link: affiliateLink.trim(),
                        label: affiliatePlatforms.find(p => p.value === selectedAffiliatePlatform)?.label,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }
                      useAppStore.getState().addAffiliateLink(newLink)
                      setLinkSaved(true)
                    }}
                    disabled={!affiliateLink.trim()}
                    variant={linkSaved ? 'secondary' : 'primary'}
                  >
                    {linkSaved ? <Check size={18} /> : <Save size={18} />}
                    <span>{linkSaved ? 'Link Saved' : 'Save Link'}</span>
                  </Button>

                  {linkSaved && (
                    <span className="text-sm text-locus-teal flex items-center gap-1.5">
                      <CheckCircle2 size={15} />
                      Affiliate link saved successfully
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Part D: Niche Selection */}
          <Card>
            <div className="space-y-6">
              <Select
                label="Niche"
                options={[{ value: '', label: 'Select your niche...' }, ...nicheOptions]}
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />

              {error && (
                <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-locus-error text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button onClick={handleNext} size="lg" loading={isScraping}>
                  <span>{isScraping ? 'Analyzing link...' : 'Next: Topic & Settings'}</span>
                  {!isScraping && <ArrowRight size={18} />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════ STEP 2: Topic & Settings ═══════════════ */}
      {currentStep === 2 && (
        <div className="animate-fade-in space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <PenTool size={20} className="text-locus-teal" />
              Step 2: Topic & Settings
            </h2>

            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <Input
                  label="Topic / Headline"
                  placeholder="e.g., 5 Leadership Lessons from Building a $10M Startup"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />

                {/* AI Suggest Button */}
                <button
                  onClick={handleSuggestHeadlines}
                  disabled={isSuggesting}
                  className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-locus-teal/30 text-locus-teal text-sm font-medium hover:bg-locus-teal/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSuggesting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Lightbulb size={16} />
                  )}
                  {isSuggesting ? 'Generating suggestions...' : 'Suggest 5 Headlines (AI)'}
                </button>

                {/* Suggested Headlines */}
                {suggestedHeadlines.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-locus-muted font-medium uppercase tracking-wider">AI Suggestions — click to select:</p>
                    {suggestedHeadlines.map((headline, i) => (
                      <button
                        key={i}
                        onClick={() => setTopic(headline)}
                        className={`
                          w-full text-left p-3 rounded-xl border text-sm transition-all duration-200
                          ${topic === headline 
                            ? 'border-locus-teal bg-locus-teal/10 text-white' 
                            : 'border-locus-border bg-[rgba(255,255,255,0.02)] text-locus-text hover:border-locus-teal/50 hover:bg-[rgba(255,255,255,0.04)]'
                          }
                        `}
                      >
                        <span className="text-locus-teal font-bold mr-2">{i + 1}.</span>
                        {headline}
                      </button>
                    ))}

                    <button
                      onClick={handleSuggestHeadlines}
                      disabled={isSuggesting}
                      className="flex items-center gap-1.5 text-xs text-locus-muted hover:text-locus-teal transition-colors mt-2"
                    >
                      <RefreshCw size={12} className={isSuggesting ? 'animate-spin' : ''} />
                      Regenerate suggestions
                    </button>
                  </div>
                )}
              </div>

              {/* Tone with AI Suggest */}
              <div>
              <Select
                label="Tone"
                options={toneOptions}
                value={tone}
                onChange={(e) => setTone(e.target.value as ArticleTone)}
              />
                <button
                  onClick={handleSuggestTone}
                  disabled={isSuggestingTone}
                  className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl border border-locus-teal/30 text-locus-teal text-xs font-medium hover:bg-locus-teal/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSuggestingTone ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {isSuggestingTone ? 'Analyzing...' : 'Suggest Best Tone (AI)'}
                </button>
                {suggestedTone && (
                  <p className="mt-2 text-xs text-locus-teal flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    AI recommends: <strong>{suggestedTone.charAt(0).toUpperCase() + suggestedTone.slice(1)}</strong> — {suggestedToneReason}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-locus-error text-sm">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-2">
                <Button onClick={handleBack} variant="secondary">
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </Button>
                <Button onClick={handleGenerate} size="lg" loading={isGenerating}>
                  <Sparkles size={18} />
                  <span>{isGenerating ? 'Generating...' : 'Generate Article'}</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════ STEP 3: Generated Article ═══════════════ */}
      {currentStep === 3 && (
        <div className="animate-fade-in">
          <Card className="flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-locus-cyan" />
              Step 3: Your Article
            </h2>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-r from-locus-teal to-locus-cyan flex items-center justify-center mb-6 animate-pulse">
                  <Sparkles className="text-white animate-spin" size={32} />
                </div>
                <p className="text-white font-medium mb-2 transition-all duration-500" key={loadingMessageIndex}>
                  {loadingMessages[loadingMessageIndex]}
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  {loadingMessages.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === loadingMessageIndex ? 'bg-locus-teal scale-125' : 'bg-locus-border'}`} />
                  ))}
                </div>
              </div>
            ) : generatedArticle ? (
              <>
                {/* WYSIWYG Editor */}
                <div className="mb-8 relative">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => setEditedContent(e.currentTarget.innerHTML)}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName.toLowerCase() === 'a') {
                        e.preventDefault();
                        window.open((target as HTMLAnchorElement).href, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="w-full h-[550px] bg-[rgba(255,255,255,0.02)] border border-locus-border rounded-2xl p-8 outline-none focus:border-locus-teal focus:ring-1 focus:ring-locus-teal/50 transition-all overflow-y-auto scrollbar-custom editor-content prose-locus editor-cursor-behavior"
                    ref={(el) => {
                      // Only set innerHTML if it's different and if it's currently empty or strictly matching the current state
                      // This avoids resetting the cursor position when typing
                      if (el && el.innerHTML !== editedContent) {
                        el.innerHTML = editedContent;
                      }
                    }}
                  />
                  <div className="absolute top-4 right-4 text-[10px] text-locus-muted uppercase tracking-widest opacity-50">
                    Live Editor
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-locus-error text-sm mb-4">
                    {error}
                  </div>
                )}

                {saved && (
                  <div className="p-3 rounded-xl bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.3)] text-locus-teal text-sm mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Article saved successfully!
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleBack} variant="secondary">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                  </Button>

                  <div className="flex-1" />

                  <Button onClick={handleCopy} variant="secondary">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>

                  <Button onClick={handleGenerate} variant="ghost">
                    <RefreshCw size={18} />
                    <span>Regenerate</span>
                  </Button>

                  <Button onClick={handleSave} loading={isSaving}>
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    <span>{saved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Article'}</span>
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (generatedArticle && !currentArticle) {
                        handleSave()
                      }
                      router.push('/images')
                    }}
                  >
                    <Image size={18} />
                    <span>Generate Images</span>
                  </Button>

                  {currentArticle && (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        useAppStore.getState().setCurrentArticle(null);
                        window.location.reload();
                      }}
                    >
                      <PenTool size={18} />
                      <span>New Article</span>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-locus-border flex items-center justify-center mb-4">
                  <PenTool className="text-locus-muted" size={28} />
                </div>
                <p className="text-locus-muted mb-2">No article generated yet</p>
                <p className="text-sm text-locus-muted opacity-75">
                  Go back and click Generate to create your article
                </p>
                <Button onClick={handleBack} variant="secondary" className="mt-4">
                  <ArrowLeft size={18} />
                  <span>Back to Settings</span>
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
