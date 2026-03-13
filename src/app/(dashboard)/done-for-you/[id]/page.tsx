'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { 
  BookOpen, Share2, Copy, Check, Globe, ArrowLeft, 
  TrendingUp, MessageSquare, ExternalLink, Download, Image as ImageIcon,
  Link as LinkIcon, ChevronRight
} from 'lucide-react'
import { DFY_ARTICLES } from '../data'
import { useAppStore } from '@/store'

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'content' | 'social' | 'share'>('content')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [promoLink, setPromoLink] = useState('')
  const [showPortfolioLinks, setShowPortfolioLinks] = useState(false)
  const affiliateLinks = useAppStore(s => s.affiliateLinks)

  const article = DFY_ARTICLES.find(a => a.id === params.id)

  const applyLink = (text: string) => {
    if (!promoLink.trim()) return text
    return text
      .replace(/\[YOUR_LINK\]/g, promoLink.trim())
      .replace(/\[YOUR LINK HERE\]/g, promoLink.trim())
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleDownloadImage = async (imageUrl: string, title: string) => {
    try {
      const resp = await fetch(imageUrl)
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(imageUrl, '_blank')
    }
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
        <h1 className="text-3xl font-black text-white">Article Not Found</h1>
        <Button onClick={() => router.push('/done-for-you')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl h-auto">
          Back to Library
        </Button>
      </div>
    )
  }

  const tabs = [
    { key: 'content' as const, label: 'Article Content', icon: BookOpen },
    { key: 'social' as const, label: 'Social Posts', icon: Share2, count: article.socialPosts.length },
    { key: 'share' as const, label: 'Share Directory', icon: Globe, count: article.shareDirectory.length }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-fade-in bg-transparent min-h-screen">
      {/* Back + Header */}
      <div className="px-4 md:px-0 space-y-6">
        <button onClick={() => router.push('/done-for-you')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Library
        </button>

        <div className="relative rounded-2xl overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-64 md:h-80 object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
          <button
            onClick={() => handleDownloadImage(article.image, article.title)}
            className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors z-10"
          >
            <Download size={14} />
            Download Image
          </button>
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 text-white border-none px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase">{article.niche}</Badge>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
                <TrendingUp size={12} />
                <span className="text-[10px] font-black">{article.stats.authority}</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-3xl">{article.title}</h1>
            <p className="text-gray-400 text-sm max-w-2xl">{article.excerpt}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-0 flex items-center justify-center gap-2 border-b border-white/5 pb-0">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count !== undefined && <span className="bg-white/10 text-gray-400 px-2 py-0.5 rounded-md text-[9px]">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Promotional Link Panel */}
      <div className="px-4 md:px-0 max-w-4xl mx-auto">
        <Card className="bg-amber-500/5 border-amber-400/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon size={16} className="text-amber-400" />
            <h3 className="font-bold text-white text-sm">Your Promotional Link</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Add your link below — it will replace all <code className="bg-white/5 px-1.5 py-0.5 rounded text-amber-400">[YOUR_LINK]</code> placeholders in the article and social posts.
          </p>
          <input
            type="url"
            placeholder="https://your-link.com/ref=..."
            value={promoLink}
            onChange={e => setPromoLink(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
          />
          {promoLink.trim() && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2">
              <Check size={14} />
              <span>Link applied to all placeholders</span>
            </div>
          )}
          {affiliateLinks.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowPortfolioLinks(!showPortfolioLinks)}
                className="text-xs text-blue-400 hover:text-white transition-colors flex items-center gap-1 font-bold"
              >
                <ChevronRight size={12} className={`transition-transform ${showPortfolioLinks ? 'rotate-90' : ''}`} />
                Choose from My Portfolio ({affiliateLinks.length})
              </button>
              {showPortfolioLinks && (
                <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
                  {affiliateLinks.map(link => (
                    <button
                      key={link.id}
                      onClick={() => { setPromoLink(link.link); setShowPortfolioLinks(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        promoLink === link.link
                          ? 'bg-amber-400/15 border border-amber-400/30 text-amber-400'
                          : 'bg-white/3 border border-white/5 text-gray-400 hover:border-blue-500/30 hover:text-white'
                      }`}
                    >
                      <span className="font-bold block truncate">{link.label || link.link}</span>
                      <span className="text-gray-600 truncate block">{link.link}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Content Area */}
      <div className="px-4 md:px-0">
        {activeTab === 'content' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Action bar */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleCopy(applyLink(article.content), 999)}
                className={`${copiedIndex === 999 ? 'bg-blue-600' : 'bg-white/5 hover:bg-white/10'} text-white font-black text-[10px] uppercase tracking-widest py-2.5 px-5 rounded-xl h-auto border border-white/10`}
              >
                {copiedIndex === 999 ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                {copiedIndex === 999 ? 'Copied!' : 'Copy Article'}
              </Button>
              <Button
                onClick={() => handleDownloadImage(article.image, article.title)}
                className="bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest py-2.5 px-5 rounded-xl h-auto border border-white/10"
              >
                <Download size={14} className="mr-2" />
                Download Image
              </Button>
            </div>

            <Card className="bg-white/2 border-white/5 p-8 md:p-12 rounded-2xl relative">
              <div className="whitespace-pre-wrap text-base md:text-lg text-gray-300 font-medium leading-relaxed">
                {applyLink(article.content)}
              </div>
              {promoLink.trim() && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-5 text-center space-y-2">
                    <p className="text-sm font-bold text-white">Your Promotional Link</p>
                    <a href={promoLink.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm break-all underline">
                      {promoLink.trim()}
                    </a>
                    <p className="text-xs text-gray-500">This link has been applied to all placeholders in the article and social posts</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {article.socialPosts.map((post, i) => (
              <Card key={i} className="bg-white/2 border-white/5 p-5 rounded-2xl space-y-3 hover:border-blue-500/20 transition-all">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-600/10 text-blue-500 border-none px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{post.platform}</Badge>
                  <button onClick={() => handleCopy(applyLink(post.content), i)}
                    className={`p-2 rounded-lg transition-all ${copiedIndex === i ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white/5 hover:text-white'}`}
                  >
                    {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">&quot;{applyLink(post.content)}&quot;</p>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'share' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {article.shareDirectory.map((dir, i) => (
              <Card key={i} className="bg-white/2 border-white/5 p-6 rounded-2xl space-y-4 hover:bg-white/5 transition-all text-center">
                <div className="w-14 h-14 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center mx-auto">
                  <Globe size={28} />
                </div>
                <div className="space-y-1">
                  <h5 className="font-black text-white text-base">{dir.name}</h5>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{dir.reach} monthly reach</p>
                </div>
                <a href={dir.url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] uppercase tracking-widest py-2.5 rounded-xl h-auto">
                    <ExternalLink size={12} className="mr-2" /> Visit Community
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
