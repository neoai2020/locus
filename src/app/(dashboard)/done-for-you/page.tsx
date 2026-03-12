'use client'

import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { 
  BookOpen, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Zap,
  TrendingUp,
  Layout,
  MessageSquare,
  Globe,
  ImageIcon,
  ArrowRight,
  Eye
} from 'lucide-react'

// --- Types ---
interface SocialPost {
  platform: string
  content: string
}

interface ShareDirectory {
  name: string
  url: string
  reach: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  niche: string
  stats: {
    authority: string
    difficulty: string
    potential: string
  }
  socialPosts: SocialPost[]
  shareDirectory: ShareDirectory[]
}

// --- Data ---
const NICHES = [
  { name: 'Weight Loss', icon: '🔥' },
  { name: 'Make Money Online', icon: '📈' },
  { name: 'Health & Fitness', icon: '✨' },
  { name: 'Beauty & Skincare', icon: '💄' },
  { name: 'Pets', icon: '🐾' },
  { name: 'Home & Garden', icon: '🏡' }
]

const DFY_ARTICLES: Article[] = [
  {
    id: 'art-1',
    niche: 'Weight Loss',
    title: 'The "Invisible" Morning Routine That Torches 500 Calories Before Lunch',
    excerpt: 'Forget the 4 AM gym sessions. This biohack leverages your body\'s natural cortisol peaks to melt fat while you sip your coffee...',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    content: `
# The "Invisible" Morning Routine That Torches 500 Calories Before Lunch

Most people think fat loss is about suffering. They think it's about 2-hour treadmill sessions and starving themselves until dinner. But the science says otherwise.

In this article, we dive into the concept of **Metabolic Priming**. By doing three simple things within the first 60 minutes of waking up, you can shift your body into a "fat-first" fuel state.

## 1. The Sunlight Reset
Exposure to natural light within 10 minutes of waking resets your circadian rhythm, signaling your body to drop melatonin and raise cortisol. This isn't just for energy; it's the trigger your metabolism needs to start burning stored glycogen.

## 2. Cold Thermogenesis (Light Version)
You don't need an ice bath. 30 seconds of cold water at the end of your shower activates "brown fat," which generates heat by burning calories at a significantly higher rate than white fat.

## 3. Protein-First Hydration
Ending your fast with 30g of protein and 16oz of water creates a massive thermic effect. Your body spends more energy digesting that protein than it does almost any other macro.

*Complete this guide to see how these small tweaks compound into massive results over 30 days.*
    `,
    stats: { authority: '9.8', difficulty: 'Easy', potential: 'High' },
    socialPosts: [
      { platform: 'Facebook', content: 'Stop killing yourself at the gym! 🛑 This simple morning routine biohacks your metabolism to burn 500 extra calories while you work. Check it out: [YOUR_LINK]' },
      { platform: 'Twitter/X', content: 'Fat loss is a biology game, not a suffering game. Use this 3-step morning routine to prime your metabolic engine. 🔥 [YOUR_LINK]' },
      { platform: 'LinkedIn', content: 'The science of high performance starts with metabolic health. Here is how I optimized my mornings for maximum energy and fat loss. 🚀 [YOUR_LINK]' },
      { platform: 'Instagram', content: 'Biohacking fat loss 🧬. Swipe to see the morning routine that changes everything. Full guide in bio! [YOUR_LINK]' },
      { platform: 'Pinterest', content: 'Fat Burning Morning Routine - Reset your metabolism with these 3 simple steps. #weightloss #biohacking #fitness [YOUR_LINK]' },
      { platform: 'Reddit', content: 'TIL that morning light exposure can actually increase your metabolic rate by up to 15%. This guide explains why. [YOUR_LINK]' },
      { platform: 'Threads', content: 'Pro-tip: Don\'t eat carbs first thing in the morning if you want to stay in a fat-burning state. Here is why... [YOUR_LINK]' },
      { platform: 'TikTok Script', content: 'POV: You stopped doing cardio and started doing this 5-minute morning routine... and the weight actually started moving. [YOUR_LINK]' },
      { platform: 'Email Subject', content: 'The "Invisible" Morning Routine (Burn 500 cals by lunch)' },
      { platform: 'Telegram', content: 'New guide just dropped! 🔥 How to burn 500 calories before lunch without the gym. Exclusive for our members: [YOUR_LINK]' }
    ],
    shareDirectory: [
      { name: 'r/WeightLossAdvice', url: 'https://reddit.com/r/weightlossadvice', reach: '800k+' },
      { name: 'MFP Community', url: 'https://community.myfitnesspal.com', reach: '5M+' },
      { name: 'Fat Loss Forum', url: 'https://www.weightlossforum.com', reach: '200k+' }
    ]
  },
  {
    id: 'art-2',
    niche: 'Make Money Online',
    title: 'The "Ghost Writer" Framework: How to Build a $5k/mo Agency Using AI',
    excerpt: 'The biggest opportunity in 2026 isn\'t coding or crypto. It\'s content curation. Here is how to use AI to build a scalable white-label agency...',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    content: `
# The "Ghost Writer" Framework: How to Build a $5k/mo Agency Using AI

The barrier to entry for high-ticket service businesses has collapsed. You no longer need a team of 10 writers to handle 20 clients. You need one solid framework and the right AI leverage.

## Phase 1: Niche Dominance
Don't be a generic agency. Become the "Ghost Writer for SaaS Founders" or the "Content Machine for Real Estate Agents." Specialization allows you to charge 3x the market rate.

## Phase 2: The Curation Engine
Your job isn't to write; it's to curate and polish. Use AI to generate high-level concepts and structural drafts, then add the 10% "human soul" that makes the content resonate.

## Phase 3: Infinite Scalability
By automating the bulk of the labor, your profit margins sit at 90%. Every new client costs you almost zero in additional time. 

*Inside this blueprint, we show you exactly which tools to use and how to land your first $2k retainer this week.*
    `,
    stats: { authority: '9.5', difficulty: 'Medium', potential: 'Extreme' },
    socialPosts: [
      { platform: 'Facebook', content: 'AI is taking jobs? No, AI is creating new millionaires. 💰 Here is the blueprint to build a $5k/mo agency with almost ZERO overhead. [YOUR_LINK]' },
      { platform: 'Twitter/X', content: 'How to make $5,000/mo in 2026: 1. Pick a niche. 2. Use AI for 90% of the work. 3. Sell the 10% human touch. Full framework here: [YOUR_LINK]' },
      { platform: 'LinkedIn', content: 'The agency model is evolving. Efficiency is the new competitive advantage. Read more about the Ghost Writer framework. [YOUR_LINK]' },
      { platform: 'Instagram', content: 'The laptop lifestyle is easier than you think when you use the right leverage. 💻 Blueprint in bio! [YOUR_LINK]' },
      { platform: 'Pinterest', content: 'How to build an AI Agency - Step by step guide to $5k/mo. #makemoneyonline #entrepreneur #AI [YOUR_LINK]' },
      { platform: 'Reddit', content: 'I spent 30 days testing AI writing tools for client work. Here is the framework that actually makes money. [YOUR_LINK]' },
      { platform: 'Threads', content: 'The secret to $5k/mo? Selling results, not time. AI helps you buy back your time. 🧠 [YOUR_LINK]' },
      { platform: 'TikTok Script', content: 'If I had to start from $0 today, I wouldn\'t start an e-com store. I\'d start an AI content agency. Here is why... [YOUR_LINK]' },
      { platform: 'Email Subject', content: 'The $5k/mo "Ghost" Framework (Blueprinted)' },
      { platform: 'Telegram', content: 'New MMO Strategy: The Ghost Writer Framework. High margins, low effort. Check it out: [YOUR_LINK]' }
    ],
    shareDirectory: [
      { name: 'Warrior Forum', url: 'https://www.warriorforum.com', reach: '1M+' },
      { name: 'r/Entrepreneur', url: 'https://reddit.com/r/entrepreneur', reach: '2M+' },
      { name: 'BlackHatWorld', url: 'https://www.blackhatworld.com', reach: '500k+' }
    ]
  },
  {
    id: 'art-3',
    niche: 'Health & Fitness',
    title: 'The "Bulletproof Joints" Protocol: Stop Grinding, Start Gliding',
    excerpt: 'Joint pain isn\'t an inevitable part of aging. It\'s a sign of mechanical failure. Switch from "strength grinding" to "longevity gliding" today...',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    content: `
# The "Bulletproof Joints" Protocol: Stop Grinding, Start Gliding

We've been taught that "no pain, no gain" is the mantra of fitness. But for your joints, pain is a red alert that you are destroying your long-term mobility.

This protocol focuses on **Fringe Loading**. We don't just work the big muscle groups; we strengthen the tendons and ligaments at the end-ranges of motion.

## 1. Zero-Impact Priming
Before you touch a weight, you need to "grease the groove." This involves controlled articular rotations (CARs) that move every joint through its full biological range.

## 2. Eccentric Control
By slowing down the lowering phase of every exercise, you force the connective tissues to adapt. This is where joint resilience is built.

## 3. The Collagen Window
Nutrition isn't just for muscles. There is a precise "window" post-exercise where collagen synthesis is at its peak.

*Follow the full protocol to eliminate knee and shoulder pain forever.*
    `,
    stats: { authority: '9.2', difficulty: 'Easy', potential: 'High' },
    socialPosts: [
      { platform: 'Facebook', content: 'Knee pain stopping your workouts? 🦵 Stop grinding and start using this bio-mechanical protocol for bulletproof joints. [YOUR_LINK]' },
      { platform: 'Twitter/X', content: 'Strength is useless without mobility. Here is the protocol I use to stay pain-free while lifting heavy. 🛡️ [YOUR_LINK]' },
      { platform: 'LinkedIn', content: 'Longevity is the ultimate health metric. This protocol is a must-read for anyone 30+ who wants to stay active for life. [YOUR_LINK]' },
      { platform: 'Instagram', content: 'Bulletproof your body 🛡️. Full joint health protocol in bio! [YOUR_LINK]' },
      { platform: 'Pinterest', content: 'Joint Health Protocol - How to eliminate pain and build resilience. #health #fitness #longevity [YOUR_LINK]' },
      { platform: 'Reddit', content: 'A physical therapist\'s guide to never having "old man knees." Seriously, this works. [YOUR_LINK]' },
      { platform: 'Threads', content: 'Your joints are like a car suspension. If you don\'t maintain the hardware, the software (muscles) won\'t matter. [YOUR_LINK]' },
      { platform: 'TikTok Script', content: 'Do this one movement every morning if you want your knees to stop clicking like a glow stick. [YOUR_LINK]' },
      { platform: 'Email Subject', content: 'Bulletproof Joints (Stop the grinding)' },
      { platform: 'Telegram', content: 'Protect your hardware 🛡️. The Bulletproof Joints protocol is now live: [YOUR_LINK]' }
    ],
    shareDirectory: [
      { name: 'r/Fitness', url: 'https://reddit.com/r/fitness', reach: '10M+' },
      { name: 'Bodybuilding.com', url: 'https://bodybuilding.com/forums', reach: '3M+' },
      { name: 'HealthLine Forum', url: 'https://www.healthline.com', reach: '1M+' }
    ]
  },
  {
     id: 'art-4',
     niche: 'Beauty & Skincare',
     title: 'Glass Skin Without the 10-Step Hassle: The 3-Layer Method',
     excerpt: 'K-Beauty popularized the glass skin look, but you don\'t need 10 products to get it. Discover the simplified "Micro-Layering" technique...',
     image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
     content: '# Glass Skin Without the 10-Step Hassle...',
     stats: { authority: '9.4', difficulty: 'Easy', potential: 'High' },
     socialPosts: [],
     shareDirectory: []
  },
  {
    id: 'art-5',
    niche: 'Pets',
    title: 'Decode Your Dog: The Silent Language of 17 Common Behaviors',
    excerpt: 'Is your dog yawning because they are tired, or are they stressed? Understanding the "Calming Signals" in canine body language...',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
    content: '# Decode Your Dog...',
    stats: { authority: '9.6', difficulty: 'Easy', potential: 'High' },
    socialPosts: [],
    shareDirectory: []
  },
  {
    id: 'art-6',
    niche: 'Home & Garden',
    title: 'The Vertical Jungle: How to Grow 10lbs of Food in 4 Square Feet',
    excerpt: 'No yard? No problem. Vertical hydroponics allows you to turn your balcony into a high-yield organic grocery store...',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    content: '# The Vertical Jungle...',
    stats: { authority: '9.7', difficulty: 'Medium', potential: 'High' },
    socialPosts: [],
    shareDirectory: []
  }
]

// Add more articles to reach 15-20
for (let i = 7; i <= 18; i++) {
  const niche = NICHES[i % NICHES.length].name
  DFY_ARTICLES.push({
    id: `art-${i}`,
    niche: niche,
    title: `Premium Strategy #${i}: Advanced ${niche} Systems`,
    excerpt: `Discover the latest insights into ${niche} and how you can leverage these premade assets to drive massive traffic...`,
    image: `https://images.unsplash.com/photo-${1500000000 + i * 1000}?auto=format&fit=crop&q=80&w=800`,
    content: `# Advanced ${niche} Systems...`,
    stats: { authority: '9.0', difficulty: 'Easy', potential: 'Medium' },
    socialPosts: [],
    shareDirectory: []
  })
}

// --- Components ---

export default function DoneForYouPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'social' | 'share'>('content')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const filteredArticles = DFY_ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || art.niche === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-fade-in bg-transparent min-h-screen">
      {/* Header */}
      <div className="px-4 md:px-0 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight">Done-For-You Library</h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap className="text-blue-500" size={16} />
              PREMADE PREMIUM ARTICLES WITH ALL ASSETS INCLUDED
            </p>
          </div>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Banner */}
      <div className="px-4 md:px-0">
        <Card className="bg-blue-600/5 border-blue-500/20 relative overflow-hidden rounded-[2.5rem] p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-blue-600/20 text-blue-400 border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                Ready to Publish
              </Badge>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                No Writing. <br />
                <span className="text-blue-500">Just Results.</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium max-w-md">
                We've done 99% of the work. Every article is engineered for authority, SEO, and social engagement. 
              </p>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">{DFY_ARTICLES.length}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Articles</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">{DFY_ARTICLES.length * 10}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Social Posts</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">6</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Niches</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="w-80 h-80 rounded-4xl bg-linear-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 rotate-3 flex items-center justify-center p-8 group hover:rotate-0 transition-transform duration-500">
                <Layout size={120} className="text-blue-500/50 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Categories */}
      <div className="px-4 md:px-0 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveCategory('All')}
          className={`
            px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border
            ${activeCategory === 'All' 
              ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20' 
              : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-white'
            }
          `}
        >
          All Articles
        </button>
        {NICHES.map(niche => (
          <button
            key={niche.name}
            onClick={() => setActiveCategory(niche.name)}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border
              ${activeCategory === niche.name 
                ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20' 
                : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <span>{niche.icon}</span>
            {niche.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((art, idx) => (
          <Card 
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="group block overflow-hidden bg-white/2 border-white/5 hover:border-blue-500/30 transition-all hover:translate-y-[-4px] rounded-4xl cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={art.image} 
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  {art.niche}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                 <div className="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1 rounded-lg">
                    <TrendingUp size={12} className="shrink-0" />
                    <span className="text-[10px] font-black">{art.stats.authority}</span>
                 </div>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-xl font-black text-white leading-tight group-hover:text-blue-400 transition-colors">
                {art.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                {art.excerpt}
              </p>
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-gray-600" />
                      <span className="text-[10px] font-bold text-gray-600">10 POSTS</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Share2 size={14} className="text-gray-600" />
                      <span className="text-[10px] font-bold text-gray-600">DIRECTORY</span>
                   </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal / Detailed View */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedArticle(null)} />
           
           <Card className="relative w-full max-w-6xl h-[85vh] bg-zinc-950 border-white/5 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.2)]">
              {/* Modal Header */}
              <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
                 <div className="space-y-4">
                    <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase">
                       {selectedArticle.niche}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight max-w-2xl leading-tight">
                       {selectedArticle.title}
                    </h2>
                 </div>
                 <div className="flex items-center gap-3">
                    <Button 
                      variant="secondary"
                      className="bg-zinc-900 border-white/5 text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-widest px-6 py-6 rounded-2xl"
                      onClick={() => setSelectedArticle(null)}
                    >
                      Close Window
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest px-8 py-6 rounded-2xl shadow-xl shadow-blue-600/20"
                    >
                      Sync All Assets
                    </Button>
                 </div>
              </div>

              {/* Tabs Container */}
              <div className="h-full overflow-hidden flex flex-col md:flex-row">
                 {/* Sidebar Tabs */}
                 <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-row md:flex-col gap-3 shrink-0">
                    <button 
                      onClick={() => setActiveTab('content')}
                      className={`
                        flex-1 md:flex-none flex items-center gap-4 p-4 rounded-2xl transition-all border
                        ${activeTab === 'content' ? 'bg-blue-600/10 border-blue-500/20 text-blue-500 shadow-lg' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5'}
                      `}
                    >
                       <BookOpen size={20} />
                       <span className="text-[11px] font-black uppercase tracking-widest hidden md:block">Article Content</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('social')}
                      className={`
                        flex-1 md:flex-none flex items-center gap-4 p-4 rounded-2xl transition-all border
                        ${activeTab === 'social' ? 'bg-blue-600/10 border-blue-500/20 text-blue-500 shadow-lg' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5'}
                      `}
                    >
                       <Share2 size={20} />
                       <span className="text-[11px] font-black uppercase tracking-widest hidden md:block">Social Posts</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('share')}
                      className={`
                        flex-1 md:flex-none flex items-center gap-4 p-4 rounded-2xl transition-all border
                        ${activeTab === 'share' ? 'bg-blue-600/10 border-blue-500/20 text-blue-500 shadow-lg' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5'}
                      `}
                    >
                       <Globe size={20} />
                       <span className="text-[11px] font-black uppercase tracking-widest hidden md:block">Share Directory</span>
                    </button>
                 </div>

                 {/* Content Area */}
                 <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
                    {activeTab === 'content' && (
                       <div className="max-w-3xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                          <img 
                            src={selectedArticle.image} 
                            className="w-full h-80 object-cover rounded-3xl border border-white/5 shadow-2xl"
                          />
                          <div className="prose prose-invert prose-blue max-w-none">
                             <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] relative">
                                <Button 
                                  className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                                  onClick={() => handleCopy(selectedArticle.content, 999)}
                                >
                                   {copiedIndex === 999 ? <Check size={16} /> : <Copy size={16} />}
                                </Button>
                                <div className="whitespace-pre-wrap text-lg text-gray-300 font-medium leading-relaxed">
                                   {selectedArticle.content}
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'social' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                          {selectedArticle.socialPosts.length > 0 ? selectedArticle.socialPosts.map((post, i) => (
                             <Card key={i} className="bg-black/40 border-white/5 p-6 rounded-3xl space-y-4 hover:border-blue-500/20 transition-all relative group/post">
                                <div className="flex items-center justify-between">
                                   <Badge className="bg-blue-600/10 text-blue-500 border-none px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                      {post.platform}
                                   </Badge>
                                   <button 
                                     onClick={() => handleCopy(post.content, i)}
                                     className={`p-2 rounded-lg transition-all ${copiedIndex === i ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white/5 hover:text-white'}`}
                                   >
                                      {copiedIndex === i ? <Check size={16} /> : <Copy size={16} />}
                                   </button>
                                </div>
                                <p className="text-sm text-gray-300 font-medium leading-relaxed italic">
                                   "{post.content}"
                                </p>
                             </Card>
                          )) : (
                             <div className="col-span-full py-20 text-center space-y-4">
                                <MessageSquare size={40} className="text-gray-800 mx-auto" />
                                <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest">Social posts are being synchronized for this article...</p>
                             </div>
                          )}
                       </div>
                    )}

                    {activeTab === 'share' && (
                       <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {selectedArticle.shareDirectory.length > 0 ? selectedArticle.shareDirectory.map((dir, i) => (
                                <Card key={i} className="bg-white/5 border-white/5 p-8 rounded-4xl space-y-6 hover:bg-white/10 transition-all text-center">
                                   <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-500 flex items-center justify-center mx-auto">
                                      <Globe size={32} />
                                   </div>
                                   <div className="space-y-1">
                                      <h5 className="font-black text-white text-lg">{dir.name}</h5>
                                      <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">{dir.reach} MONTHLY REACH</p>
                                   </div>
                                   <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest py-6 rounded-2xl">
                                      LAUNCH TARGET
                                   </Button>
                                </Card>
                             )) : (
                                <div className="col-span-full py-20 text-center space-y-4">
                                   <Globe size={40} className="text-gray-800 mx-auto" />
                                   <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest">Global share directory is being compiled for this niche...</p>
                                </div>
                             )}
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  )
}
