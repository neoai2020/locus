'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Image as ImageIcon, 
  Upload, 
  Wand2, 
  ArrowLeft, 
  ArrowRight,
  Check,
  FileText,
  Loader2
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
  },
  {
    id: 'mid',
    section: 'Mid-Article Image',
    suggestion: 'Data visualization or infographic',
  },
  {
    id: 'conclusion',
    section: 'Conclusion Image',
    suggestion: 'Call-to-action or engagement visual',
  },
]

export default function ImagesPage() {
  const router = useRouter()
  const { currentArticle, articles, setArticles, setCurrentArticle, updateArticle } = useAppStore()
  
  const [slotUrls, setSlotUrls] = useState<Record<string, string>>({})
  const [generatedSlots, setGeneratedSlots] = useState<Record<string, boolean>>({})
  const [generatingSlots, setGeneratingSlots] = useState<Record<string, boolean>>({})
  const [uploadingSlots, setUploadingSlots] = useState<Record<string, boolean>>({})
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({})

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
    const cleanText = content.replace(/<\/?[^>]+(>|$)/g, "")
    return cleanText
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
  }

  const handleGenerateImage = async (sectionId: string, slotIndex: number, suggestion: string) => {
    if (!currentArticle) return
    const slotId = `${sectionId}-${slotIndex}`
    
    setGeneratingSlots(prev => ({ ...prev, [slotId]: true }))
    
    try {
      // Extract a short excerpt from the article content to give the AI more context
      const contentExcerpt = stripHtml(currentArticle.content).substring(0, 300);
      
      // Construct a highly detailed prompt targeting expressive, clear, high-quality images
      const prompt = `Cinematic, highly detailed, expressive professional photography. Subject: An image conceptually representing the article titled "${currentArticle.title}". Context: "${contentExcerpt}...". Specific requirement: ${suggestion}. Style: photorealistic, 8k resolution, modern, clear, engaging. IMPORTANT: Do not include any text, letters, or words in the image.`;
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }
      
      if (data.url) {
        setSlotUrls(prev => ({ ...prev, [slotId]: data.url }))
        setGeneratedSlots(prev => ({ ...prev, [slotId]: true }))
        
        setSelectedSlots(prev => {
          if (!prev[sectionId]) return { ...prev, [sectionId]: slotId }
          return prev
        })
      } else {
        throw new Error('No image URL returned')
      }
    } catch (error: any) {
      console.error('Error generating image:', error)
      alert(error.message || "Failed to generate image. Please ensure your 'article-images' storage bucket is created and public.")
    } finally {
      setGeneratingSlots(prev => ({ ...prev, [slotId]: false }))
    }
  }

  const handleFileUpload = async (sectionId: string, slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const slotId = `${sectionId}-${slotIndex}`
    setUploadingSlots(prev => ({ ...prev, [slotId]: true }))
    
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${currentArticle?.id || Date.now()}/${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(fileName, file)
        
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(fileName)
      
      setSlotUrls(prev => ({ ...prev, [slotId]: publicUrl }))

      setSelectedSlots(prev => {
         if (!prev[sectionId]) return { ...prev, [sectionId]: slotId }
         return prev
      })
    } catch (error) {
      console.error('Upload failed:', error)
      alert("Failed to upload image. Please ensure your 'article-images' storage bucket is created and public.")
    } finally {
      setUploadingSlots(prev => ({ ...prev, [slotId]: false }))
    }
  }

  const handleContinue = () => {
    if (currentArticle) {
      const images = Object.entries(selectedSlots)
        .map(([sectionId, slotId]) => {
          const url = slotUrls[slotId]
          const sectionName = imageSections.find(s => s.id === sectionId)?.section || ''
          return url ? {
            id: slotId,
            url,
            alt: sectionName,
            section: sectionName,
            position: 'middle' as const
          } : null
        })
        .filter(Boolean)
      
      updateArticle(currentArticle.id, { images: images as any })
    }
    router.push('/publish')
  }

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
          Add visuals to increase engagement and authority. Images are optional but recommended.
        </p>
      </div>

      {/* Current Article Preview */}
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
      <div className="space-y-6">
        {imageSections.map((section, index) => (
          <Card 
            key={section.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${(index + 2) * 0.1}s` }}
          >
            <div className="mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-locus-cyan" />
                {section.section}
              </h3>
              <p className="text-sm text-locus-muted mt-1">
                {section.suggestion}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(slotIndex => {
                const slotId = `${section.id}-${slotIndex}`
                const url = slotUrls[slotId]
                const isSelected = selectedSlots[section.id] === slotId
                const hasGenerated = generatedSlots[slotId]
                const isGenerating = generatingSlots[slotId]
                const isUploading = uploadingSlots[slotId]

                return (
                  <div key={slotId} className="flex flex-col gap-3">
                    {/* Image Area */}
                    <button 
                      onClick={() => url && setSelectedSlots(prev => {
                        if (prev[section.id] === slotId) {
                           const newSelected = { ...prev }
                           delete newSelected[section.id]
                           return newSelected
                        }
                        return { ...prev, [section.id]: slotId }
                      })}
                      disabled={!url}
                      className={`
                        relative w-full aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-hidden
                        ${isSelected ? 'border-locus-teal ring-4 ring-locus-teal/20' : 'border-locus-border hover:border-locus-muted'}
                        ${!url && !isGenerating && !isUploading ? 'border-dashed bg-locus-dark/20' : ''}
                      `}
                    >
                      {url ? (
                        <>
                          <img src={url} alt={`Slot ${slotIndex + 1}`} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-locus-teal flex items-center justify-center shadow-lg transform transition-transform scale-100">
                              <Check size={18} className="text-white" />
                            </div>
                          )}
                        </>
                      ) : isGenerating ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
                          <Wand2 size={24} className="text-locus-teal animate-pulse mb-3" />
                          <span className="text-xs text-locus-muted">Generating...</span>
                        </div>
                      ) : isUploading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
                          <Loader2 size={24} className="text-locus-teal animate-spin mb-3" />
                          <span className="text-xs text-locus-muted">Uploading...</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                          <ImageIcon size={32} className="mb-3" />
                          <span className="text-sm font-medium">Empty Slot {slotIndex + 1}</span>
                        </div>
                      )}
                    </button>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 h-9 items-stretch w-full">
                      {!hasGenerated && (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="flex-1 text-xs"
                          disabled={isGenerating || isUploading}
                          onClick={() => handleGenerateImage(section.id, slotIndex, section.suggestion)}
                        >
                          <Wand2 size={14} className="mr-1" /> Generate
                        </Button>
                      )}
                      
                      <div className={`relative ${hasGenerated ? 'w-full' : 'flex-1'}`}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          key={url ? `file-${slotId}-uploaded` : `file-${slotId}-empty`}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                          onChange={(e) => handleFileUpload(section.id, slotIndex, e)} 
                          disabled={isGenerating || isUploading}
                        />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full h-full text-xs pointer-events-none"
                        >
                          <Upload size={14} className="mr-1" /> Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between mt-8 pt-8 border-t border-locus-border">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft size={18} />
          <span>Back to Editor</span>
        </Button>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => router.push('/publish')}>
            Skip Images
          </Button>
          <Button onClick={handleContinue}>
            <span>Continue to Publish</span>
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
