'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Search, 
  Edit3,
  Copy,
  Trash2,
  Send,
  MoreVertical,
  Clock,
  Check,
  Linkedin,
  Mail,
  Globe,
  Loader2
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { Article, Platform } from '@/types'

const platformIcons: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  medium: FileText,
  substack: Mail,
  general: Globe,
}

export default function SavedArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Fetch articles from database
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        const fetchedArticles = data.articles || []
        setArticles(fetchedArticles)
        useAppStore.getState().setArticles(fetchedArticles)
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCopy = async (article: Article) => {
    await navigator.clipboard.writeText(article.content)
    setCopiedId(article.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setArticles(prev => prev.filter(a => a.id !== id))
        useAppStore.getState().deleteArticle(id)
      }
    } catch (error) {
      console.error('Failed to delete article:', error)
    }
    setOpenMenu(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  const getPlatformDisplay = (platform: Platform | string[]) => {
    if (Array.isArray(platform)) {
      return platform.join(', ')
    }
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  const getPlatformIcon = (platform: Platform | string[]) => {
    const firstPlatform = Array.isArray(platform) ? platform[0] : platform
    return platformIcons[firstPlatform] || Globe
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Saved Articles
        </h1>
        <p className="text-locus-muted">
          Manage and reuse your content library
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in stagger-1">
        <div className="flex-1">
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'published'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${statusFilter === status 
                  ? 'bg-locus-teal text-white' 
                  : 'bg-[rgba(255,255,255,0.05)] text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.08)]'
                }
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in stagger-2">
        <Card className="p-4">
          <p className="text-2xl font-bold text-white">{articles.length}</p>
          <p className="text-sm text-locus-muted">Total Articles</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-white">{articles.filter(a => a.status === 'draft').length}</p>
          <p className="text-sm text-locus-muted">Drafts</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-white">{articles.filter(a => a.status === 'published').length}</p>
          <p className="text-sm text-locus-muted">Published</p>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-locus-teal mb-4" />
          <p className="text-locus-muted">Loading your articles...</p>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="space-y-4">
          {filteredArticles.map((article, index) => {
            const PlatformIcon = getPlatformIcon(article.platform)
            
            return (
              <Card 
                key={article.id}
                className="animate-fade-in group cursor-pointer hover:border-locus-teal/50 hover:bg-[rgba(255,255,255,0.02)] transition-all"
                style={{ animationDelay: `${(index + 3) * 0.05}s` }}
                onClick={() => {
                  useAppStore.getState().setCurrentArticle(article)
                  router.push('/create')
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Platform Icon */}
                  <div className="w-10 h-10 rounded-xl bg-locus-border flex items-center justify-center shrink-0">
                    <PlatformIcon size={20} className="text-locus-muted" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-white mb-1 line-clamp-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-locus-muted">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(article.created_at)}
                          </span>
                          <Badge 
                            variant={article.status === 'published' ? 'success' : 'purple'}
                            className="text-xs"
                          >
                            {article.status}
                          </Badge>
                          <Badge variant="cyan" className="text-xs">
                            {getPlatformDisplay(article.platform)}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                        <div 
                          className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy(article)}
                          >
                            {copiedId === article.id ? <Check size={16} /> : <Copy size={16} />}
                          </Button>
                          
                          {/* More Menu */}
                          <div className="relative">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setOpenMenu(openMenu === article.id ? null : article.id)}
                            >
                              <MoreVertical size={16} />
                            </Button>
                          
                          {openMenu === article.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-locus-card border border-locus-border rounded-xl py-1 z-10 shadow-xl">
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="w-full px-4 py-2 text-left text-sm text-locus-error hover:bg-[rgba(239,68,68,0.1)] flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-locus-muted line-clamp-2">
                      {stripHtml(article.content).substring(0, 200)}...
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="animate-fade-in text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-locus-border flex items-center justify-center mx-auto mb-4">
            <FileText className="text-locus-muted" size={28} />
          </div>
          <p className="text-locus-muted mb-2">
            {searchQuery || statusFilter !== 'all' 
              ? 'No articles match your search' 
              : 'No saved articles yet'
            }
          </p>
          <p className="text-sm text-locus-muted opacity-75 mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Create your first article to get started'
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => router.push('/create')}>
              Create Article
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
