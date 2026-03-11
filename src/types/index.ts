export type Platform = 'linkedin' | 'medium' | 'substack' | 'general'

export type ArticleTone = 'authoritative' | 'conversational' | 'bold'

export type ArticleLength = 'short' | 'medium' | 'long'

export type ArticleStatus = 'draft' | 'published'

export interface Article {
  id: string
  user_id: string
  title: string
  content: string
  platform: Platform | string[]
  tone: ArticleTone
  length: ArticleLength
  status: ArticleStatus
  affiliate_link?: string
  niche?: string
  hook?: string
  cta?: string
  images?: ArticleImage[]
  created_at: string
  updated_at: string
}

export interface ArticleImage {
  id: string
  url: string
  alt: string
  section: string
  position: 'top' | 'middle' | 'bottom'
}

export type UpsellType = '10x' | 'infinite' | 'automation' | 'dfy'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  upsells_unlocked: UpsellType[]
  articles_generated: number
  created_at: string
}

export interface GenerateArticleInput {
  topic: string
  platform?: Platform
  platforms?: string[]
  tone: ArticleTone
  length: ArticleLength
  affiliateLink?: string
  niche?: string
}

export interface GeneratedArticle {
  hook: string
  body: string
  cta: string
  fullContent: string
}

export interface DashboardStats {
  articlesGenerated: number
  savedDrafts: number
  publishedArticles: number
}

export interface UpsellConfig {
  type: UpsellType
  name: string
  description: string
  headline: string
  features: string[]
  icon: string
}

export const UPSELL_CONFIGS: Record<UpsellType, UpsellConfig> = {
  '10x': {
    type: '10x',
    name: '10X Mode',
    description: 'Generate 10 variations instantly',
    headline: 'Multiply Your Content Output by 10X',
    features: [
      '10 article variations per topic',
      'Multiple hook styles',
      'Batch generation',
      'A/B test your content'
    ],
    icon: 'Zap'
  },
  'infinite': {
    type: 'infinite',
    name: 'Infinite Mode',
    description: 'Remove all limits',
    headline: 'Unlimited Everything. No Restrictions.',
    features: [
      'Unlimited article generations',
      'Unlimited saved articles',
      'No throttling',
      'Priority processing'
    ],
    icon: 'Infinity'
  },
  'automation': {
    type: 'automation',
    name: 'Automation',
    description: 'Semi-automated workflows',
    headline: 'Speed Up Your Workflow 5X',
    features: [
      'Content templates',
      'Auto-structure flows',
      'Platform-specific presets',
      'One-click formatting'
    ],
    icon: 'Bot'
  },
  'dfy': {
    type: 'dfy',
    name: 'Done-For-You',
    description: 'Pre-written authority content',
    headline: 'Deploy Authority Content Instantly',
    features: [
      'Pre-written articles',
      'Niche-based content packs',
      'Fully editable',
      'Ready to publish'
    ],
    icon: 'Package'
  }
}

export const PLATFORM_INFO: Record<Platform, { name: string; url: string; icon: string; tips: string[] }> = {
  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/feed/',
    icon: 'Linkedin',
    tips: [
      'Start with a strong hook in the first 2 lines',
      'Use line breaks for readability',
      'Add relevant hashtags at the end',
      'Include a clear call-to-action'
    ]
  },
  medium: {
    name: 'Medium',
    url: 'https://medium.com/new-story',
    icon: 'FileText',
    tips: [
      'Use a compelling featured image',
      'Structure with clear headings',
      'Add relevant tags for discoverability',
      'Include internal and external links'
    ]
  },
  substack: {
    name: 'Substack',
    url: 'https://substack.com/publish/post',
    icon: 'Mail',
    tips: [
      'Craft an engaging email subject line',
      'Include a teaser in the preview text',
      'Encourage replies and engagement',
      'End with a clear next step'
    ]
  },
  general: {
    name: 'General Publication',
    url: '#',
    icon: 'Globe',
    tips: [
      'Follow the publication\'s style guide',
      'Include proper citations',
      'Optimize for SEO with keywords',
      'Add author bio and credentials'
    ]
  }
}
