'use client'

import { useEffect, useState } from 'react'
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
  MoreHorizontal
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

const PLATFORM_ICONS: Record<string, any> = {
  facebook: Facebook,
  google: Globe,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  tiktok: Share2,
  youtube: Youtube,
}

const CATEGORIES = [
  { name: 'All', count: 184 },
  { name: 'Google', count: 42 },
  { name: 'Meta', count: 56 },
  { name: 'LinkedIn', count: 12 },
  { name: 'Twitter', count: 8 },
  { name: 'Forums', count: 24 },
]

const trafficSourcesList = [
  { 
    id: "mfp_01", 
    name: "MyFitnessPal Community", 
    type: "Forum",
    status: "active", 
    reach: "200-500/mo", 
    duration: "10 min",
    category: "Weight Loss",
    platform: "google", 
    gradient: "from-blue-600 to-blue-400",
    instructions: [
      "Create a free account at community.myfitnesspal.com",
      "Complete your profile with a photo and bio about your fitness journey",
      "Go to Settings → Signature and add your affiliate link",
      "Navigate to the Success Stories forum and post your transformation story",
      "Your signature with the link will automatically show on all your posts"
    ],
    snippet: "I've been on an incredible weight loss journey and wanted to share what finally worked for me. After trying dozens of approaches, I found a system that made everything click. It completely changed my relationship with food and exercise. If you're curious, here's what I used: [YOUR_LINK] — Honestly it was a game-changer for me. Would love to hear about your journeys too!"
  },
  { id: "gg_01", name: "Google Search Engine", type: "Search", status: "active", reach: "120.8k", duration: "15 min", category: "General", platform: "google", gradient: "from-red-500 to-yellow-500" },
  { id: "li_01", name: "LinkedIn Professional", type: "Social", status: "active", reach: "12.4k", duration: "20 min", category: "B2B", platform: "linkedin", gradient: "from-blue-700 to-blue-500" },
  { id: "ig_01", name: "Instagram Visuals", type: "Social", status: "active", reach: "88.5k", duration: "12 min", category: "Visuals", platform: "instagram", gradient: "from-purple-600 to-pink-500" },
]

export default function AutomationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>('mfp_01')

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between animate-fade-in px-4 md:px-0">
        <h1 className="text-xl font-bold text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
          Adopted Traffic Marketplace
        </h1>
        <Badge variant="warning" className="text-[10px] uppercase font-bold px-3 py-1">Beta</Badge>
      </div>

      {/* Stats Banner */}
      <div className="px-4 md:px-0">
        <Card className="bg-locus-dark border-locus-teal/10 p-1 animate-fade-in stagger-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="bg-white/5 p-6 rounded-xl flex items-center justify-center gap-6 group hover:bg-white/8 transition-all">
              <div className="w-12 h-12 rounded-full border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform bg-orange-500/5">
                <Layers size={22} className="text-orange-400" />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-white block">00</span>
                <span className="text-[10px] uppercase font-bold text-orange-400/80 tracking-widest">Total Campaigns</span>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl flex items-center justify-center gap-6 group hover:bg-white/8 transition-all border-y md:border-y-0 md:border-x border-white/5">
              <div className="w-12 h-12 rounded-full border border-teal-500/30 flex items-center justify-center group-hover:scale-110 transition-transform bg-teal-500/5">
                <TrendingUp size={22} className="text-teal-400" />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-white block">3</span>
                <span className="text-[10px] uppercase font-bold text-teal-400/80 tracking-widest">Active Pipelines</span>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl flex items-center justify-center gap-6 group hover:bg-white/8 transition-all">
              <div className="w-12 h-12 rounded-full border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform bg-blue-500/5">
                <Activity size={22} className="text-blue-400" />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-white block">250-1,000</span>
                <span className="text-[10px] uppercase font-bold text-blue-400/80 tracking-widest">Reach / mo</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="space-y-4 animate-fade-in stagger-2 px-4 md:px-0">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-orange-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-widest">Marketplace Hub Filter</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-locus-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search Marketplace... or add a platform you can't find"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-600 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`
                px-4 py-2 rounded-lg text-xs font-bold transition-all border
                ${activeCategory === cat.name 
                  ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                  : 'bg-white/5 text-locus-muted border-white/5 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span className="mr-2">{cat.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] ${activeCategory === cat.name ? 'bg-white/20' : 'bg-white/10 text-gray-400'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Traffic Sources List - Accordion style */}
      <div className="space-y-3 animate-fade-in stagger-3 px-4 md:px-0">
        {trafficSourcesList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((source) => {
          const isExpanded = expandedId === source.id
          return (
            <div key={source.id} className="group">
              <div 
                onClick={() => setExpandedId(isExpanded ? null : source.id)}
                className={`
                  p-4 rounded-xl transition-all cursor-pointer border
                  ${isExpanded ? 'bg-white/3 border-white/10 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/8'}
                  flex items-center justify-between
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-sm ${source.status === 'active' ? 'bg-orange-500/40' : 'bg-gray-500/20'}`} />
                  </div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-white text-sm tracking-tight">{source.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase">
                      {source.type}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-4 ml-4">
                    <span className="text-[10px] text-locus-muted flex items-center gap-1 font-medium">
                      <TrendingUp size={12} className="text-teal-400" />
                      {source.reach}
                    </span>
                    <span className="text-[10px] text-locus-muted flex items-center gap-1 font-medium">
                      <Activity size={12} className="text-orange-400" />
                      {source.duration}
                    </span>
                    <span className="text-[10px] text-locus-muted font-medium">
                      {source.category}
                    </span>
                  </div>
                </div>
                <ChevronRight 
                  size={16} 
                  className={`text-locus-muted transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                />
              </div>

              {isExpanded && (
                <div className="mt-1 p-6 bg-white/2 border-x border-b border-white/10 rounded-b-xl animate-dropdown space-y-8">
                  {source.instructions && (
                    <div className="space-y-4">
                      <h5 className="text-[11px] font-black text-orange-400 uppercase tracking-widest pl-1">Step-by-step Instructions</h5>
                      <div className="space-y-3">
                        {source.instructions.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                              <span className="text-[10px] font-bold text-orange-400">{idx + 1}</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {source.snippet && (
                    <div className="space-y-4">
                      <h5 className="text-[11px] font-black text-teal-400 uppercase tracking-widest pl-1">Pre-written Description — Copy & Paste</h5>
                      <div className="p-5 rounded-xl bg-black/40 border border-white/5 relative group/snippet">
                        <p className="text-xs text-gray-300 leading-relaxed font-medium pr-12">
                          {source.snippet}
                        </p>
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover/snippet:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 transition-all shadow-xl backdrop-blur-md border border-orange-500/30" title="Copy to Clipboard">
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button className="py-2! px-6! text-xs font-bold">Launch Asset</Button>
                        <Button variant="secondary" className="py-2! px-6! text-xs font-bold">Open Link</Button>
                        <button className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                          <MoreHorizontal size={18} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
