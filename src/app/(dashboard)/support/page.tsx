'use client'

import { useState } from 'react'
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  FileText, 
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Send,
  Zap,
  BookOpen,
  Video,
  Users
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

const faqs = [
  {
    id: '1',
    question: 'How does Burst generate articles?',
    answer: 'Burst uses advanced AI (powered by GPT-4) to generate publication-ready articles based on your topic, chosen platform, tone, and length preferences. The AI understands authority positioning and creates content optimized for engagement on each platform.',
    category: 'general'
  },
  {
    id: '2',
    question: 'Does Burst auto-post to my social accounts?',
    answer: 'No, Burst does NOT auto-post to any platform. This is by design to keep your accounts safe and compliant with platform terms of service. You copy the generated content and manually post it yourself, maintaining full control over what gets published.',
    category: 'general'
  },
  {
    id: '3',
    question: 'What platforms is the content optimized for?',
    answer: 'Burst optimizes content for LinkedIn, Medium, Substack, and general publications. Each platform has different best practices for formatting, length, and engagement tactics, and Burst tailors the output accordingly.',
    category: 'features'
  },
  {
    id: '4',
    question: 'How do I unlock premium features?',
    answer: 'Premium features like 10X Mode, Infinite Mode, Automation, and Done-For-You content packs can be unlocked through their respective unlock pages. Simply enter your email and click unlock to gain access.',
    category: 'features'
  },
  {
    id: '5',
    question: 'Can I edit the generated content?',
    answer: 'Absolutely! All generated content is fully editable. We encourage you to personalize the content with your own experiences, examples, and voice before publishing to make it authentically yours.',
    category: 'features'
  },
  {
    id: '6',
    question: 'Is there a limit on how many articles I can generate?',
    answer: 'The free tier has a reasonable limit on generations. You can unlock unlimited generations with Infinite Mode, which removes all caps and throttling.',
    category: 'billing'
  },
  {
    id: '7',
    question: 'How do I connect my OpenAI API key?',
    answer: 'You can add your OpenAI API key in the settings. This allows you to use your own API credits for generation. Your key is stored securely and never shared.',
    category: 'technical'
  },
  {
    id: '8',
    question: 'What if I need help with content strategy?',
    answer: 'Check out our Training Center for comprehensive courses on content strategy, platform mastery, and advanced tactics. We also offer Done-For-You content packs if you want ready-made authority content.',
    category: 'general'
  },
]

const categories = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'features', label: 'Features' },
  { id: 'billing', label: 'Billing' },
  { id: 'technical', label: 'Technical' },
]

const resources = [
  {
    title: 'Training Center',
    description: 'Learn content strategy and platform mastery',
    icon: Video,
    href: '/training',
    gradient: 'from-[var(--color-burst-purple)] to-[var(--color-burst-indigo)]'
  },
  {
    title: 'Documentation',
    description: 'Detailed guides and API reference',
    icon: BookOpen,
    href: '#',
    gradient: 'from-[var(--color-burst-cyan)] to-[var(--color-burst-blue)]'
  },
  {
    title: 'Community',
    description: 'Join other Burst users',
    icon: Users,
    href: '#',
    gradient: 'from-[var(--color-burst-pink)] to-[var(--color-burst-purple)]'
  },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({ subject: '', message: '' })
  const [messageSent, setMessageSent] = useState(false)

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending message
    setMessageSent(true)
    setTimeout(() => {
      setMessageSent(false)
      setContactForm({ subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] flex items-center justify-center">
            <HelpCircle size={20} className="text-white" />
          </div>
          <Badge variant="purple">Support Center</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          How Can We Help?
        </h1>
        <p className="text-[var(--color-burst-muted)]">
          Find answers, get support, and learn how to maximize your results with Burst
        </p>
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {resources.map((resource, index) => (
          <Card 
            key={resource.title}
            className="animate-fade-in cursor-pointer group"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => resource.href !== '#' && window.location.assign(resource.href)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${resource.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <resource.icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-[var(--color-burst-purple)] transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-[var(--color-burst-muted)]">
                  {resource.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h2>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={18} />}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                      ${selectedCategory === cat.id 
                        ? 'bg-[var(--color-burst-purple)] text-white' 
                        : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-burst-muted)] hover:text-white'
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <Card 
                  key={faq.id}
                  className="animate-fade-in p-0 overflow-hidden"
                  style={{ animationDelay: `${(index + 3) * 0.05}s` }}
                  hover={false}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <span className="font-medium text-white pr-4">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp size={20} className="text-[var(--color-burst-purple)] flex-shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-[var(--color-burst-muted)] flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-5 pb-5 text-sm text-[var(--color-burst-muted)] border-t border-[var(--color-burst-border)] pt-4">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <Card className="text-center py-12">
                <HelpCircle size={40} className="text-[var(--color-burst-muted)] mx-auto mb-4" />
                <p className="text-[var(--color-burst-muted)]">No questions match your search</p>
              </Card>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Card className="sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-white">Contact Support</h3>
            </div>

            {messageSent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[var(--color-burst-success)] flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Message Sent!</h4>
                <p className="text-sm text-[var(--color-burst-muted)]">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <Input
                  label="Subject"
                  placeholder="What do you need help with?"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-[var(--color-burst-text)] mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Describe your issue or question..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full h-32 bg-[rgba(255,255,255,0.03)] border border-[var(--color-burst-border)] rounded-xl p-4 text-[var(--color-burst-text)] text-sm placeholder:text-[var(--color-burst-muted)] focus:outline-none focus:border-[var(--color-burst-purple)] resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send size={16} />
                  <span>Send Message</span>
                </Button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[var(--color-burst-border)]">
              <p className="text-xs text-[var(--color-burst-muted)] mb-3">Other ways to reach us:</p>
              <a 
                href="mailto:support@burst.app" 
                className="flex items-center gap-2 text-sm text-[var(--color-burst-text)] hover:text-[var(--color-burst-purple)] transition-colors"
              >
                <Mail size={14} />
                support@burst.app
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
