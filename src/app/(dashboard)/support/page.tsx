'use client'

import { useState } from 'react'
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  Video,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

const faqs = [
  {
    id: '1',
    question: 'What is Locus?',
    answer: 'Locus is an AI-powered content platform that helps you create SEO-optimized authority articles (approx. 1,500 words each), generate professional images, and publish across LinkedIn, Medium, Quora, Reddit, and X (Twitter) — all designed to drive traffic and earn commissions through your promotional links.',
    category: 'general',
  },
  {
    id: '2',
    question: 'How do I create my first article?',
    answer: 'Go to "Create Article" from the sidebar. In Step 1, add your promotional link (or pick one from My Portfolio) and select a niche. In Step 2, choose a topic and tone — you can also use "Suggest Best Tone (AI)" for an AI recommendation. In Step 3, the AI writes a complete 1,500-word article. Save it, generate images, and publish.',
    category: 'general',
  },
  {
    id: '3',
    question: 'Do I need any writing or SEO experience?',
    answer: 'No. Locus handles all the writing and SEO optimization for you. The AI generates complete, publish-ready articles. You just provide a topic and optionally a promotional link.',
    category: 'general',
  },
  {
    id: '4',
    question: 'What platforms can I publish to?',
    answer: 'Locus supports publishing to LinkedIn, Medium, Quora, Reddit, and X (Twitter). Each platform comes with detailed step-by-step instructions, SEO ranking tips, and AI-suggested tags/hashtags to maximize your reach.',
    category: 'general',
  },
  {
    id: '5',
    question: 'Does Locus post articles automatically?',
    answer: 'No. Locus provides "Copy Article" and "Download Images" buttons so you can paste the content directly into each platform yourself. This keeps your accounts safe and compliant with platform terms of service. Detailed instructions guide you through each platform.',
    category: 'general',
  },
  {
    id: '6',
    question: 'How do images work?',
    answer: 'After saving an article, click "Generate Images" to go to the Images page. For each section (Header, Mid-Article, Conclusion), you can generate 3 AI image options and pick one, or upload your own image. Selected images are saved with the article and can be downloaded at any time from My Portfolio or the Publish page.',
    category: 'features',
  },
  {
    id: '7',
    question: 'What is a promotional link?',
    answer: 'A promotional link is any URL you want placed in your article — such as an affiliate link from Digistore24, Amazon, Etsy, or eBay, or any product/service/landing page link. It\'s optional — you can write articles without one.',
    category: 'features',
  },
  {
    id: '8',
    question: 'Where do I manage my saved links and articles?',
    answer: 'Go to "My Portfolio" from the sidebar. It has two tabs: "Articles" shows all your saved articles (with image thumbnails and download options), and "Promotional Links" lets you create, edit, copy, and delete your saved links.',
    category: 'features',
  },
  {
    id: '9',
    question: 'Can I edit articles after they are generated?',
    answer: 'Yes. After an article is generated, you can edit the content directly. All saved articles are available in "My Portfolio" where you can make changes, regenerate images, or publish at any time.',
    category: 'features',
  },
  {
    id: '10',
    question: 'What is 10X Mode?',
    answer: '10X Mode is a premium feature that generates 10 unique, high-converting Facebook posts from a single promotional link. Each post uses a different angle (urgency, social proof, storytelling, curiosity, etc.) and comes with tips on how to share effectively in Facebook groups for maximum reach.',
    category: 'premium',
  },
  {
    id: '11',
    question: 'What is Infinite Mode?',
    answer: 'Infinite Mode is a premium feature with 100 pre-written, SEO-optimized authority articles across 10 profitable niches — each with 3 professional images already included. Just add your promotional link (it replaces placeholders automatically), save, and publish.',
    category: 'premium',
  },
  {
    id: '12',
    question: 'What is Done-For-You (DFY)?',
    answer: 'Done-For-You is a premium library of fully written articles with 10 social media posts per article and a share directory for each niche. Add your promotional link and it gets applied to the article content and all social posts automatically.',
    category: 'premium',
  },
  {
    id: '13',
    question: 'What is Automation Mode?',
    answer: 'Automation Mode is a premium feature that lets you set up content workflows to generate articles on a schedule. Set your niche, tone, and platforms, and Locus creates content automatically.',
    category: 'premium',
  },
  {
    id: '14',
    question: 'How do I unlock premium features?',
    answer: 'Premium features (10X, Infinite, Automation, Done-For-You) are shown in the sidebar with a lock icon. Click on any locked feature to see details and unlock it.',
    category: 'premium',
  },
  {
    id: '15',
    question: 'How do I contact support?',
    answer: 'Use the contact form on this page, or email us directly at locusAI@neoai.freshdesk.com. We typically respond within 24 hours.',
    category: 'account',
  },
  {
    id: '16',
    question: 'Can I use Locus on mobile?',
    answer: 'Yes. Locus is fully responsive and works on any device — desktop, tablet, or phone. The interface adapts to your screen size automatically.',
    category: 'account',
  },
  {
    id: '17',
    question: 'Is my data secure?',
    answer: 'Yes. Locus uses Supabase for secure authentication and data storage. Your articles, links, and account data are encrypted and protected.',
    category: 'account',
  },
  {
    id: '18',
    question: 'What is the AI Tone Suggestion?',
    answer: 'In Step 2 of article creation, click "Suggest Best Tone (AI)" and the AI will analyze your topic and recommend the most effective tone (authoritative, conversational, or bold) with an explanation of why it works best for your article.',
    category: 'features',
  },
]

const categories = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'features', label: 'Features' },
  { id: 'premium', label: 'Premium' },
  { id: 'account', label: 'Account' },
]

const resources = [
  {
    title: 'Training Center',
    description: 'Watch video tutorials and learn the platform',
    icon: Video,
    href: '/training',
    gradient: 'from-[var(--color-locus-teal)] to-[var(--color-locus-indigo)]',
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
    const mailtoLink = `mailto:locusAI@neoai.freshdesk.com?subject=${encodeURIComponent(contactForm.subject)}&body=${encodeURIComponent(contactForm.message)}`
    window.open(mailtoLink, '_blank')
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] flex items-center justify-center">
            <HelpCircle size={20} className="text-white" />
          </div>
          <Badge variant="purple">Support Center</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          How Can We Help?
        </h1>
        <p className="text-[var(--color-locus-muted)]">
          Find answers, get support, and learn how to maximize your results with Locus
        </p>
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 gap-4 mb-10">
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
                <h3 className="font-semibold text-white mb-1 group-hover:text-[var(--color-locus-teal)] transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-[var(--color-locus-muted)]">
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
                        ? 'bg-[var(--color-locus-teal)] text-white' 
                        : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-locus-muted)] hover:text-white'
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
                      <ChevronUp size={20} className="text-[var(--color-locus-teal)] flex-shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-[var(--color-locus-muted)] flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-5 pb-5 text-sm text-[var(--color-locus-muted)] border-t border-[var(--color-locus-border)] pt-4">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <Card className="text-center py-12">
                <HelpCircle size={40} className="text-[var(--color-locus-muted)] mx-auto mb-4" />
                <p className="text-[var(--color-locus-muted)]">No questions match your search</p>
              </Card>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Card className="sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-white">Contact Support</h3>
            </div>

            {messageSent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[var(--color-locus-success)] flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Message Sent!</h4>
                <p className="text-sm text-[var(--color-locus-muted)]">
                  We&apos;ll get back to you within 24 hours.
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
                  <label className="block text-sm font-medium text-[var(--color-locus-text)] mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Describe your issue or question..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full h-32 bg-[rgba(255,255,255,0.03)] border border-[var(--color-locus-border)] rounded-xl p-4 text-[var(--color-locus-text)] text-sm placeholder:text-[var(--color-locus-muted)] focus:outline-none focus:border-[var(--color-locus-teal)] resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send size={16} />
                  <span>Send Message</span>
                </Button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[var(--color-locus-border)]">
              <p className="text-xs text-[var(--color-locus-muted)] mb-3">Or email us directly:</p>
              <a 
                href="mailto:locusAI@neoai.freshdesk.com" 
                className="flex items-center gap-2 text-sm text-[var(--color-locus-text)] hover:text-[var(--color-locus-teal)] transition-colors"
              >
                <Mail size={14} />
                locusAI@neoai.freshdesk.com
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
