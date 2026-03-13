import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Article, ArticleImage, AffiliateLink, UpsellType, User } from '@/types'

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  
  articles: Article[]
  currentArticle: Article | null
  setArticles: (articles: Article[]) => void
  setCurrentArticle: (article: Article | null) => void
  addArticle: (article: Article) => void
  updateArticle: (id: string, updates: Partial<Article>) => void
  deleteArticle: (id: string) => void

  // Dedicated image storage — never overwritten by API fetches
  articleImages: Record<string, ArticleImage[]>
  saveArticleImages: (articleId: string, images: ArticleImage[]) => void
  getArticleImages: (articleId: string) => ArticleImage[]
  deleteArticleImages: (articleId: string) => void

  affiliateLinks: AffiliateLink[]
  setAffiliateLinks: (links: AffiliateLink[]) => void
  addAffiliateLink: (link: AffiliateLink) => void
  updateAffiliateLink: (id: string, updates: Partial<AffiliateLink>) => void
  deleteAffiliateLink: (id: string) => void
  
  unlockedUpsells: UpsellType[]
  unlockUpsell: (type: UpsellType) => void
  isUpsellUnlocked: (type: UpsellType) => boolean
  
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      articles: [],
      currentArticle: null,
      setArticles: (articles) => set({ articles }),
      setCurrentArticle: (article) => set({ currentArticle: article }),
      addArticle: (article) => set((state) => ({ 
        articles: [article, ...state.articles] 
      })),
      updateArticle: (id, updates) => set((state) => ({
        articles: state.articles.map(a => 
          a.id === id ? { ...a, ...updates } : a
        ),
        currentArticle: state.currentArticle?.id === id 
          ? { ...state.currentArticle, ...updates }
          : state.currentArticle
      })),
      deleteArticle: (id) => set((state) => ({
        articles: state.articles.filter(a => a.id !== id),
        currentArticle: state.currentArticle?.id === id 
          ? null 
          : state.currentArticle
      })),

      articleImages: {},
      saveArticleImages: (articleId, images) => set((state) => ({
        articleImages: { ...state.articleImages, [articleId]: images }
      })),
      getArticleImages: (articleId) => get().articleImages[articleId] || [],
      deleteArticleImages: (articleId) => set((state) => {
        const next = { ...state.articleImages }
        delete next[articleId]
        return { articleImages: next }
      }),
      
      affiliateLinks: [],
      setAffiliateLinks: (links) => set({ affiliateLinks: links }),
      addAffiliateLink: (link) => set((state) => ({
        affiliateLinks: [link, ...state.affiliateLinks]
      })),
      updateAffiliateLink: (id, updates) => set((state) => ({
        affiliateLinks: state.affiliateLinks.map(l =>
          l.id === id ? { ...l, ...updates } : l
        )
      })),
      deleteAffiliateLink: (id) => set((state) => ({
        affiliateLinks: state.affiliateLinks.filter(l => l.id !== id)
      })),

      unlockedUpsells: [],
      unlockUpsell: (type) => set((state) => ({
        unlockedUpsells: state.unlockedUpsells.includes(type)
          ? state.unlockedUpsells
          : [...state.unlockedUpsells, type]
      })),
      isUpsellUnlocked: (type) => get().unlockedUpsells.includes(type),
      
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),
    }),
    {
      name: 'locus-storage',
      partialize: (state) => ({
        articles: state.articles,
        currentArticle: state.currentArticle,
        articleImages: state.articleImages,
        affiliateLinks: state.affiliateLinks,
        unlockedUpsells: state.unlockedUpsells,
      }),
    }
  )
)
