'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Image as ImageIcon, 
  Upload, 
  Wand2, 
  ArrowLeft, 
  Check,
  FileText,
  Loader2,
  Eye,
  Save,
  Send,
  X
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'
import { createClient } from '@/lib/supabase/client'

const imageSections = [
  {
    id: 'header',
    section: 'Header Image',
    suggestion: 'Professional hero image related to your topic',
    position: 'top' as const,
  },
  {
    id: 'mid',
    section: 'Mid-Article Image',
    suggestion: 'Data visualization or infographic',
    position: 'middle' as const,
  },
  {
    id: 'conclusion',
    section: 'Conclusion Image',
    suggestion: 'Call-to-action or engagement visual',
    position: 'bottom' as const,
  },
]

export default function ImagesPage() {
  const router = useRouter()
  const { currentArticle, articles, setArticles, setCurrentArticle, updateArticle } = useAppStore()
  
  const [slotUrls, setSlotUrls] = useState<Record<string, string>>({})
  const [generatingSlots, setGeneratingSlots] = useState<Record<string, boolean>>({})
  const [uploadingSlots, setUploadingSlots] = useState<Record<string, boolean>>({})
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (articles.length === 0) {
      fetchArticles()
    }
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    }
  }

  const stripHtml = (content: string) => {
    if (!content) return ''
    return content
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
  }

  const getSelectedImages = () => {
    return imageSections
      .map(section => {
        const slotId = selectedSlots[section.id]
        const url = slotId ? slotUrls[slotId] : null
        if (!url) return null
        return {
          id: slotId,
          url,
          alt: section.section,
          section: section.section,
          position: section.position,
        }
      })
      .filter(Boolean)
  }

  const hasAnyImage = Object.keys(selectedSlots).length > 0

  const handleGenerateImage = async (sectionId: string, slotIndex: number, suggestion: string) => {
    if (!currentArticle) return
    const slotId = `${sectionId}-${slotIndex}`
    
    setGeneratingSlots(prev => ({ ...prev, [slotId]: true }))
    
    try {
      const contentExcerpt = stripHtml(currentArticle.content).substring(0, 300)
      const prompt = `Cinematic, highly detailed, expressive professional photography. Subject: An image conceptually representing the article titled "${currentArticle.title}". Context: "${contentExcerpt}...". Specific requirement: ${suggestion}. Style: photorealistic, 8k resolution, modern, clear, engaging. IMPORTANT: Do not include any text, letters, or words in the image.`
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate image')
      
      if (data.url) {
        setSlotUrls(prev => ({ ...prev, [slotId]: data.url }))
      } else {
        throw new Error('No image URL returned')
      }
    } catch (error: any) {
      console.error('Error generating image:', error)
      alert(error.message || 'Failed to generate image.')
    } finally {
      setGeneratingSlots(prev => ({ ...prev, [slotId]: false }))
    }
  }

  const handleFileUpload = async (sectionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const slotId = `${sectionId}-upload`
    setUploadingSlots(prev => ({ ...prev, [slotId]: true }))
    
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${currentArticle?.id || Date.now()}/${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error } = await supabase.storage
        .from('article-images')
        .upload(fileName, file)
        
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(fileName)
      
      setSlotUrls(prev => ({ ...prev, [slotId]: publicUrl }))
      setSelectedSlots(prev => ({ ...prev, [sectionId]: slotId }))
    } catch (error) {
      console.error('Upload failed:', error)
      alert("Failed to upload image.")
    } finally {
      setUploadingSlots(prev => ({ ...prev, [slotId]: false }))
    }
  }

  const handleSaveArticle = async (navigateToPublish = false) => {
    if (!currentArticle) return
    setIsSaving(true)
    setSaveError('')

    try {
      const images = getSelectedImages()

      const updatedArticle = { ...currentArticle, images: images as any }
      updateArticle(currentArticle.id, updatedArticle)
      setCurrentArticle(updatedArticle)

      try {
        const response = await fetch(`/api/articles?id=${currentArticle.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.article) {
            updateArticle(data.article.id, data.article)
            setCurrentArticle(data.article)
          }
        }
      } catch (apiErr) {
        console.warn('API save failed, images saved locally:', apiErr)
      }

      if (navigateToPublish) {
        router.push('/publish')
      } else {
        router.push('/saved')
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Please try again.')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (viewMode) {
      setViewMode(false)
    } else {
      router.back()
    }
  }

  // ═══════════════ ARTICLE PREVIEW MODE ═══════════════
  if (viewMode && currentArticle) {
    const images = getSelectedImages()
    const headerImg = images.find(img => img?.position === 'top')
    const midImg = images.find(img => img?.position === 'middle')
    const conclusionImg = images.find(img => img?.position === 'bottom')

    const contentText = stripHtml(currentArticle.content)
    const paragraphs = contentText.split(/\n\n+/).filter(p => p.trim())
    const midPoint = Math.floor(paragraphs.length / 2)

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <Button variant="ghost" onClick={() => setViewMode(false)} className="mb-4">
            <ArrowLeft size={18} />
            <span>Back to Image Selection</span>
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Article Preview
          </h1>
          <p className="text-locus-muted">Review your article with images before saving</p>
        </div>

        <Card className="animate-fade-in stagger-1 p-0 overflow-hidden">
          {/* Header Image */}
          {headerImg && (
            <div className="w-full aspect-21/9 relative">
              <img src={headerImg.url} alt={headerImg.alt} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-locus-card to-transparent" />
            </div>
          )}

          <div className="p-8 prose-locus">
            <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {currentArticle.title}
            </h1>

            {/* First half of content */}
            {paragraphs.slice(0, midPoint).map((p, i) => (
              <p key={i} className="text-locus-text mb-4 leading-relaxed">{p}</p>
            ))}

            {/* Mid-Article Image */}
            {midImg && (
              <div className="my-8 rounded-xl overflow-hidden border border-locus-border">
                <img src={midImg.url} alt={midImg.alt} className="w-full object-cover" />
              </div>
            )}

            {/* Second half of content */}
            {paragraphs.slice(midPoint).map((p, i) => (
              <p key={i + midPoint} className="text-locus-text mb-4 leading-relaxed">{p}</p>
            ))}

            {/* Conclusion Image */}
            {conclusionImg && (
              <div className="mt-8 rounded-xl overflow-hidden border border-locus-border">
                <img src={conclusionImg.url} alt={conclusionImg.alt} className="w-full object-cover" />
              </div>
            )}
          </div>
        </Card>

        {saveError && (
          <div className="mt-4 p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-locus-error text-sm">
            {saveError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t border-locus-border animate-fade-in stagger-2">
          <Button variant="ghost" onClick={handleCancel}>
            <X size={18} />
            <span>Cancel</span>
          </Button>
          
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => handleSaveArticle(false)}
              loading={isSaving}
            >
              <Save size={18} />
              <span>Save Article</span>
            </Button>
            <Button
              onClick={() => handleSaveArticle(true)}
              loading={isSaving}
            >
              <Send size={18} />
              <span>Save & Publish</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════ IMAGE SELECTION MODE ═══════════════
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Enhance with Images
        </h1>
        <p className="text-locus-muted">
          Generate or upload images for your article. Select one per section.
        </p>
      </div>

      {/* Article Selector */}
      {currentArticle ? (
        <Card className="mb-8 animate-fade-in stagger-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="purple">
                  {Array.isArray(currentArticle.platform) ? currentArticle.platform[0] : currentArticle.platform}
                </Badge>
                <button 
                  onClick={() => setCurrentArticle(null)}
                  className="text-xs text-locus-muted hover:text-white transition-colors"
                >
                  Change article
                </button>
              </div>
              <h2 className="text-lg font-semibold text-white">{currentArticle.title}</h2>
              <p className="text-sm text-locus-muted mt-1 line-clamp-2">
                {stripHtml(currentArticle.content).substring(0, 150)}...
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-8 animate-fade-in stagger-1 border-dashed border-locus-border">
          <div className="max-w-md mx-auto py-6 text-center">
            <h2 className="text-white font-medium mb-2">Select an Article</h2>
            <p className="text-locus-muted text-sm mb-6">Choose an article from your library to enhance with visuals</p>
            
            <div className="flex flex-col gap-4">
              <Select
                options={[
                  { value: '', label: 'Select an article...' },
                  ...articles.map(a => ({ value: a.id, label: a.title }))
                ]}
                onChange={(e) => {
                  const article = articles.find(a => a.id === e.target.value)
                  if (article) setCurrentArticle(article)
                }}
                className="text-left"
              />
              
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="h-px bg-locus-border flex-1" />
                <span className="text-xs text-locus-muted">OR</span>
                <div className="h-px bg-locus-border flex-1" />
              </div>

              <Button variant="ghost" size="sm" onClick={() => router.push('/saved')} className="w-full">
                <FileText size={16} className="mr-2" />
                Browse Saved Articles
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Image Sections */}
      <div className="space-y-8">
        {imageSections.map((section, index) => {
          const isUploading = uploadingSlots[`${section.id}-upload`]
          const uploadUrl = slotUrls[`${section.id}-upload`]

          return (
            <Card 
              key={section.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <div className="mb-5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-locus-cyan" />
                  {section.section}
                </h3>
                <p className="text-sm text-locus-muted mt-1">{section.suggestion}</p>
              </div>

              {/* AI Generated Options */}
              <div className="mb-5">
                <p className="text-xs text-locus-muted font-medium uppercase tracking-wider mb-3">
                  AI Generated — click to select
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map(slotIndex => {
                    const slotId = `${section.id}-${slotIndex}`
                    const url = slotUrls[slotId]
                    const isSelected = selectedSlots[section.id] === slotId
                    const isGenerating = generatingSlots[slotId]

                    return (
                      <div key={slotId} className="flex flex-col gap-2">
                        <button 
                          onClick={() => url && setSelectedSlots(prev => {
                            if (prev[section.id] === slotId) {
                              const next = { ...prev }
                              delete next[section.id]
                              return next
                            }
                            return { ...prev, [section.id]: slotId }
                          })}
                          disabled={!url}
                          className={`
                            relative w-full aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-hidden
                            ${isSelected ? 'border-locus-teal ring-4 ring-locus-teal/20' : 'border-locus-border hover:border-locus-muted'}
                            ${!url && !isGenerating ? 'border-dashed bg-locus-dark/20' : ''}
                          `}
                        >
                          {url ? (
                            <>
                              <img src={url} alt={`Option ${slotIndex + 1}`} className="w-full h-full object-cover" />
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-locus-teal flex items-center justify-center shadow-lg">
                                  <Check size={16} className="text-white" />
                                </div>
                              )}
                            </>
                          ) : isGenerating ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <Wand2 size={22} className="text-locus-teal animate-pulse mb-2" />
                              <span className="text-[11px] text-locus-muted">Generating...</span>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                              <ImageIcon size={24} className="mb-2" />
                              <span className="text-[11px]">Option {slotIndex + 1}</span>
                            </div>
                          )}
                        </button>

                        {!url && !isGenerating && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="text-xs w-full"
                            disabled={!currentArticle}
                            onClick={() => handleGenerateImage(section.id, slotIndex, section.suggestion)}
                          >
                            <Wand2 size={13} className="mr-1" /> Generate
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-5">
                <div className="h-px bg-locus-border flex-1" />
                <span className="text-xs text-locus-muted font-medium">OR UPLOAD YOUR OWN</span>
                <div className="h-px bg-locus-border flex-1" />
              </div>

              {/* Upload Option */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={(e) => handleFileUpload(section.id, e)} 
                    disabled={isUploading || !currentArticle}
                  />
                  <Button variant="secondary" size="sm" className="pointer-events-none">
                    {isUploading ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Upload size={14} className="mr-1" />}
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>

                {uploadUrl && (
                  <div className="flex items-center gap-3">
                    <img src={uploadUrl} alt="Uploaded" className="w-16 h-10 object-cover rounded-lg border border-locus-border" />
                    {selectedSlots[section.id] === `${section.id}-upload` ? (
                      <Badge variant="success">Selected</Badge>
                    ) : (
                      <button
                        onClick={() => setSelectedSlots(prev => ({ ...prev, [section.id]: `${section.id}-upload` }))}
                        className="text-xs text-locus-teal hover:underline"
                      >
                        Use this image
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between mt-8 pt-8 border-t border-locus-border">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </Button>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => router.push('/saved')}>
            Skip Images
          </Button>
          <Button 
            onClick={() => setViewMode(true)} 
            disabled={!hasAnyImage || !currentArticle}
          >
            <Eye size={18} />
            <span>View Article</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
