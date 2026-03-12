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
  MessageSquare,
  Hash,
  Twitter,
  Loader2,
  Link as LinkIcon,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  ExternalLink,
  Save,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { Article, Platform, AffiliateLink, AffiliatePlatform } from '@/types'

const platformIcons: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  quora: MessageSquare,
  medium: FileText,
  reddit: Hash,
  twitter: Twitter,
}

const affiliatePlatformIcons: Record<AffiliatePlatform, typeof ShoppingBag> = {
  digistore24: ShoppingBag,
  amazon: ShoppingCart,
  etsy: Store,
  ebay: Tag,
}

const affiliatePlatformNames: Record<AffiliatePlatform, string> = {
  digistore24: 'Digistore24',
  amazon: 'Amazon',
  etsy: 'Etsy',
  ebay: 'eBay',
}

export default function MyPortfolioPage() {
  const router = useRouter()
  const affiliateLinks = useAppStore((s) => s.affiliateLinks)

  // Tab state
  const [activeTab, setActiveTab] = useState<'articles' | 'links'>('articles')

  // Article states
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Affiliate link editing states
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ link: string; label: string }>({ link: '', label: '' })
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)

  // New affiliate link creation state
  const [showNewLinkForm, setShowNewLinkForm] = useState(false)
  const [newLinkForm, setNewLinkForm] = useState<{ name: string; link: string }>({ name: '', link: '' })

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

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        setArticles((prev) => prev.filter((a) => a.id !== id))
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
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
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
    return platformIcons[firstPlatform] || FileText
  }

  // Affiliate link handlers
  const handleCopyLink = async (link: AffiliateLink) => {
    await navigator.clipboard.writeText(link.link)
    setCopiedLinkId(link.id)
    setTimeout(() => setCopiedLinkId(null), 2000)
  }

  const startEditingLink = (link: AffiliateLink) => {
    setEditingLinkId(link.id)
    setEditForm({ link: link.link, label: link.label || '' })
  }

  const saveEditingLink = () => {
    if (!editingLinkId) return
    useAppStore.getState().updateAffiliateLink(editingLinkId, {
      link: editForm.link,
      label: editForm.label || undefined,
      updated_at: new Date().toISOString(),
    })
    setEditingLinkId(null)
    setEditForm({ link: '', label: '' })
  }

  const cancelEditingLink = () => {
    setEditingLinkId(null)
    setEditForm({ link: '', label: '' })
  }

  const handleDeleteLink = (id: string) => {
    useAppStore.getState().deleteAffiliateLink(id)
  }

  const handleCreateLink = () => {
    if (!newLinkForm.name.trim() || !newLinkForm.link.trim()) return
    const newLink: AffiliateLink = {
      id: crypto.randomUUID(),
      link: newLinkForm.link.trim(),
      label: newLinkForm.name.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    useAppStore.getState().addAffiliateLink(newLink)
    setNewLinkForm({ name: '', link: '' })
    setShowNewLinkForm(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          My Portfolio
        </h1>
        <p className="text-locus-muted">Manage your articles and promotional links</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-8 animate-fade-in stagger-1">
        <button
          onClick={() => setActiveTab('articles')}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
            ${
              activeTab === 'articles'
                ? 'bg-locus-teal text-white shadow-[0_0_20px_rgba(45,212,191,0.15)]'
                : 'bg-[rgba(255,255,255,0.05)] text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.08)]'
            }
          `}
        >
          <FileText size={16} />
          Articles
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
            ${
              activeTab === 'links'
                ? 'bg-locus-teal text-white shadow-[0_0_20px_rgba(45,212,191,0.15)]'
                : 'bg-[rgba(255,255,255,0.05)] text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.08)]'
            }
          `}
        >
          <LinkIcon size={16} />
          Promotional Links
        </button>
      </div>

      {/* ─── Articles Tab ─── */}
      {activeTab === 'articles' && (
        <>
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
                    ${
                      statusFilter === status
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
              <p className="text-2xl font-bold text-white">
                {articles.filter((a) => a.status === 'draft').length}
              </p>
              <p className="text-sm text-locus-muted">Drafts</p>
            </Card>
            <Card className="p-4">
              <p className="text-2xl font-bold text-white">
                {articles.filter((a) => a.status === 'published').length}
              </p>
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
                      <div className="w-10 h-10 rounded-xl bg-locus-border flex items-center justify-center shrink-0">
                        <PlatformIcon size={20} className="text-locus-muted" />
                      </div>

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

                          <div
                            className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" size="sm" onClick={() => handleCopy(article)}>
                              {copiedId === article.id ? <Check size={16} /> : <Copy size={16} />}
                            </Button>

                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setOpenMenu(openMenu === article.id ? null : article.id)
                                }
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
                  : 'No saved articles yet'}
              </p>
              <p className="text-sm text-locus-muted opacity-75 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first article to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => router.push('/create')}>Create Article</Button>
              )}
            </Card>
          )}
        </>
      )}

      {/* ─── Promotional Links Tab ─── */}
      {activeTab === 'links' && (
        <div className="space-y-6 animate-fade-in">
          {/* Add New Link Button / Form */}
          {showNewLinkForm ? (
            <Card className="border-locus-teal/30">
              <h3 className="font-semibold text-white mb-4">Create New Promotional Link</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-locus-muted mb-1 block">Name</label>
                  <Input
                    value={newLinkForm.name}
                    onChange={(e) => setNewLinkForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. My Fitness eBook, Keto Supplement, etc."
                  />
                </div>
                <div>
                  <label className="text-xs text-locus-muted mb-1 block">URL</label>
                  <Input
                    value={newLinkForm.link}
                    onChange={(e) => setNewLinkForm((prev) => ({ ...prev, link: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={handleCreateLink}
                    disabled={!newLinkForm.name.trim() || !newLinkForm.link.trim()}
                  >
                    <Save size={14} />
                    <span>Save Link</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowNewLinkForm(false); setNewLinkForm({ name: '', link: '' }) }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Button onClick={() => setShowNewLinkForm(true)}>
              <LinkIcon size={16} />
              <span>Create New Promotional Link</span>
            </Button>
          )}

          {/* Links List */}
          {affiliateLinks.length > 0 ? (
            <div className="space-y-4">
              {affiliateLinks.map((link, index) => {
                const Icon = LinkIcon
                const isEditing = editingLinkId === link.id

                return (
                  <Card
                    key={link.id}
                    className="animate-fade-in hover:border-locus-teal/30 transition-all"
                    style={{ animationDelay: `${(index + 1) * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-locus-border flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-locus-teal" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-locus-muted mb-1 block">Name</label>
                              <Input
                                value={editForm.label}
                                onChange={(e) =>
                                  setEditForm((prev) => ({ ...prev, label: e.target.value }))
                                }
                                placeholder="e.g. My top product"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-locus-muted mb-1 block">URL</label>
                              <Input
                                value={editForm.link}
                                onChange={(e) =>
                                  setEditForm((prev) => ({ ...prev, link: e.target.value }))
                                }
                                placeholder="https://..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveEditingLink}>
                                <Save size={14} />
                                <span>Save</span>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={cancelEditingLink}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-white mb-0.5">
                                  {link.label || 'Promotional Link'}
                                </h3>
                                <p className="text-sm text-locus-muted truncate max-w-md">
                                  {link.link}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyLink(link)}
                                >
                                  {copiedLinkId === link.id ? (
                                    <Check size={16} className="text-locus-teal" />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditingLink(link)}
                                >
                                  <Edit3 size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteLink(link.id)}
                                >
                                  <Trash2 size={16} className="text-locus-error" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-locus-muted mt-2">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {formatDate(link.created_at)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : !showNewLinkForm ? (
            <Card className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-locus-border flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="text-locus-muted" size={28} />
              </div>
              <p className="text-locus-muted mb-2">No promotional links saved yet</p>
              <p className="text-sm text-locus-muted opacity-75 mb-6">
                Add your first promotional link to start building your portfolio
              </p>
              <Button onClick={() => setShowNewLinkForm(true)}>
                <LinkIcon size={16} />
                <span>Create New Promotional Link</span>
              </Button>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}
