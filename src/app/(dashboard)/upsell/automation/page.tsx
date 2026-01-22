'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bot, 
  Sparkles, 
  FileText,
  Linkedin,
  Mail,
  Globe,
  Check,
  ArrowRight,
  Wand2
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'

const templates = [
  {
    id: 'thought-leader',
    name: 'Thought Leadership',
    description: 'Establish authority with insights and opinions',
    platform: 'linkedin',
    structure: ['Bold opening statement', 'Personal experience', '3 key insights', 'Engagement question'],
    icon: Linkedin
  },
  {
    id: 'how-to',
    name: 'How-To Guide',
    description: 'Step-by-step tutorials that provide value',
    platform: 'medium',
    structure: ['Problem statement', 'Prerequisites', 'Step-by-step guide', 'Pro tips', 'Conclusion'],
    icon: FileText
  },
  {
    id: 'newsletter',
    name: 'Newsletter Edition',
    description: 'Engaging updates for your subscribers',
    platform: 'substack',
    structure: ['Personal intro', 'Main topic', 'Quick wins', 'Resource links', 'Sign-off'],
    icon: Mail
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Showcase results and success stories',
    platform: 'general',
    structure: ['Challenge', 'Solution', 'Results', 'Key takeaways', 'CTA'],
    icon: Globe
  },
]

const presets = [
  { id: 'linkedin-post', name: 'LinkedIn Post', wordCount: '300-500', tone: 'Conversational' },
  { id: 'medium-article', name: 'Medium Article', wordCount: '1000-1500', tone: 'Educational' },
  { id: 'newsletter', name: 'Newsletter', wordCount: '500-800', tone: 'Personal' },
  { id: 'guest-post', name: 'Guest Post', wordCount: '1500-2000', tone: 'Authoritative' },
]

export default function AutomationPage() {
  const router = useRouter()
  const { isUpsellUnlocked, setCurrentArticle } = useAppStore()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Redirect if not unlocked
  if (!isUpsellUnlocked('automation')) {
    router.push('/unlock/automation')
    return null
  }

  const handleUseTemplate = async (templateId: string) => {
    setSelectedTemplate(templateId)
    setIsGenerating(true)
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const template = templates.find(t => t.id === templateId)
    if (template) {
      // Would normally generate content based on template
      router.push('/create')
    }
    
    setIsGenerating(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <Badge variant="success">Automation Active</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Automation Workflows
        </h1>
        <p className="text-[var(--color-burst-muted)]">
          Speed up your content creation with templates and presets
        </p>
      </div>

      {/* Templates */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Content Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template, index) => (
            <Card 
              key={template.id}
              className="animate-fade-in cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleUseTemplate(template.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-burst-border)] flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-500 transition-all">
                    <template.icon size={20} className="text-[var(--color-burst-muted)] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{template.name}</h3>
                    <p className="text-sm text-[var(--color-burst-muted)]">{template.description}</p>
                  </div>
                </div>
                <Badge variant="cyan">{template.platform}</Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-[var(--color-burst-muted)] uppercase tracking-wider">Structure</p>
                {template.structure.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-burst-text)]">
                    <span className="w-5 h-5 rounded-full bg-[rgba(139,92,246,0.2)] text-[var(--color-burst-purple)] text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--color-burst-border)]">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  loading={isGenerating && selectedTemplate === template.id}
                >
                  <Wand2 size={16} />
                  <span>Use Template</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Presets */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Platform Presets
        </h2>
        <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => router.push('/create')}
                className="p-4 rounded-xl border border-[var(--color-burst-border)] hover:border-[var(--color-burst-purple)] hover:bg-[rgba(139,92,246,0.05)] transition-all text-left group"
              >
                <h4 className="font-medium text-white mb-2 group-hover:text-[var(--color-burst-purple)]">
                  {preset.name}
                </h4>
                <div className="space-y-1 text-xs text-[var(--color-burst-muted)]">
                  <p>Words: {preset.wordCount}</p>
                  <p>Tone: {preset.tone}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Note */}
      <Card className="mt-8 animate-fade-in border-[var(--color-burst-border)]" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.15)] flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-[var(--color-burst-purple)]" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Platform Compliant</h3>
            <p className="text-sm text-[var(--color-burst-muted)]">
              Automation helps you work faster, but you still manually post content. 
              This keeps your accounts safe and in compliance with platform terms.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
