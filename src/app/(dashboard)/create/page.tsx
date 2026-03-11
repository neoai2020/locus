'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PenTool, 
  Sparkles, 
  Linkedin, 
  FileText, 
  Mail, 
  Globe,
  Copy,
  Save,
  Image,
  Check,
  RefreshCw
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { Platform, ArticleTone, ArticleLength, Article, GeneratedArticle } from '@/types'

const platformOptions = [
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'medium', label: 'Medium', icon: FileText },
  { value: 'substack', label: 'Substack', icon: Mail },
  { value: 'general', label: 'General Publication', icon: Globe },
]

const toneOptions = [
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'bold', label: 'Bold' },
]

const lengthOptions = [
  { value: 'short', label: 'Short (~500 words)' },
  { value: 'medium', label: 'Medium (~1000 words)' },
  { value: 'long', label: 'Long (~1500 words)' },
]

export default function CreateArticlePage() {
  const router = useRouter()
  const { addArticle, setCurrentArticle, isGenerating, setIsGenerating } = useAppStore()
  
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<Platform>('linkedin')
  const [tone, setTone] = useState<ArticleTone>('authoritative')
  const [length, setLength] = useState<ArticleLength>('medium')
  
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setError('')
    setIsGenerating(true)
    setGeneratedArticle(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, length }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data: GeneratedArticle = await response.json()
      setGeneratedArticle(data)
      setEditedContent(data.fullContent)
    } catch (err) {
      setError('Failed to generate article. Please check your API key and try again.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    const article: Article = {
      id: crypto.randomUUID(),
      user_id: '',
      title: topic,
      content: editedContent,
      platform,
      tone,
      length,
      status: 'draft',
      hook: generatedArticle?.hook,
      cta: generatedArticle?.cta,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addArticle(article)
    setCurrentArticle(article)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleEnhanceWithImages = () => {
    if (generatedArticle) {
      const article: Article = {
        id: crypto.randomUUID(),
        user_id: '',
        title: topic,
        content: editedContent,
        platform,
        tone,
        length,
        status: 'draft',
        hook: generatedArticle.hook,
        cta: generatedArticle.cta,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setCurrentArticle(article)
      router.push('/images')
    }
  }

  const SelectedPlatformIcon = platformOptions.find(p => p.value === platform)?.icon || Globe

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Create Article
        </h1>
        <p className="text-[var(--color-locus-muted)]">
          Generate authority-building content optimized for your target platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6 animate-fade-in stagger-1">
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <PenTool size={20} className="text-[var(--color-locus-teal)]" />
              Article Settings
            </h2>

            <div className="space-y-5">
              {/* Topic Input */}
              <Input
                label="Topic / Headline"
                placeholder="e.g., 5 Leadership Lessons from Building a $10M Startup"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-locus-text)] mb-3">
                  Target Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platformOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPlatform(option.value as Platform)}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl border transition-all duration-200
                        ${platform === option.value 
                          ? 'border-[var(--color-locus-teal)] bg-[rgba(20,184,166,0.1)]' 
                          : 'border-[var(--color-locus-border)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--color-locus-teal)] hover:border-opacity-50'
                        }
                      `}
                    >
                      <option.icon size={20} className={platform === option.value ? 'text-[var(--color-locus-teal)]' : 'text-[var(--color-locus-muted)]'} />
                      <span className={platform === option.value ? 'text-white' : 'text-[var(--color-locus-muted)]'}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selection */}
              <Select
                label="Tone"
                options={toneOptions}
                value={tone}
                onChange={(e) => setTone(e.target.value as ArticleTone)}
              />

              {/* Length Selection */}
              <Select
                label="Length"
                options={lengthOptions}
                value={length}
                onChange={(e) => setLength(e.target.value as ArticleLength)}
              />

              {error && (
                <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[var(--color-locus-error)] text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                className="w-full"
                size="lg"
              >
                <Sparkles size={18} />
                <span>{isGenerating ? 'Generating...' : 'Generate Article'}</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="animate-fade-in stagger-2">
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <SelectedPlatformIcon size={20} className="text-[var(--color-locus-cyan)]" />
                Generated Article
              </h2>
              {generatedArticle && (
                <Badge variant="cyan">{platform}</Badge>
              )}
            </div>

            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] flex items-center justify-center mb-4 animate-pulse-glow">
                  <Sparkles className="text-white animate-spin" size={28} />
                </div>
                <p className="text-[var(--color-locus-muted)]">Creating your authority article...</p>
              </div>
            ) : generatedArticle ? (
              <>
                {/* Editor */}
                <div className="flex-1 mb-6">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-[400px] bg-[rgba(255,255,255,0.02)] border border-[var(--color-locus-border)] rounded-xl p-4 text-[var(--color-locus-text)] text-sm leading-relaxed focus:outline-none focus:border-[var(--color-locus-teal)] resize-none"
                    placeholder="Your article will appear here..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleCopy} variant="secondary">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>

                  <Button onClick={handleSave} variant="secondary">
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    <span>{saved ? 'Saved!' : 'Save Draft'}</span>
                  </Button>

                  <Button onClick={handleEnhanceWithImages} variant="secondary">
                    <Image size={18} />
                    <span>Enhance with Images</span>
                  </Button>

                  <Button onClick={handleGenerate} variant="ghost">
                    <RefreshCw size={18} />
                    <span>Regenerate</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-locus-border)] flex items-center justify-center mb-4">
                  <PenTool className="text-[var(--color-locus-muted)]" size={28} />
                </div>
                <p className="text-[var(--color-locus-muted)] mb-2">No article generated yet</p>
                <p className="text-sm text-[var(--color-locus-muted)] opacity-75">
                  Enter a topic and click Generate to create your article
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
