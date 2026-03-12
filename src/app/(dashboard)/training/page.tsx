'use client'

import { useState } from 'react'
import { 
  GraduationCap, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Rocket,
  Target,
  Zap,
  ArrowRight,
  Lock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Video,
  MessageCircle,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const trainingVideos = [
  {
    id: 'intro',
    title: 'Intro — Welcome to Locus',
    description: 'A quick introduction to Locus and what you can achieve with the platform.',
    vimeoId: '1172911144',
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
]

const trainingModules = [
  {
    id: 'getting-started',
    title: 'Getting Started with Locus',
    description: 'Learn the basics of generating authority content',
    duration: '5 min',
    lessons: [
      { id: '1', title: 'Welcome to Locus', duration: '1:30', completed: true },
      { id: '2', title: 'Creating Your First Article', duration: '2:00', completed: true },
      { id: '3', title: 'Understanding Platforms', duration: '1:30', completed: false },
    ],
    icon: Rocket,
    gradient: 'from-[var(--color-locus-teal)] to-[var(--color-locus-indigo)]',
    progress: 66,
  },
  {
    id: 'content-strategy',
    title: 'Content Strategy Mastery',
    description: 'Build a content system that drives results',
    duration: '15 min',
    lessons: [
      { id: '1', title: 'Choosing Your Niche', duration: '3:00', completed: false },
      { id: '2', title: 'Content Pillars Framework', duration: '4:00', completed: false },
      { id: '3', title: 'Publishing Schedule', duration: '3:00', completed: false },
      { id: '4', title: 'Repurposing Content', duration: '5:00', completed: false },
    ],
    icon: Target,
    gradient: 'from-[var(--color-locus-cyan)] to-[var(--color-locus-blue)]',
    progress: 0,
  },
  {
    id: 'platform-mastery',
    title: 'Platform Mastery',
    description: 'Optimize for LinkedIn, Medium, Quora, Reddit & X',
    duration: '20 min',
    lessons: [
      { id: '1', title: 'LinkedIn Algorithm Secrets', duration: '5:00', completed: false },
      { id: '2', title: 'Medium SEO Tactics', duration: '5:00', completed: false },
      { id: '3', title: 'Quora & Reddit Growth Hacks', duration: '5:00', completed: false },
      { id: '4', title: 'Cross-Platform Strategy', duration: '5:00', completed: false },
    ],
    icon: BookOpen,
    gradient: 'from-[var(--color-locus-amber)] to-[var(--color-locus-teal)]',
    progress: 0,
  },
  {
    id: 'advanced-tactics',
    title: 'Advanced Tactics',
    description: 'Scale your authority with proven systems',
    duration: '25 min',
    lessons: [
      { id: '1', title: 'Hook Writing Masterclass', duration: '6:00', completed: false },
      { id: '2', title: 'Viral Content Formulas', duration: '7:00', completed: false },
      { id: '3', title: 'Building Your Audience', duration: '6:00', completed: false },
      { id: '4', title: 'Monetization Strategies', duration: '6:00', completed: false },
    ],
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-500',
    progress: 0,
    locked: true,
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
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [activeVideoId, setActiveVideoId] = useState(trainingVideos[0].id)
  const [openFaqCategory, setOpenFaqCategory] = useState<string | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'videos' | 'modules' | 'faq'>('videos')

  const activeModule = trainingModules.find(m => m.id === selectedModule)
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
          { id: 'modules' as const, label: 'Training Modules', icon: BookOpen },
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* ═══════════════ TRAINING MODULES SECTION ═══════════════ */}
      {activeSection === 'modules' && (
        <div className="animate-fade-in">
          {/* Progress Overview */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Progress</h2>
              <Badge variant="cyan">2 of 12 lessons completed</Badge>
            </div>
            <div className="w-full bg-[var(--color-locus-border)] rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] h-3 rounded-full transition-all duration-500"
                style={{ width: '17%' }}
              />
            </div>
            <p className="text-sm text-[var(--color-locus-muted)] mt-2">
              17% complete — Keep going, you&apos;re doing great!
            </p>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Modules List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Training Modules</h2>
              {trainingModules.map((module, index) => (
                <Card
                  key={module.id}
                  className={`
                    animate-fade-in cursor-pointer relative overflow-hidden
                    ${selectedModule === module.id ? 'border-[var(--color-locus-teal)] ring-2 ring-[rgba(20,184,166,0.2)]' : ''}
                    ${module.locked ? 'opacity-60' : ''}
                  `}
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                  onClick={() => !module.locked && setSelectedModule(module.id)}
                >
                  {module.locked && (
                    <div className="absolute inset-0 bg-[var(--color-locus-dark)] bg-opacity-60 backdrop-blur-sm z-10 flex items-center justify-center">
                      <Badge variant="warning">
                        <Lock size={12} className="mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${module.gradient} flex items-center justify-center flex-shrink-0`}>
                      <module.icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 text-sm">{module.title}</h3>
                      <p className="text-xs text-[var(--color-locus-muted)] mb-2">{module.description}</p>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-locus-muted)]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {module.duration}
                        </span>
                        <span>{module.lessons.length} lessons</span>
                      </div>
                      {module.progress > 0 && (
                        <div className="mt-2 w-full bg-[var(--color-locus-border)] rounded-full h-1.5">
                          <div
                            className={`bg-gradient-to-r ${module.gradient} h-1.5 rounded-full`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Video Player & Lessons */}
            <div className="lg:col-span-2">
              {activeModule ? (
                <div className="space-y-6 animate-fade-in">
                  <Card className="p-0 overflow-hidden">
                    <div className="aspect-video bg-[var(--color-locus-darker)] flex items-center justify-center relative">
                      {playingVideo ? (
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-[var(--color-locus-teal)] flex items-center justify-center mb-4 mx-auto animate-pulse">
                            <Play size={32} className="text-white ml-1" />
                          </div>
                          <p className="text-white">Video playing...</p>
                          <p className="text-sm text-[var(--color-locus-muted)]">
                            {activeModule.lessons.find(l => l.id === playingVideo)?.title}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${activeModule.gradient} flex items-center justify-center mb-4 mx-auto`}>
                            <activeModule.icon size={40} className="text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{activeModule.title}</h3>
                          <p className="text-[var(--color-locus-muted)]">Select a lesson to start learning</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card>
                    <h3 className="font-semibold text-white mb-4">Lessons</h3>
                    <div className="space-y-2">
                      {activeModule.lessons.map((lesson, index) => (
                        <button
                          key={lesson.id}
                          onClick={() => setPlayingVideo(lesson.id)}
                          className={`
                            w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left
                            ${playingVideo === lesson.id
                              ? 'bg-[rgba(20,184,166,0.15)] border border-[var(--color-locus-teal)]'
                              : 'bg-[rgba(255,255,255,0.02)] border border-[var(--color-locus-border)] hover:border-[var(--color-locus-teal)]'
                            }
                          `}
                        >
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                            ${lesson.completed
                              ? 'bg-[var(--color-locus-success)]'
                              : playingVideo === lesson.id
                                ? 'bg-[var(--color-locus-teal)]'
                                : 'bg-[var(--color-locus-border)]'
                            }
                          `}>
                            {lesson.completed ? (
                              <CheckCircle size={20} className="text-white" />
                            ) : (
                              <span className="text-white font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium ${playingVideo === lesson.id ? 'text-white' : 'text-[var(--color-locus-text)]'}`}>
                              {lesson.title}
                            </h4>
                            <p className="text-sm text-[var(--color-locus-muted)]">{lesson.duration}</p>
                          </div>
                          {playingVideo === lesson.id && (
                            <div className="w-8 h-8 rounded-full bg-[var(--color-locus-teal)] flex items-center justify-center">
                              <Play size={14} className="text-white ml-0.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="h-full flex items-center justify-center text-center py-20 animate-fade-in">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-locus-border)] flex items-center justify-center mx-auto mb-4">
                      <GraduationCap size={32} className="text-[var(--color-locus-muted)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Select a Module</h3>
                    <p className="text-[var(--color-locus-muted)] mb-6">
                      Choose a training module from the left to start learning
                    </p>
                    <Button onClick={() => setSelectedModule('getting-started')}>
                      <span>Start with Basics</span>
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </Card>
              )}
            </div>
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
