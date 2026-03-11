import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Article, UpsellType, User } from '@/types'

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  
  // Articles state
  articles: Article[]
  currentArticle: Article | null
  setArticles: (articles: Article[]) => void
  setCurrentArticle: (article: Article | null) => void
  addArticle: (article: Article) => void
  updateArticle: (id: string, updates: Partial<Article>) => void
  deleteArticle: (id: string) => void
  
  // Upsell state
  unlockedUpsells: UpsellType[]
  unlockUpsell: (type: UpsellType) => void
  isUpsellUnlocked: (type: UpsellType) => boolean
  
  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Generation state
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Articles
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
      
      // Upsells
      unlockedUpsells: [],
      unlockUpsell: (type) => set((state) => ({
        unlockedUpsells: state.unlockedUpsells.includes(type)
          ? state.unlockedUpsells
          : [...state.unlockedUpsells, type]
      })),
      isUpsellUnlocked: (type) => get().unlockedUpsells.includes(type),
      
      // UI
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Generation
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),
    }),
    {
      name: 'locus-storage',
      partialize: (state) => ({
        articles: state.articles,
        unlockedUpsells: state.unlockedUpsells,
      }),
    }
  )
)
