'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Zap, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { Platform, ArticleTone, ArticleLength } from '@/types'

const hookStyles = [
  { id: 'question', label: 'Question Hook', description: 'Start with a thought-provoking question' },
  { id: 'statistic', label: 'Statistic Hook', description: 'Lead with a surprising data point' },
  { id: 'story', label: 'Story Hook', description: 'Open with a personal anecdote' },
  { id: 'contrarian', label: 'Contrarian Hook', description: 'Challenge conventional wisdom' },
  { id: 'bold', label: 'Bold Statement', description: 'Make a strong, attention-grabbing claim' },
]

export default function TenXPage() {
  const router = useRouter()
  const { isUpsellUnlocked } = useAppStore()
  
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<Platform>('linkedin')
  const [selectedHooks, setSelectedHooks] = useState<string[]>(['question', 'statistic', 'story'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [variations, setVariations] = useState<Array<{ id: string; hook: string; hookType: string; content: string }>>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  // Check if unlocked and redirect if not
  useEffect(() => {
    if (!isUpsellUnlocked('10x')) {
      router.push('/unlock/10x')
    } else {
      setIsChecking(false)
    }
  }, [isUpsellUnlocked, router])

  // Show loading while checking unlock status
  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-locus-border)] animate-pulse" />
      </div>
    )
  }

  const toggleHook = (hookId: string) => {
    setSelectedHooks(prev => 
      prev.includes(hookId) 
        ? prev.filter(h => h !== hookId)
        : [...prev, hookId]
    )
  }

  const handleGenerate = async () => {
    if (!topic.trim() || selectedHooks.length === 0) return
    
    setIsGenerating(true)
    setVariations([])

    // Simulate generating variations
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockVariations = selectedHooks.map((hookType, index) => ({
      id: crypto.randomUUID(),
      hookType,
      hook: hookStyles.find(h => h.id === hookType)?.label || hookType,
      content: `[${hookStyles.find(h => h.id === hookType)?.label}]\n\n${generateMockContent(hookType, topic)}`
    }))

    setVariations(mockVariations)
    setIsGenerating(false)
  }

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <Badge variant="warning">10X Mode</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          10X Article Generator
        </h1>
        <p className="text-[var(--color-locus-muted)]">
          Generate multiple hook variations to A/B test your content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="space-y-6 animate-fade-in stagger-1">
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">Settings</h2>
            
            <div className="space-y-5">
              <Input
                label="Topic"
                placeholder="e.g., Building a personal brand on LinkedIn"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-[var(--color-locus-text)] mb-3">
                  Hook Styles ({selectedHooks.length} selected)
                </label>
                <div className="space-y-2">
                  {hookStyles.map((hook) => (
                    <button
                      key={hook.id}
                      onClick={() => toggleHook(hook.id)}
                      className={`
                        w-full p-3 rounded-xl border text-left transition-all duration-200
                        ${selectedHooks.includes(hook.id)
                          ? 'border-[var(--color-locus-teal)] bg-[rgba(20,184,166,0.1)]'
                          : 'border-[var(--color-locus-border)] hover:border-[var(--color-locus-teal)] hover:border-opacity-50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className={selectedHooks.includes(hook.id) ? 'text-white' : 'text-[var(--color-locus-muted)]'}>
                          {hook.label}
                        </span>
                        {selectedHooks.includes(hook.id) && (
                          <Check size={16} className="text-[var(--color-locus-teal)]" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-locus-muted)] mt-1">
                        {hook.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                className="w-full"
                size="lg"
                disabled={!topic.trim() || selectedHooks.length === 0}
              >
                <Sparkles size={18} />
                <span>Generate {selectedHooks.length} Variations</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 animate-fade-in stagger-2">
          {isGenerating ? (
            <Card className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mb-4 animate-pulse-glow">
                <Sparkles className="text-white animate-spin" size={28} />
              </div>
              <p className="text-[var(--color-locus-muted)]">
                Generating {selectedHooks.length} variations...
              </p>
            </Card>
          ) : variations.length > 0 ? (
            <div className="space-y-4">
              {variations.map((variation, index) => (
                <Card 
                  key={variation.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">{variation.hook}</Badge>
                      <span className="text-sm text-[var(--color-locus-muted)]">
                        Variation {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopy(variation.id, variation.content)}
                      >
                        {copiedId === variation.id ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(expandedId === variation.id ? null : variation.id)}
                      >
                        {expandedId === variation.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className={`
                    text-sm text-[var(--color-locus-text)] whitespace-pre-wrap
                    ${expandedId === variation.id ? '' : 'line-clamp-4'}
                  `}>
                    {variation.content}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-locus-border)] flex items-center justify-center mb-4">
                <Zap className="text-[var(--color-locus-muted)]" size={28} />
              </div>
              <p className="text-[var(--color-locus-muted)] mb-2">No variations generated yet</p>
              <p className="text-sm text-[var(--color-locus-muted)] opacity-75">
                Select hook styles and click generate to create variations
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function generateMockContent(hookType: string, topic: string): string {
  const hooks: Record<string, string> = {
    question: `What if I told you that ${topic} could transform your career in just 30 days?\n\nMost people never discover this because they're too busy following outdated advice.\n\nHere's what I learned after 5 years of trial and error:`,
    statistic: `93% of professionals fail at ${topic}.\n\nNot because they lack talent. Not because they don't work hard.\n\nBecause they make these 3 critical mistakes:`,
    story: `Two years ago, I was completely lost with ${topic}.\n\nI had tried everything. Read every book. Attended every webinar.\n\nThen something changed. Here's exactly what happened:`,
    contrarian: `Everything you've been told about ${topic} is wrong.\n\nThe "experts" are still teaching methods from 2015.\n\nMeanwhile, the top 1% are doing this instead:`,
    bold: `${topic} will make or break your success in 2024.\n\nThis isn't hyperbole. It's a fact.\n\nHere's the blueprint that changed everything for me:`,
  }
  
  return hooks[hookType] || hooks.question
}
