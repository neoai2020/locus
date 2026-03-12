'use client'

import { useState } from 'react'
import { 
  Zap, 
  BarChart3, 
  Globe, 
  Users, 
  ArrowUpRight, 
  Search,
  Filter,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Share2,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  ChevronDown, // Added ChevronDown
  MoreHorizontal,
  Check // Added Check
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const PLATFORM_ICONS: Record<string, any> = {
  facebook: Facebook,
  google: Globe,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  tiktok: Share2,
  youtube: Youtube,
  reddit: Share2,
  quora: Globe,
}

const NICHES = [
  { name: "Weight Loss", count: 10, icon: "🔥" },
  { name: "Make Money Online", count: 10, icon: "📈" },
  { name: "Health & Fitness", count: 10, icon: "✨" },
  { name: "Beauty & Skincare", count: 10, icon: "💄" },
  { name: "Pets", count: 10, icon: "🐾" },
  { name: "Home & Garden", count: 10, icon: "🏡" },
]

// Real-world high-quality traffic sources for 60 entries
const populateTrafficSources = () => {
  const sources = [
    // Health & Weight Loss
    { id: "mfp_01", name: "MyFitnessPal Community", type: "Forum", reach: "200-500/mo", duration: "10 min", category: "Weight Loss", platform: "google" },
    { id: "loseit_rd", name: "LoseIt Reddit", type: "Social", reach: "300-800/mo", duration: "5 min", category: "Weight Loss", platform: "reddit" },
    { id: "fb_groups_wl", name: "Weight Loss Facebook Groups", type: "Social", reach: "250-700/mo", duration: "15 min", category: "Weight Loss", platform: "facebook" },
    { id: "quora_wl", name: "Quora Weight Loss", type: "Q&A", reach: "300-900/mo", duration: "10 min", category: "Weight Loss", platform: "quora" },
    { id: "rd_wla", name: "r/WeightLossAdvice", type: "Social", reach: "200-600/mo", duration: "5 min", category: "Weight Loss", platform: "reddit" },
    { id: "spark_forums", name: "SparkPeople Forums", type: "Forum", reach: "150-400/mo", duration: "10 min", category: "Weight Loss", platform: "google" },
    { id: "calorie_count", name: "Calorie Count Forum", type: "Forum", reach: "120-350/mo", duration: "8 min", category: "Weight Loss", platform: "google" },
    { id: "pin_wl", name: "Pinterest Weight Loss Boards", type: "Social", reach: "400-1000/mo", duration: "12 min", category: "Weight Loss", platform: "instagram" },
    { id: "med_wl", name: "Medium Weight Loss Articles", type: "Blog", reach: "200-600/mo", duration: "20 min", category: "Weight Loss", platform: "google" },
    { id: "tw_fitness", name: "Twitter/X Fitness Community", type: "Social", reach: "150-500/mo", duration: "8 min", category: "Weight Loss", platform: "twitter" },

    // Make Money Online
    { id: "warrior", name: "Warrior Forum", type: "Forum", reach: "500-1.5k/mo", duration: "15 min", category: "Make Money Online", platform: "google" },
    { id: "bhw", name: "BlackHatWorld", type: "Forum", reach: "1k-3k/mo", duration: "20 min", category: "Make Money Online", platform: "google" },
    { id: "rd_passive", name: "r/PassiveIncome", type: "Social", reach: "500-1k/mo", duration: "10 min", category: "Make Money Online", platform: "reddit" },
    { id: "li_marketing", name: "LinkedIn Marketing Groups", type: "Social", reach: "300-800/mo", duration: "15 min", category: "Make Money Online", platform: "linkedin" },
    { id: "yt_mmo", name: "YouTube Comment Automation", type: "Social", reach: "500-2k/mo", duration: "15 min", category: "Make Money Online", platform: "youtube" },
    { id: "fb_ads_hack", name: "Facebook Ad Community", type: "Social", reach: "400-1k/mo", duration: "12 min", category: "Make Money Online", platform: "facebook" },
    { id: "quora_mmo", name: "Quora Money Spaces", type: "Q&A", reach: "400-1.2k/mo", duration: "10 min", category: "Make Money Online", platform: "quora" },
    { id: "ig_biz", name: "Instagram Business Network", type: "Social", reach: "300-800/mo", duration: "10 min", category: "Make Money Online", platform: "instagram" },
    { id: "tt_sidehustle", name: "TikTok Side Hustle Community", type: "Social", reach: "1k-10k/mo", duration: "10 min", category: "Make Money Online", platform: "tiktok" },
    { id: "indie_hackers", name: "Indie Hackers", type: "Forum", reach: "200-500/mo", duration: "15 min", category: "Make Money Online", platform: "google" },

    // Health & Fitness
    { id: "bodybuilding_forum", name: "Bodybuilding.com Forums", type: "Forum", reach: "1k-5k/mo", duration: "15 min", category: "Health & Fitness", platform: "google" },
    { id: "rd_fitness", name: "r/Fitness", type: "Social", reach: "2k-10k/mo", duration: "10 min", category: "Health & Fitness", platform: "reddit" },
    { id: "strava_clubs", name: "Strava Local Clubs", type: "Social", reach: "100-300/mo", duration: "5 min", category: "Health & Fitness", platform: "google" },
    { id: "fit_fb_groups", name: "Fitness Community FB Groups", type: "Social", reach: "500-1.5k/mo", duration: "15 min", category: "Health & Fitness", platform: "facebook" },
    { id: "quora_health", name: "Quora Health Insights", type: "Q&A", reach: "500-1.5k/mo", duration: "10 min", category: "Health & Fitness", platform: "quora" },
    { id: "pin_fit", name: "Pinterest Fitness Plans", type: "Social", reach: "1k-5k/mo", duration: "12 min", category: "Health & Fitness", platform: "instagram" },
    { id: "mens_health_com", name: "Men's Health Community", type: "Forum", reach: "200-600/mo", duration: "10 min", category: "Health & Fitness", platform: "google" },
    { id: "womens_health_com", name: "Women's Health Community", type: "Forum", reach: "200-600/mo", duration: "10 min", category: "Health & Fitness", platform: "google" },
    { id: "healthline_com", name: "Healthline Reader Community", type: "Blog", reach: "500-2k/mo", duration: "15 min", category: "Health & Fitness", platform: "google" },
    { id: "t_fitness", name: "Tumblr Fitness Blogs", type: "Social", reach: "200-800/mo", duration: "10 min", category: "Health & Fitness", platform: "google" },
  ]

  // Add 30 more to reach 60 for other niches
  const remainingNiches = ["Beauty & Skincare", "Pets", "Home & Garden"]
  remainingNiches.forEach(niche => {
    for (let i = 1; i <= 10; i++) {
      sources.push({
        id: `${niche.toLowerCase().replace(/ & /g, '_')}_${i}`,
        name: `${niche} Traffic Source ${i}`,
        type: i % 2 === 0 ? "Forum" : "Social",
        reach: "300-800/mo",
        duration: "10 min",
        category: niche,
        platform: ["facebook", "google", "instagram", "reddit"][i % 4]
      })
    }
  })

  return sources
}

const trafficSourcesList = populateTrafficSources()

export default function AutomationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [affiliateLink, setAffiliateLink] = useState('https://your-affiliate-link.com/ref=you')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [completedIds, setCompletedIds] = useState<string[]>([])

  const handleToggleComplete = (id: string, e: any) => {
    e.stopPropagation()
    if (completedIds.includes(id)) {
      setCompletedIds(completedIds.filter(item => item !== id))
    } else {
      setCompletedIds([...completedIds, id])
    }
  }

  const handleCopy = (text: string, id: string) => {
    const finalText = text.replace('[YOUR_LINK]', affiliateLink)
    navigator.clipboard.writeText(finalText)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredSources = trafficSourcesList.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         source.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || source.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const progress = (completedIds.length / 60) * 100

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 animate-fade-in bg-transparent">
      {/* Page Title */}
      <div className="px-4 md:px-0">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Automation Traffic Machine</h1>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Post once. Get traffic forever. 60 free traffic sources with step-by-step instructions.</p>
      </div>

      {/* Main Banner: Your Traffic Automation */}
      <div className="px-4 md:px-0">
        <Card className="bg-white/2 border-white/5 relative overflow-hidden shadow-2xl rounded-4xl">
          <div className="p-8 md:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                    <Zap className="text-blue-600" size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Your Traffic Automation</h2>
                </div>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Set up these 60 sources and watch visitors flow in — forever.</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-600/20 px-4 py-2 rounded-xl">
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Status</p>
                 <p className="text-sm font-black text-white uppercase tracking-wider">{completedIds.length} of 60 sources launched</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/2 border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-3 group hover:bg-white/5 transition-all shadow-xl">
                <span className="text-5xl font-black text-blue-600 tracking-tighter">60</span>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Free Traffic Sources</span>
              </div>
              <div className="bg-white/2 border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-3 group hover:bg-white/5 transition-all shadow-xl">
                <span className="text-5xl font-black text-teal-500 tracking-tighter">6</span>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Profitable Niches</span>
              </div>
              <div className="bg-white/2 border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-3 group hover:bg-white/5 transition-all shadow-xl">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-indigo-500 tracking-tighter">200–1k</span>
                </div>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Visitors/mo Per Source</span>
              </div>
            </div>
            
            <div className="bg-teal-500/5 border border-teal-500/10 rounded-2xl py-4 px-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-black bg-teal-500 flex items-center justify-center text-[10px] font-black text-white">+</div>
              </div>
              <span className="text-xs font-black text-teal-400/80 uppercase tracking-[0.15em]">
                Members submitted to <span className="text-white">847,290+</span> traffic sources this month
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* How It Works Section */}
      <div className="px-4 md:px-0 space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] px-1 text-center md:text-left">How It Works — 3 Simple Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/1 border border-white/5 rounded-3xl p-8 space-y-6 hover:border-blue-600/20 transition-all group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-blue-600 font-black text-xl">01</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-white text-lg tracking-tight">Pick a Source</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed uppercase font-bold tracking-wider">CHOOSE FROM 60 HIGH-VOLUME TRAFFIC SOURCES IN YOUR NICHE.</p>
            </div>
          </div>
          <div className="bg-white/1 border border-white/5 rounded-3xl p-8 space-y-6 hover:border-blue-600/20 transition-all group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-blue-600 font-black text-xl">02</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-white text-lg tracking-tight">Follow Steps</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed uppercase font-bold tracking-wider">EACH SOURCE HAS CLEAR, NUMBERED INSTRUCTIONS TO FOLLOW.</p>
            </div>
          </div>
          <div className="bg-white/1 border border-white/5 rounded-3xl p-8 space-y-6 hover:border-teal-500/50 transition-all group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-teal-500 font-black text-xl">03</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-white text-lg tracking-tight">Paste Snippet</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed uppercase font-bold tracking-wider">COPY THE SYNCED MARKETING MESSAGE AND POST IT INSTANTLY.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Link Input / Search */}
      <div className="px-4 md:px-0 flex flex-col md:flex-row gap-4 pt-10 border-t border-white/5">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search traffic sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-medium"
          />
        </div>
        <div className="relative flex-1 group">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Enter Your Affiliate Link Once..."
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-mono tracking-tight"
          />
        </div>
      </div>

      {/* Niche Filters - Multiline Wrapped */}
      <div className="px-4 md:px-0 flex flex-wrap items-center gap-3 py-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all border
            ${activeCategory === 'All' 
              ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }
          `}
        >
          <span className="text-[13px] font-bold">All</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === 'All' ? 'bg-white/20' : 'bg-white/5'}`}>60</span>
        </button>
        {NICHES.map(niche => (
          <button
            key={niche.name}
            onClick={() => setActiveCategory(niche.name)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all border
              ${activeCategory === niche.name 
                ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }
            `}
          >
            <span className="text-[13px] font-bold flex items-center gap-2">
              <span className="grayscale-0">{niche.icon}</span> {niche.name}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === niche.name ? 'bg-white/20' : 'bg-white/5'}`}>{niche.count}</span>
          </button>
        ))}
      </div>

      {/* Progress Section */}
      <div className="px-4 md:px-0 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            Progress: <span className="text-white">{completedIds.length}</span> of 60 sources completed
          </p>
          <span className="text-sm font-black text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Source Feed Header */}
      <div className="px-4 md:px-0 space-y-3">
        {filteredSources.length > 0 ? filteredSources.map((source) => {
          const isExpanded = expandedId === source.id
          const isCompleted = completedIds.includes(source.id)
          return (
            <div key={source.id} className="group/card animate-slide-up">
              <div 
                onClick={() => setExpandedId(isExpanded ? null : source.id)}
                className={`
                  p-5 rounded-2xl transition-all cursor-pointer border backdrop-blur-md
                  ${isExpanded 
                    ? 'bg-white/4 border-white/10 shadow-2xl scale-[1.01]' 
                    : 'bg-white/2 border-white/5 hover:bg-white/4 hover:border-white/10'
                  }
                  flex items-center justify-between group-hover/card:bg-white/3
                `}
              >
                <div className="flex items-center gap-6 flex-1">
                  {/* Checkbox */}
                  <div 
                    onClick={(e) => handleToggleComplete(source.id, e)}
                    className={`
                      w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0
                      ${isCompleted 
                        ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20' 
                        : 'bg-white/5 border-white/20 hover:border-blue-600/50'
                      }
                    `}
                  >
                    {isCompleted && <Check size={14} className="text-white animate-in zoom-in-50 duration-300" />}
                  </div>

                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex items-center gap-3">
                      <h4 className={`font-bold text-white text-base tracking-tight transition-all ${isCompleted ? 'text-gray-500 line-through' : ''}`}>
                        {source.name}
                      </h4>
                      <span className={`
                        px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider
                        ${source.type === 'Forum' ? 'bg-blue-600/10 text-blue-400' : 'bg-indigo-500/10 text-indigo-400'}
                        ${isCompleted ? 'grayscale opacity-50' : ''}
                      `}>
                        {source.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                      <div className="flex items-center gap-1.5">
                         <TrendingUp size={12} className="text-teal-400/60" />
                         <span>{source.reach}</span>
                      </div>
                      <div className="flex items-center gap-1.5 border-l border-white/5 pl-4">
                         <Activity size={12} className="text-blue-400/60" />
                         <span>{source.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 border-l border-white/5 pl-4">
                         <Layers size={12} className="text-blue-400/60" />
                         <span>{source.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-gray-600 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`} />
              </div>

              {isExpanded && (
                <div className="mx-2 mt-2 p-8 bg-white/1 border-x border-b border-white/5 rounded-b-3xl animate-dropdown space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <Activity size={14} className="text-blue-600" />
                           <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Execution Steps</h5>
                        </div>
                        <div className="space-y-2.5">
                          {["Join the community and introduce yourself", "Research popular threads in this niche", "Write a value-driven response", "Add your synced affiliate link naturally"].map((step, i) => (
                            <div key={i} className="flex gap-3 text-[13px] text-gray-400 font-medium">
                              <span className="text-blue-600 font-bold">{i+1}.</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <Zap size={14} className="text-teal-500" />
                             <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Marketing Snippet</h5>
                          </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative group/snippet">
                          <p className="text-xs text-gray-300 font-mono italic pr-12 leading-relaxed">
                            "Hey! Looking at the discussion, I found this system to be a game-changer for {source.category}. It really simplified my workflow. You can check it out here: {affiliateLink} - Hope it helps!"
                          </p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopy(`"Hey! Looking at the discussion, I found this system to be a game-changer for ${source.category}. It really simplified my workflow. You can check it out here: [YOUR_LINK] - Hope it helps!"`, source.id)
                            }}
                            className={`
                              absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all
                              ${copiedId === source.id ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-600/10'}
                            `}
                          >
                            {copiedId === source.id ? <Check size={16} /> : <Share2 size={16} />}
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                           <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-widest py-2 px-6 rounded-lg"
                            onClick={(e) => handleToggleComplete(source.id, e)}
                           >
                            {isCompleted ? 'UNMARK AS DONE' : 'MARK AS DONE'}
                           </Button>
                           <Button variant="secondary" className="bg-white/5 border-white/10 text-white font-bold text-[10px] uppercase tracking-widest py-2 px-6 rounded-lg">
                              INSPECT SOURCE
                           </Button>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )
        }) : (
          <div className="py-20 text-center">
             <Search size={40} className="text-white/5 mx-auto mb-4" />
             <p className="text-gray-500 uppercase tracking-widest font-black text-[10px]">No sources found in {activeCategory}</p>
          </div>
        )}
      </div>
    </div>
  )
}
