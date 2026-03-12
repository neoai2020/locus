'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { 
  Search, Zap, TrendingUp, Layout,
  MessageSquare, Share2, ArrowRight
} from 'lucide-react'
import { DFY_ARTICLES, NICHES } from './data'

export default function DoneForYouPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredArticles = DFY_ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || art.niche === activeCategory
    return matchesSearch && matchesCategory
  })

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
        <Card className="bg-blue-600/5 border-blue-500/20 relative overflow-hidden rounded-3xl p-8 md:p-12">
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
                Every article is engineered for authority, SEO, and social engagement. 
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
              <div className="w-80 h-80 rounded-3xl bg-linear-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 rotate-3 flex items-center justify-center p-8 group hover:rotate-0 transition-transform duration-500">
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
          className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
            activeCategory === 'All' 
              ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20' 
              : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-white'
          }`}
        >
          All Articles
        </button>
        {NICHES.map(niche => (
          <button key={niche.name} onClick={() => setActiveCategory(niche.name)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
              activeCategory === niche.name 
                ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20' 
                : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{niche.icon}</span> {niche.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((art) => (
          <Card 
            key={art.id}
            onClick={() => router.push(`/done-for-you/${art.id}`)}
            className="group block overflow-hidden bg-white/2 border-white/5 hover:border-blue-500/30 transition-all hover:translate-y-[-4px] rounded-2xl cursor-pointer"
          >
            <div className="relative h-52 overflow-hidden">
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
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-black text-white leading-tight group-hover:text-blue-400 transition-colors">
                {art.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                {art.excerpt}
              </p>
              <div className="pt-3 flex items-center justify-between">
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
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
