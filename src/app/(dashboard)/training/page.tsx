'use client'

import { useState } from 'react'
import { 
  GraduationCap, 
  Play, 
  Clock, 
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Video,
  MessageCircle,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const trainingVideos = [
  {
    id: 'intro',
    title: 'Intro — Welcome to Locus',
    description: 'A quick introduction to Locus and what you can achieve with the platform.',
    vimeoId: '1173102148',
    duration: '3 min',
  },
  {
    id: 'create-article',
    title: 'How to Create an Article',
    description: 'Step-by-step walkthrough of creating your first authority article with AI.',
    vimeoId: '1173095230',
    duration: '5 min',
  },
  {
    id: 'publish-earn',
    title: 'How to Publish & Earn',
    description: 'Learn how to publish your articles and start earning with promotional links.',
    vimeoId: '1173095468',
    duration: '5 min',
  },
  {
    id: '10x-mode',
    title: 'Premium — 10X Mode',
    description: 'Learn how to use 10X Mode to generate 10 high-converting Facebook posts from a single link.',
    vimeoId: '1173173582',
    duration: '4 min',
  },
]

const faqItems = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Locus?',
        a: 'Locus is an AI-powered content platform that helps you create SEO-optimized authority articles, generate professional images, and publish across multiple platforms — all designed to drive traffic and earn commissions through your promotional links.',
      },
      {
        q: 'How do I create my first article?',
        a: 'Go to "Create Article" from the sidebar. In Step 1, add your promotional link and select a niche. In Step 2, choose a topic and tone. In Step 3, the AI writes a complete 1,500-word article. You can then save it, generate images, and publish.',
      },
      {
        q: 'Do I need any writing experience?',
        a: 'No. Locus handles all the writing for you. The AI generates complete, publish-ready articles optimized for SEO and engagement. You just need to provide a topic and your promotional link.',
      },
      {
        q: 'What platforms can I publish to?',
        a: 'Locus supports publishing to LinkedIn, Medium, Quora, Reddit, and X (Twitter). Each platform comes with detailed instructions, SEO tips, and AI-suggested tags to maximize your reach.',
      },
    ],
  },
  {
    category: 'Articles & Content',
    questions: [
      {
        q: 'How long are the articles?',
        a: 'All articles are approximately 1,500 words — the ideal length for SEO ranking and reader engagement. This length is long enough to be authoritative but concise enough to hold attention.',
      },
      {
        q: 'Can I edit articles after they are generated?',
        a: 'Yes. After an article is generated, you can edit the content directly. Your saved articles are available in "My Portfolio" where you can make changes at any time before publishing.',
      },
      {
        q: 'How do images work?',
        a: 'After saving an article, click "Generate Images" to go to the Images page. For each section (Header, Mid-Article, Conclusion), you can generate 3 AI image options and pick one, or upload your own image. Images are saved with the article.',
      },
      {
        q: 'What is the AI Tone Suggestion?',
        a: 'In Step 2 of article creation, click "Suggest Best Tone (AI)" and the AI will analyze your topic and recommend the most effective tone (authoritative, conversational, or bold) with an explanation of why it works best.',
      },
    ],
  },
  {
    category: 'Promotional Links',
    questions: [
      {
        q: 'What is a promotional link?',
        a: 'A promotional link is any URL you want placed in your article — such as an affiliate link from Digistore24, Amazon, Etsy, or eBay, or any other product/service link you want to promote.',
      },
      {
        q: 'How do I add a promotional link?',
        a: 'In Step 1 of "Create Article", enter a name and URL for your link. You can also save it to your portfolio for reuse. The AI will naturally weave the link into your article content.',
      },
      {
        q: 'Where do I manage my saved links?',
        a: 'Go to "My Portfolio" from the sidebar, then click the "Promotional Links" tab. There you can create new links, edit existing ones, copy them, or delete them.',
      },
      {
        q: 'Do I need an affiliate link to use Locus?',
        a: 'No. You can use any promotional link — affiliate links, your own product pages, landing pages, or even just write articles without links. The link is optional in Step 1.',
      },
    ],
  },
  {
    category: 'Publishing',
    questions: [
      {
        q: 'How does the Publish page work?',
        a: 'The Publish page is a 3-step flow: (1) Select your article, (2) Choose a platform (LinkedIn, Quora, Medium, Reddit, or X), and (3) Get detailed posting instructions, SEO ranking tips, and AI-generated tags/hashtags for that platform.',
      },
      {
        q: 'Does Locus post articles automatically?',
        a: 'Locus provides a "Copy Article" button and "Download Images" so you can paste the content directly into each platform. The detailed instructions guide you through the exact steps for each platform.',
      },
      {
        q: 'What are AI-suggested tags?',
        a: 'When you select a platform in the Publish page, the AI analyzes your article and suggests the best tags, hashtags, or topics for that specific platform to maximize discoverability and engagement.',
      },
    ],
  },
  {
    category: 'Premium Features',
    questions: [
      {
        q: 'What is 10X Mode?',
        a: '10X Mode lets you generate 10 unique, high-converting Facebook posts from a single promotional link. Each post uses a different angle (urgency, social proof, storytelling, etc.) to maximize your reach.',
      },
      {
        q: 'What is Infinite Mode?',
        a: 'Infinite Mode gives you access to a library of 100 SEO-researched article topics across 10 profitable niches. Pick any topic and the AI writes a complete article with images — ready to add your links and publish.',
      },
      {
        q: 'What is Automation Mode?',
        a: 'Automation Mode lets you set up content workflows that generate articles on a schedule. Set your niche, tone, and platforms, and Locus creates content automatically.',
      },
      {
        q: 'How do I unlock premium features?',
        a: 'Premium features (10X, Infinite, Automation, Done-For-You) are shown in the sidebar with a lock icon. Click on any locked feature to see details and unlock it.',
      },
    ],
  },
  {
    category: 'Account & Support',
    questions: [
      {
        q: 'How do I contact support?',
        a: 'Visit the Support page from the sidebar, or email us directly at support@locusaiaccess.com. We\'re available 24/7 to help.',
      },
      {
        q: 'Can I use Locus on mobile?',
        a: 'Yes. Locus is fully responsive and works on any device — desktop, tablet, or phone. The interface adapts to your screen size automatically.',
      },
      {
        q: 'Is my data secure?',
        a: 'Yes. Locus uses Supabase for secure authentication and data storage. Your articles, links, and account data are encrypted and protected.',
      },
    ],
  },
]

export default function TrainingPage() {
  const [activeVideoId, setActiveVideoId] = useState(trainingVideos[0].id)
  const [openFaqCategory, setOpenFaqCategory] = useState<string | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'videos' | 'faq'>('videos')

  const activeVideo = trainingVideos.find(v => v.id === activeVideoId) || trainingVideos[0]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <Badge variant="purple">Training Center</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Training & Help Center
        </h1>
        <p className="text-[var(--color-locus-muted)]">
          Watch tutorials, learn the platform, and find answers to common questions
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-8 animate-fade-in stagger-1">
        {[
          { id: 'videos' as const, label: 'Video Tutorials', icon: Video },
          { id: 'faq' as const, label: 'FAQ', icon: HelpCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${activeSection === tab.id
                ? 'bg-locus-teal text-white shadow-[0_0_20px_rgba(45,212,191,0.15)]'
                : 'bg-[rgba(255,255,255,0.05)] text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.08)]'
              }
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════ VIDEO TUTORIALS SECTION ═══════════════ */}
      {activeSection === 'videos' && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Video Player */}
          <Card className="p-0 overflow-hidden">
            <div className="aspect-video bg-locus-darker relative">
              <iframe
                src={`https://player.vimeo.com/video/${activeVideo.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                title={activeVideo.title}
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-1">{activeVideo.title}</h2>
              <p className="text-sm text-locus-muted">{activeVideo.description}</p>
            </div>
          </Card>

          {/* Video List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainingVideos.map((video) => {
              const isActive = activeVideoId === video.id
              return (
                <Card
                  key={video.id}
                  className={`cursor-pointer transition-all hover:border-locus-teal/50 ${
                    isActive ? 'border-locus-teal ring-2 ring-locus-teal/20' : ''
                  }`}
                  onClick={() => setActiveVideoId(video.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-locus-teal' : 'bg-locus-border'
                    }`}>
                      <Play size={18} className="text-white ml-0.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-semibold text-sm mb-1 ${isActive ? 'text-white' : 'text-locus-text'}`}>
                        {video.title}
                      </h3>
                      <p className="text-xs text-locus-muted line-clamp-2">{video.description}</p>
                      <span className="text-xs text-locus-muted mt-1 flex items-center gap-1">
                        <Clock size={11} /> {video.duration}
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ═══════════════ FAQ SECTION ═══════════════ */}
      {activeSection === 'faq' && (
        <div className="space-y-6 animate-fade-in">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-locus-muted">
              Everything you need to know about using Locus
            </p>
          </div>

          {faqItems.map((category) => (
            <div key={category.category}>
              <button
                onClick={() => setOpenFaqCategory(openFaqCategory === category.category ? null : category.category)}
                className="w-full flex items-center justify-between mb-3"
              >
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <MessageCircle size={16} className="text-locus-teal" />
                  {category.category}
                  <span className="text-xs text-locus-muted font-normal">({category.questions.length})</span>
                </h3>
                {openFaqCategory === category.category ? (
                  <ChevronUp size={18} className="text-locus-muted" />
                ) : (
                  <ChevronDown size={18} className="text-locus-muted" />
                )}
              </button>

              {openFaqCategory === category.category && (
                <div className="space-y-2 mb-6">
                  {category.questions.map((item, qIndex) => {
                    const faqKey = `${category.category}-${qIndex}`
                    const isOpen = openFaqIndex === faqKey
                    return (
                      <Card
                        key={qIndex}
                        className={`cursor-pointer transition-all ${isOpen ? 'border-locus-teal/30' : ''}`}
                        onClick={() => setOpenFaqIndex(isOpen ? null : faqKey)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-white text-sm">{item.q}</h4>
                            {isOpen && (
                              <p className="text-sm text-locus-muted mt-3 leading-relaxed animate-fade-in">
                                {item.a}
                              </p>
                            )}
                          </div>
                          {isOpen ? (
                            <ChevronUp size={16} className="text-locus-teal shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown size={16} className="text-locus-muted shrink-0 mt-0.5" />
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
