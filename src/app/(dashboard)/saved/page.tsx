'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Search, 
  Filter,
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
  ChevronDown
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { Article, Platform } from '@/types'

const platformIcons: Record<Platform, typeof Linkedin> = {
  linkedin: Linkedin,
  medium: FileText,
  substack: Mail,
  general: Globe,
}

export default function SavedArticlesPage() {
  const router = useRouter()
  const { articles, setCurrentArticle, deleteArticle, addArticle } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEdit = (article: Article) => {
    setCurrentArticle(article)
    router.push('/create')
  }

  const handleDuplicate = (article: Article) => {
    const duplicate: Article = {
      ...article,
      id: crypto.randomUUID(),
      title: `${article.title} (Copy)`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    addArticle(duplicate)
    setOpenMenu(null)
  }

  const handleCopy = async (article: Article) => {
    await navigator.clipboard.writeText(article.content)
    setCopiedId(article.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = (id: string) => {
    deleteArticle(id)
    setOpenMenu(null)
  }

  const handlePublish = (article: Article) => {
    setCurrentArticle(article)
    router.push('/publish')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Saved Articles
        </h1>
        <p className="text-[var(--color-burst-muted)]">
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
                  ? 'bg-[var(--color-burst-purple)] text-white' 
                  : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-burst-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.08)]'
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
          <p className="text-sm text-[var(--color-burst-muted)]">Total Articles</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-white">{articles.filter(a => a.status === 'draft').length}</p>
          <p className="text-sm text-[var(--color-burst-muted)]">Drafts</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-white">{articles.filter(a => a.status === 'published').length}</p>
          <p className="text-sm text-[var(--color-burst-muted)]">Published</p>
        </Card>
      </div>

      {/* Articles List */}
      {filteredArticles.length > 0 ? (
        <div className="space-y-4">
          {filteredArticles.map((article, index) => {
            const PlatformIcon = platformIcons[article.platform]
            
            return (
              <Card 
                key={article.id}
                className="animate-fade-in group"
                style={{ animationDelay: `${(index + 3) * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* Platform Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-burst-border)] flex items-center justify-center flex-shrink-0">
                    <PlatformIcon size={20} className="text-[var(--color-burst-muted)]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-white mb-1 line-clamp-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-[var(--color-burst-muted)]">
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
                            {article.platform}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(article)}
                        >
                          {copiedId === article.id ? <Check size={16} /> : <Copy size={16} />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePublish(article)}
                        >
                          <Send size={16} />
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
                            <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--color-burst-card)] border border-[var(--color-burst-border)] rounded-xl py-1 z-10 shadow-xl">
                              <button
                                onClick={() => handleDuplicate(article)}
                                className="w-full px-4 py-2 text-left text-sm text-[var(--color-burst-text)] hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2"
                              >
                                <Copy size={14} />
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="w-full px-4 py-2 text-left text-sm text-[var(--color-burst-error)] hover:bg-[rgba(239,68,68,0.1)] flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-[var(--color-burst-muted)] line-clamp-2">
                      {article.content.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="animate-fade-in text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-burst-border)] flex items-center justify-center mx-auto mb-4">
            <FileText className="text-[var(--color-burst-muted)]" size={28} />
          </div>
          <p className="text-[var(--color-burst-muted)] mb-2">
            {searchQuery || statusFilter !== 'all' 
              ? 'No articles match your search' 
              : 'No saved articles yet'
            }
          </p>
          <p className="text-sm text-[var(--color-burst-muted)] opacity-75 mb-6">
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
