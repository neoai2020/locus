'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Wand2, 
  ArrowLeft, 
  ArrowRight,
  Check,
  X,
  Plus
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAppStore } from '@/store'

const imageSuggestions = [
  {
    id: '1',
    section: 'Header',
    suggestion: 'Professional hero image related to your topic',
    placeholder: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  },
  {
    id: '2',
    section: 'Mid-Article',
    suggestion: 'Data visualization or infographic',
    placeholder: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    id: '3',
    section: 'Conclusion',
    suggestion: 'Call-to-action or engagement visual',
    placeholder: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80',
  },
]

export default function ImagesPage() {
  const router = useRouter()
  const { currentArticle, updateArticle } = useAppStore()
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>({})
  const [uploadingSection, setUploadingSection] = useState<string | null>(null)

  const handleSelectSuggestion = (sectionId: string, url: string) => {
    setSelectedImages(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] === url ? '' : url
    }))
  }

  const handleFileUpload = async (sectionId: string, file: File) => {
    // In a real app, upload to storage and get URL
    const url = URL.createObjectURL(file)
    setSelectedImages(prev => ({
      ...prev,
      [sectionId]: url
    }))
    setUploadingSection(null)
  }

  const handleContinue = () => {
    if (currentArticle) {
      const images = Object.entries(selectedImages)
        .filter(([, url]) => url)
        .map(([id, url]) => ({
          id,
          url,
          alt: imageSuggestions.find(s => s.id === id)?.section || '',
          section: imageSuggestions.find(s => s.id === id)?.section || '',
          position: 'middle' as const
        }))
      
      updateArticle(currentArticle.id, { images })
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
        <p className="text-[var(--color-burst-muted)]">
          Add visuals to increase engagement and authority. Images are optional but recommended.
        </p>
      </div>

      {/* Current Article Preview */}
      {currentArticle && (
        <Card className="mb-8 animate-fade-in stagger-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2">{currentArticle.platform}</Badge>
              <h2 className="text-lg font-semibold text-white">{currentArticle.title}</h2>
              <p className="text-sm text-[var(--color-burst-muted)] mt-1 line-clamp-2">
                {currentArticle.content.substring(0, 150)}...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Image Suggestions */}
      <div className="space-y-6">
        {imageSuggestions.map((suggestion, index) => (
          <Card 
            key={suggestion.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${(index + 2) * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-[var(--color-burst-cyan)]" />
                  {suggestion.section} Image
                </h3>
                <p className="text-sm text-[var(--color-burst-muted)] mt-1">
                  {suggestion.suggestion}
                </p>
              </div>
              {selectedImages[suggestion.id] && (
                <Badge variant="success">
                  <Check size={12} className="mr-1" />
                  Selected
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* AI Suggestion */}
              <button
                onClick={() => handleSelectSuggestion(suggestion.id, suggestion.placeholder)}
                className={`
                  relative rounded-xl overflow-hidden border-2 transition-all duration-200 group
                  ${selectedImages[suggestion.id] === suggestion.placeholder 
                    ? 'border-[var(--color-burst-purple)] ring-2 ring-[rgba(139,92,246,0.3)]' 
                    : 'border-[var(--color-burst-border)] hover:border-[var(--color-burst-purple)]'
                  }
                `}
              >
                <div className="aspect-video relative">
                  <img 
                    src={suggestion.placeholder} 
                    alt={suggestion.suggestion}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] flex items-center justify-center">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <span className="text-xs text-white font-medium">AI Suggestion</span>
                  </div>
                  {selectedImages[suggestion.id] === suggestion.placeholder && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--color-burst-purple)] flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>
              </button>

              {/* Upload Option */}
              <label
                className={`
                  relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                  ${uploadingSection === suggestion.id 
                    ? 'border-[var(--color-burst-purple)] bg-[rgba(139,92,246,0.05)]' 
                    : 'border-[var(--color-burst-border)] hover:border-[var(--color-burst-purple)] hover:bg-[rgba(255,255,255,0.02)]'
                  }
                `}
              >
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(suggestion.id, file)
                  }}
                />
                <div className="aspect-video flex flex-col items-center justify-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-burst-border)] flex items-center justify-center mb-3">
                    <Upload size={20} className="text-[var(--color-burst-muted)]" />
                  </div>
                  <span className="text-sm text-[var(--color-burst-muted)]">Upload your own</span>
                  <span className="text-xs text-[var(--color-burst-muted)] opacity-75 mt-1">PNG, JPG up to 5MB</span>
                </div>
              </label>

              {/* Custom Uploaded Image or Skip */}
              {selectedImages[suggestion.id] && selectedImages[suggestion.id] !== suggestion.placeholder ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-[var(--color-burst-purple)] ring-2 ring-[rgba(139,92,246,0.3)]">
                  <div className="aspect-video relative">
                    <img 
                      src={selectedImages[suggestion.id]} 
                      alt="Custom upload"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedImages(prev => ({ ...prev, [suggestion.id]: '' }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--color-burst-error)] flex items-center justify-center hover:bg-opacity-80 transition-colors"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedImages(prev => ({ ...prev, [suggestion.id]: '' }))}
                  className="rounded-xl border-2 border-[var(--color-burst-border)] hover:border-[var(--color-burst-muted)] transition-all duration-200"
                >
                  <div className="aspect-video flex flex-col items-center justify-center p-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-burst-border)] flex items-center justify-center mb-3">
                      <X size={20} className="text-[var(--color-burst-muted)]" />
                    </div>
                    <span className="text-sm text-[var(--color-burst-muted)]">Skip this section</span>
                    <span className="text-xs text-[var(--color-burst-muted)] opacity-75 mt-1">No image needed</span>
                  </div>
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between mt-8 pt-8 border-t border-[var(--color-burst-border)]">
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
