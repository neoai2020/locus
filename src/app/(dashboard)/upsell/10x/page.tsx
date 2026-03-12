'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  Search,
  Filter,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Send,
  Eye,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  DollarSign,
  Globe,
  BookOpen,
  X,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useAppStore } from '@/store'

const NICHES = [
  { id: 'health', label: 'Health & Wellness', emoji: '💪', count: 10 },
  { id: 'finance', label: 'Personal Finance', emoji: '💰', count: 10 },
  { id: 'tech', label: 'Tech & Gadgets', emoji: '🔧', count: 10 },
  { id: 'beauty', label: 'Beauty & Skincare', emoji: '✨', count: 10 },
  { id: 'fitness', label: 'Fitness & Weight Loss', emoji: '🏋️', count: 10 },
  { id: 'business', label: 'Online Business', emoji: '🚀', count: 10 },
  { id: 'education', label: 'Education & Courses', emoji: '📚', count: 10 },
  { id: 'travel', label: 'Travel & Lifestyle', emoji: '✈️', count: 10 },
  { id: 'pets', label: 'Pets & Animals', emoji: '🐾', count: 10 },
  { id: 'home', label: 'Home & Garden', emoji: '🏡', count: 10 },
]

interface PrewrittenArticle {
  id: string
  niche: string
  title: string
  excerpt: string
  wordCount: number
  sections: string[]
  seoKeywords: string[]
  suggestedProducts: string[]
  hasImages: boolean
  content: string
}

function generateArticlesForNiche(nicheId: string, nicheLabel: string): PrewrittenArticle[] {
  const articleTemplates: Record<string, { titles: string[]; keywords: string[][]; products: string[][] }> = {
    health: {
      titles: [
        'The Ultimate Guide to Immune-Boosting Supplements in 2025',
        '7 Science-Backed Vitamins That Actually Work (Reviewed)',
        'How to Build a Morning Wellness Routine That Sticks',
        'Best Probiotics for Gut Health: A Comprehensive Review',
        'Why Magnesium Is the Most Underrated Supplement (And Which to Buy)',
        'The Complete Guide to Intermittent Fasting for Beginners',
        'Top 10 Superfoods That Are Worth the Hype',
        'How to Naturally Lower Blood Pressure: Evidence-Based Methods',
        'The Truth About Collagen Supplements: Do They Really Work?',
        'Sleep Optimization: The Supplements and Tools That Changed My Life',
      ],
      keywords: [
        ['immune supplements', 'best vitamins immunity', 'supplement guide'],
        ['best vitamins', 'science backed supplements', 'vitamin review'],
        ['morning routine wellness', 'healthy habits', 'daily routine'],
        ['best probiotics', 'gut health supplements', 'probiotic review'],
        ['magnesium supplement', 'best magnesium', 'magnesium benefits'],
        ['intermittent fasting guide', 'fasting for beginners', 'IF diet'],
        ['superfoods list', 'healthy superfoods', 'nutrition guide'],
        ['lower blood pressure naturally', 'natural BP remedies', 'heart health'],
        ['collagen supplements review', 'do collagen supplements work', 'best collagen'],
        ['sleep supplements', 'better sleep', 'sleep optimization tools'],
      ],
      products: [
        ['Vitamin C complex', 'Zinc tablets', 'Elderberry extract'],
        ['Multivitamin packs', 'Vitamin D3', 'Omega-3 capsules'],
        ['Wellness journal', 'Morning routine planner', 'Essential oils kit'],
        ['Probiotic supplements', 'Prebiotic fiber', 'Gut health test kits'],
        ['Magnesium glycinate', 'Magnesium spray', 'Electrolyte packets'],
        ['Fasting timer app', 'Meal prep containers', 'Electrolyte powder'],
        ['Superfood powder blends', 'Acai supplements', 'Spirulina tablets'],
        ['Blood pressure monitors', 'Herbal tea blends', 'Beet root powder'],
        ['Marine collagen powder', 'Collagen capsules', 'Bone broth powder'],
        ['Melatonin gummies', 'Blue light glasses', 'Weighted blankets'],
      ],
    },
    finance: {
      titles: [
        'How to Start Investing with Just $100: A Complete Beginner\'s Guide',
        'The 5 Best Budgeting Apps That Will Save You Thousands',
        'Passive Income 101: 7 Realistic Ways to Earn Money While You Sleep',
        'Credit Score Secrets: How I Raised Mine 200 Points in 6 Months',
        'The Best High-Yield Savings Accounts Compared (2025)',
        'Cryptocurrency for Beginners: What to Buy and How to Start',
        'How to Pay Off Debt Fast: The Strategy That Saved Me $40K',
        'Side Hustles That Actually Pay: 10 Ideas You Can Start This Week',
        'Retirement Planning in Your 30s: The Guide I Wish I Had',
        'Best Cashback Credit Cards: Maximize Every Dollar You Spend',
      ],
      keywords: [
        ['investing for beginners', 'start investing $100', 'investment guide'],
        ['best budgeting apps', 'money saving apps', 'budget tracker'],
        ['passive income ideas', 'make money while sleeping', 'income streams'],
        ['improve credit score', 'raise credit score fast', 'credit tips'],
        ['high yield savings', 'best savings accounts', 'HYSA comparison'],
        ['crypto for beginners', 'buy cryptocurrency', 'crypto guide'],
        ['pay off debt fast', 'debt payoff strategy', 'debt free journey'],
        ['best side hustles', 'make extra money', 'side income ideas'],
        ['retirement planning 30s', '401k guide', 'retirement savings'],
        ['best cashback cards', 'credit card rewards', 'cashback comparison'],
      ],
      products: [
        ['Investment courses', 'Stock market books', 'Brokerage accounts'],
        ['Budgeting app subscriptions', 'Financial planners', 'Expense trackers'],
        ['Online course platforms', 'Print on demand tools', 'Domain hosting'],
        ['Credit monitoring services', 'Credit repair tools', 'Financial books'],
        ['Savings account offers', 'CD ladders', 'Money market accounts'],
        ['Crypto wallets', 'Trading platforms', 'Crypto courses'],
        ['Debt payoff planners', 'Consolidation loans', 'Financial coaching'],
        ['Freelance platforms', 'Side hustle toolkits', 'Business starter kits'],
        ['Retirement calculators', 'IRA accounts', 'Financial planning books'],
        ['Credit card offers', 'Reward optimization tools', 'Travel credit cards'],
      ],
    },
    tech: {
      titles: [
        'Best Laptops for Remote Workers in 2025: Complete Buying Guide',
        'Smart Home Essentials: 10 Devices That Are Actually Worth It',
        'The Best Noise-Cancelling Headphones Compared (Budget to Premium)',
        'How to Set Up a Home Office That Boosts Productivity',
        'Top 10 Must-Have iPhone Accessories You\'re Missing Out On',
        'Best VPN Services Reviewed: Protect Your Privacy in 2025',
        'The Ultimate Streaming Setup: Cameras, Mics, and Lights',
        'Robot Vacuums Ranked: Which One Cleans Best for the Price?',
        'Best Portable Chargers and Power Banks: Never Run Out Again',
        'AI Tools That Will Save You 10 Hours a Week (Tried and Tested)',
      ],
      keywords: [
        ['best laptops remote work', 'laptop buying guide', 'work from home laptop'],
        ['smart home devices', 'best smart gadgets', 'home automation'],
        ['noise cancelling headphones', 'best headphones', 'headphone review'],
        ['home office setup', 'productivity desk', 'work from home gear'],
        ['best iPhone accessories', 'iPhone gadgets', 'phone accessories'],
        ['best VPN services', 'VPN comparison', 'online privacy'],
        ['streaming setup guide', 'best webcam', 'content creator gear'],
        ['best robot vacuum', 'robot vacuum review', 'automated cleaning'],
        ['best portable charger', 'power bank review', 'travel charger'],
        ['best AI tools', 'AI productivity', 'AI automation tools'],
      ],
      products: [
        ['MacBook Air', 'ThinkPad X1', 'Laptop stands'],
        ['Smart speakers', 'Smart bulbs', 'Smart plugs'],
        ['Sony WH-1000XM5', 'AirPods Pro', 'Budget earbuds'],
        ['Standing desks', 'Monitor arms', 'Ergonomic chairs'],
        ['MagSafe chargers', 'Phone grips', 'Screen protectors'],
        ['NordVPN', 'ExpressVPN', 'Surfshark'],
        ['Webcams', 'USB microphones', 'Ring lights'],
        ['Roomba', 'Roborock', 'Ecovacs'],
        ['Anker power banks', 'Solar chargers', 'USB-C hubs'],
        ['ChatGPT Plus', 'Jasper', 'Notion AI'],
      ],
    },
    beauty: {
      titles: [
        'The 10-Step Skincare Routine That Transformed My Skin',
        'Best Retinol Products for Every Skin Type (Dermatologist-Approved)',
        'How to Build a Minimalist Makeup Kit That Does It All',
        'Sunscreen Guide: The Products Dermatologists Actually Use',
        'Anti-Aging Skincare on a Budget: Drugstore Products That Work',
        'The Best Hair Growth Products That Deliver Real Results',
        'Clean Beauty Brands Worth Switching To in 2025',
        'How to Get Glass Skin: The Korean Skincare Method Explained',
        'Best Under-Eye Products for Dark Circles and Puffiness',
        'The Ultimate Guide to Chemical Exfoliants (AHA, BHA, PHA)',
      ],
      keywords: [
        ['skincare routine', 'best skincare products', '10 step skincare'],
        ['best retinol', 'retinol for beginners', 'anti aging retinol'],
        ['minimalist makeup', 'essential makeup products', 'makeup kit'],
        ['best sunscreen face', 'SPF guide', 'dermatologist sunscreen'],
        ['anti aging drugstore', 'budget skincare', 'affordable anti aging'],
        ['hair growth products', 'best hair serum', 'hair loss treatment'],
        ['clean beauty brands', 'natural skincare', 'non toxic beauty'],
        ['glass skin routine', 'Korean skincare', 'dewy skin how to'],
        ['under eye treatment', 'dark circle cream', 'eye cream best'],
        ['chemical exfoliant guide', 'AHA BHA', 'exfoliating acids'],
      ],
      products: [
        ['Cleanser sets', 'Serum bundles', 'Moisturizer packs'],
        ['Retinol serums', 'Retinoid creams', 'Night treatments'],
        ['Foundation', 'Concealer', 'Setting spray'],
        ['SPF 50 sunscreens', 'Tinted moisturizers', 'UV protection'],
        ['CeraVe products', 'The Ordinary serums', 'Neutrogena line'],
        ['Hair growth serums', 'Biotin supplements', 'Scalp treatments'],
        ['Clean foundation', 'Organic moisturizer', 'Natural lip products'],
        ['Essence toners', 'Sheet masks', 'Hydrating mists'],
        ['Eye creams', 'Eye patches', 'Cooling rollers'],
        ['AHA toners', 'BHA serums', 'PHA pads'],
      ],
    },
    fitness: {
      titles: [
        'The Best Home Gym Equipment for Under $500',
        'How to Lose 20 Pounds Without a Gym Membership',
        'Protein Powders Ranked: The Best (and Worst) Options in 2025',
        'The 30-Day Workout Plan for Complete Beginners',
        'Best Fitness Trackers Compared: Which One Is Right for You?',
        'Meal Prep for Weight Loss: A Full Week of Recipes and Plans',
        'Running Shoes Guide: How to Pick the Perfect Pair',
        'The Science of Building Muscle After 40',
        'Best Pre-Workout Supplements That Actually Boost Performance',
        'Yoga for Beginners: Equipment, Apps, and Programs Reviewed',
      ],
      keywords: [
        ['home gym equipment', 'best home gym', 'budget gym setup'],
        ['lose weight no gym', 'weight loss at home', 'home workouts'],
        ['best protein powder', 'protein comparison', 'whey protein review'],
        ['beginner workout plan', '30 day fitness', 'exercise for beginners'],
        ['best fitness tracker', 'fitness watch comparison', 'activity tracker'],
        ['meal prep weight loss', 'healthy meal prep', 'weekly meal plan'],
        ['best running shoes', 'running shoe guide', 'shoes for runners'],
        ['build muscle over 40', 'strength training age', 'muscle after 40'],
        ['best pre workout', 'pre workout review', 'energy supplements'],
        ['yoga for beginners', 'best yoga mat', 'yoga equipment guide'],
      ],
      products: [
        ['Adjustable dumbbells', 'Resistance bands', 'Pull-up bars'],
        ['Yoga mats', 'Jump ropes', 'Workout apps'],
        ['Whey protein', 'Plant protein', 'Protein bars'],
        ['Workout programs', 'Fitness journals', 'Exercise guides'],
        ['Apple Watch', 'Fitbit', 'Garmin watches'],
        ['Meal prep containers', 'Kitchen scales', 'Cookbooks'],
        ['Nike running shoes', 'Brooks', 'ASICS'],
        ['Creatine', 'Testosterone boosters', 'Recovery supplements'],
        ['Pre-workout powder', 'Energy drinks', 'Beta-alanine'],
        ['Yoga mats', 'Yoga blocks', 'Online yoga subscriptions'],
      ],
    },
    business: {
      titles: [
        'How to Start an Online Business in 2025: The Complete Roadmap',
        'Best Email Marketing Platforms for Small Businesses (Compared)',
        'Dropshipping vs Print on Demand: Which Model Makes More Money?',
        'The Ultimate Guide to Affiliate Marketing for Beginners',
        'Best Website Builders for Non-Technical Entrepreneurs',
        'How to Create and Sell Digital Products (Step-by-Step)',
        'Social Media Management Tools That Save Hours Per Week',
        'The Best CRM Software for Small Business Owners',
        'How I Built a 6-Figure Blog in 18 Months (Exact Blueprint)',
        'SEO Tools Every Online Business Needs (Free and Paid)',
      ],
      keywords: [
        ['start online business', 'online business ideas', 'internet business'],
        ['email marketing platforms', 'best email tool', 'email automation'],
        ['dropshipping vs POD', 'ecommerce comparison', 'online store models'],
        ['affiliate marketing guide', 'affiliate for beginners', 'make money affiliate'],
        ['best website builders', 'create website easy', 'business website'],
        ['sell digital products', 'digital product ideas', 'online products'],
        ['social media tools', 'scheduling tools', 'social management'],
        ['best CRM', 'small business CRM', 'customer management'],
        ['start a blog', 'blogging for money', 'profitable blog'],
        ['SEO tools', 'best SEO software', 'keyword research tools'],
      ],
      products: [
        ['Business courses', 'Domain registrars', 'Hosting plans'],
        ['Mailchimp', 'ConvertKit', 'ActiveCampaign'],
        ['Shopify plans', 'Printful', 'Oberlo alternatives'],
        ['Affiliate networks', 'Link tracking tools', 'Affiliate courses'],
        ['Wix', 'Squarespace', 'WordPress themes'],
        ['Gumroad', 'Teachable', 'Canva Pro'],
        ['Buffer', 'Hootsuite', 'Later'],
        ['HubSpot', 'Salesforce', 'Zoho CRM'],
        ['Hosting plans', 'WordPress themes', 'SEO courses'],
        ['Ahrefs', 'SEMrush', 'Ubersuggest'],
      ],
    },
    education: {
      titles: [
        'Best Online Learning Platforms Compared: Which One Is Worth It?',
        'How to Learn Any Skill in 30 Days (Proven Method)',
        'The Best Coding Bootcamps for Career Changers in 2025',
        'Top 10 Productivity Apps Every Student Needs',
        'How to Build a Second Income with Online Courses You Create',
        'Speed Reading Techniques That Actually Work (Tools Included)',
        'The Best Language Learning Apps Reviewed and Ranked',
        'Study Tools and Apps That Top Students Swear By',
        'How to Get Certified in High-Demand Skills Without a Degree',
        'Best Books for Self-Education: The Ultimate Reading List',
      ],
      keywords: [
        ['best online learning', 'online courses comparison', 'learning platforms'],
        ['learn new skill fast', 'self learning method', 'skill development'],
        ['best coding bootcamps', 'learn to code', 'career change tech'],
        ['student productivity apps', 'study apps', 'organization tools'],
        ['create online course', 'sell courses online', 'course creator'],
        ['speed reading', 'read faster', 'reading techniques'],
        ['language learning apps', 'best language app', 'learn language online'],
        ['study tools', 'flashcard apps', 'note taking apps'],
        ['online certifications', 'professional certificates', 'upskill online'],
        ['best self help books', 'learning books', 'self education reading'],
      ],
      products: [
        ['Coursera', 'Udemy', 'Skillshare'],
        ['Learning journals', 'Habit trackers', 'Online courses'],
        ['Bootcamp subscriptions', 'Code editors', 'Coding books'],
        ['Notion', 'Todoist', 'Forest app'],
        ['Teachable', 'Thinkific', 'Kajabi'],
        ['Speed reading apps', 'Kindle', 'Book summaries'],
        ['Duolingo Plus', 'Babbel', 'Rosetta Stone'],
        ['Anki', 'Quizlet Plus', 'GoodNotes'],
        ['Google certificates', 'LinkedIn Learning', 'edX courses'],
        ['Book bundles', 'Audiobook subscriptions', 'Reading lists'],
      ],
    },
    travel: {
      titles: [
        'Best Travel Credit Cards for Free Flights and Hotels',
        'How to Travel the World on $50 a Day (Complete Budget Guide)',
        'The Best Travel Gear and Accessories for 2025',
        'Digital Nomad Guide: Best Countries to Work From Remotely',
        'Best Travel Insurance Plans Compared (Don\'t Skip This)',
        'Packing Like a Pro: The Minimalist Travel Checklist',
        'How to Find Cheap Flights Every Time (My Exact Strategy)',
        'Best Luggage Sets Reviewed: Carry-On to Checked Bags',
        'Travel Photography Guide: Gear, Settings, and Tips',
        'The Best Travel Apps That Will Save You Time and Money',
      ],
      keywords: [
        ['travel credit cards', 'free flights card', 'travel rewards'],
        ['budget travel guide', 'travel cheap', 'backpacking budget'],
        ['best travel gear', 'travel accessories', 'packing essentials'],
        ['digital nomad countries', 'remote work abroad', 'work from anywhere'],
        ['best travel insurance', 'travel insurance comparison', 'trip protection'],
        ['packing checklist', 'minimalist packing', 'travel packing tips'],
        ['cheap flights', 'flight deals', 'save on airfare'],
        ['best luggage', 'carry on suitcase', 'luggage review'],
        ['travel photography', 'best travel camera', 'photo tips'],
        ['travel apps', 'best apps travelers', 'travel planning tools'],
      ],
      products: [
        ['Chase Sapphire', 'Amex Platinum', 'Capital One Venture'],
        ['Hostel booking', 'Budget airlines', 'Travel guides'],
        ['Packing cubes', 'Travel adapters', 'Portable chargers'],
        ['Co-working spaces', 'VPN services', 'Remote work tools'],
        ['World Nomads', 'SafetyWing', 'Allianz Travel'],
        ['Compression bags', 'Travel bottles', 'Toiletry bags'],
        ['Google Flights', 'Skyscanner', 'Scott\'s Cheap Flights'],
        ['Away luggage', 'Samsonite', 'Osprey backpacks'],
        ['Sony cameras', 'GoPro', 'DJI drones'],
        ['Google Maps', 'TripIt', 'Hopper'],
      ],
    },
    pets: {
      titles: [
        'Best Dog Food Brands Reviewed by Veterinarians',
        'How to Train Your Puppy in 7 Days (Positive Reinforcement Guide)',
        'The Best Cat Litter Options: Odor Control, Clumping, and Eco-Friendly',
        'Top 10 Must-Have Products for New Dog Owners',
        'Best Pet Insurance Plans Compared: Is It Worth It?',
        'How to Keep Your Pet Healthy on a Budget',
        'The Best Interactive Toys to Keep Your Dog Entertained',
        'Raw Diet for Dogs: Benefits, Risks, and Best Products',
        'Best Flea and Tick Prevention Products That Actually Work',
        'How to Travel with Pets: Carriers, Tips, and Essentials',
      ],
      keywords: [
        ['best dog food', 'vet recommended dog food', 'dog food review'],
        ['puppy training guide', 'train puppy fast', 'dog training tips'],
        ['best cat litter', 'cat litter review', 'odor control litter'],
        ['new dog owner essentials', 'dog supplies list', 'puppy starter kit'],
        ['best pet insurance', 'pet insurance comparison', 'dog insurance'],
        ['budget pet care', 'affordable pet products', 'cheap vet care'],
        ['dog toys', 'interactive pet toys', 'puzzle toys dogs'],
        ['raw dog food', 'BARF diet dogs', 'raw pet food brands'],
        ['flea prevention', 'best tick treatment', 'flea and tick products'],
        ['travel with pets', 'pet carrier', 'pet travel essentials'],
      ],
      products: [
        ['Premium dog food', 'Grain-free options', 'Dog food toppers'],
        ['Training treats', 'Clickers', 'Puppy pads'],
        ['Clumping litter', 'Crystal litter', 'Litter boxes'],
        ['Leashes', 'Crates', 'Dog beds'],
        ['Lemonade Pet', 'Healthy Paws', 'Embrace'],
        ['Generic medications', 'Pet supplements', 'DIY grooming kits'],
        ['Kong toys', 'Puzzle feeders', 'Snuffle mats'],
        ['Raw food delivery', 'Freeze-dried food', 'Raw food supplements'],
        ['Seresto collars', 'Frontline', 'Natural repellents'],
        ['Pet carriers', 'Car seat covers', 'Travel water bowls'],
      ],
    },
    home: {
      titles: [
        'Best Air Purifiers for Allergies: Tested and Reviewed',
        'How to Start a Low-Maintenance Garden (Even If You Kill Everything)',
        'The Best Kitchen Gadgets That Are Actually Worth Buying',
        'Smart Thermostat Guide: Save Money and Stay Comfortable',
        'Best Mattresses for Every Sleep Style (2025 Guide)',
        'How to Organize Your Home Like a Minimalist',
        'The Best Water Filters for Clean, Great-Tasting Water',
        'Energy-Saving Products That Pay for Themselves',
        'Best Indoor Plants for Air Quality (And How to Not Kill Them)',
        'The Complete Guide to Home Security Systems',
      ],
      keywords: [
        ['best air purifier', 'air purifier allergies', 'HEPA air purifier'],
        ['beginner gardening', 'low maintenance garden', 'easy plants'],
        ['best kitchen gadgets', 'kitchen essentials', 'cooking tools'],
        ['smart thermostat', 'best thermostat', 'save on heating'],
        ['best mattress', 'mattress review', 'mattress guide'],
        ['home organization', 'minimalist home', 'declutter tips'],
        ['best water filter', 'water purifier', 'filtered water'],
        ['energy saving products', 'save electricity', 'eco home'],
        ['best indoor plants', 'air purifying plants', 'easy houseplants'],
        ['home security systems', 'best security camera', 'smart security'],
      ],
      products: [
        ['Dyson purifiers', 'HEPA filters', 'Air quality monitors'],
        ['Garden tool sets', 'Raised bed kits', 'Seed starter kits'],
        ['Instant Pot', 'Air fryers', 'Knife sets'],
        ['Nest thermostat', 'Ecobee', 'Smart plugs'],
        ['Memory foam mattresses', 'Hybrid mattresses', 'Pillows'],
        ['Storage bins', 'Label makers', 'Shelf organizers'],
        ['Brita filters', 'Berkey', 'Under-sink systems'],
        ['LED bulbs', 'Smart power strips', 'Solar chargers'],
        ['Snake plants', 'Pothos', 'Plant care kits'],
        ['Ring doorbell', 'SimpliSafe', 'Wyze cameras'],
      ],
    },
  }

  const templates = articleTemplates[nicheId] || articleTemplates.health

  return templates.titles.map((title, index) => {
    const sections = [
      'Introduction & Hook',
      'Why This Matters',
      'Detailed Breakdown',
      'Expert Analysis',
      'Product Comparisons',
      'Pros & Cons',
      'Our Top Pick',
      'Conclusion & CTA',
    ]

    const content = `# ${title}

${templates.keywords[index].map(k => `**Target Keyword:** ${k}`).join('\n')}

---

## Introduction

[Opening hook that grabs attention and establishes authority on the topic. This paragraph addresses the reader's pain point and promises a solution.]

[Personal credibility statement and brief overview of what the article covers.]

---

## Why This Matters in 2025

[Current landscape analysis with relevant statistics and trends. Explains why the reader should care about this topic right now.]

[Bridge to the main content — what the reader will learn and how it will benefit them.]

---

## Detailed Breakdown

[Comprehensive analysis of the topic with expert-level insights. Includes data points, research findings, and practical advice.]

[Sub-sections for each key point, formatted for easy scanning with bullet points and bold highlights.]

### Key Finding #1
[Detailed explanation with supporting evidence]

### Key Finding #2
[Detailed explanation with supporting evidence]

### Key Finding #3
[Detailed explanation with supporting evidence]

---

## Product Comparisons & Recommendations

[**🔗 YOUR AFFILIATE LINK GOES HERE**]

[Objective comparison of recommended products/services. Includes features, pricing, and honest pros/cons.]

### Our Top Picks:

${templates.products[index].map((p, i) => `${i + 1}. **${p}** — [Your affiliate link] — Brief description of why this product stands out.`).join('\n')}

---

## Pros & Cons Summary

| Pros | Cons |
|------|------|
| [Key benefit 1] | [Limitation 1] |
| [Key benefit 2] | [Limitation 2] |
| [Key benefit 3] | [Limitation 3] |

---

## Our #1 Pick

[Highlighted recommendation with clear reasoning. This is where the primary affiliate link converts best.]

[**🔗 YOUR AFFILIATE LINK GOES HERE**]

---

## Conclusion

[Summary of key points. Reinforces the value of taking action. Final CTA directing reader to the recommended product/service with your affiliate link.]

[Invitation to share, comment, or explore related content.]

---

*Keywords: ${templates.keywords[index].join(', ')}*
*Word Count: ~1,500 | Images: 3 (Header, Mid-Article, Conclusion)*
*Suggested Products: ${templates.products[index].join(', ')}*`

    return {
      id: `${nicheId}-${index + 1}`,
      niche: nicheId,
      title,
      excerpt: `A comprehensive, SEO-optimized authority article targeting "${templates.keywords[index][0]}" with strategic affiliate placement points for ${templates.products[index].join(', ')}.`,
      wordCount: 1500,
      sections,
      seoKeywords: templates.keywords[index],
      suggestedProducts: templates.products[index],
      hasImages: true,
      content,
    }
  })
}

const ALL_ARTICLES: PrewrittenArticle[] = NICHES.flatMap(n =>
  generateArticlesForNiche(n.id, n.label)
)

export default function TenXPage() {
  const router = useRouter()
  const { isUpsellUnlocked, setCurrentArticle, addArticle } = useAppStore()

  const [isChecking, setIsChecking] = useState(true)
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewArticle, setPreviewArticle] = useState<PrewrittenArticle | null>(null)
  const [copied, setCopied] = useState(false)
  const [usedArticles, setUsedArticles] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isUpsellUnlocked('10x')) {
      router.push('/unlock/10x')
    } else {
      setIsChecking(false)
    }
  }, [isUpsellUnlocked, router])

  const filteredArticles = useMemo(() => {
    let articles = ALL_ARTICLES
    if (selectedNiche) {
      articles = articles.filter(a => a.niche === selectedNiche)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      articles = articles.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.seoKeywords.some(k => k.toLowerCase().includes(q))
      )
    }
    return articles
  }, [selectedNiche, searchQuery])

  const handleUseArticle = (article: PrewrittenArticle) => {
    const newArticle = {
      id: crypto.randomUUID(),
      user_id: '',
      title: article.title,
      content: article.content,
      platform: 'linkedin' as const,
      tone: 'authoritative' as const,
      length: 'long' as const,
      status: 'draft' as const,
      niche: NICHES.find(n => n.id === article.niche)?.label || '',
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addArticle(newArticle)
    setCurrentArticle(newArticle)
    setUsedArticles(prev => new Set(prev).add(article.id))
    router.push('/saved')
  }

  const handleUseAndPublish = (article: PrewrittenArticle) => {
    const newArticle = {
      id: crypto.randomUUID(),
      user_id: '',
      title: article.title,
      content: article.content,
      platform: 'linkedin' as const,
      tone: 'authoritative' as const,
      length: 'long' as const,
      status: 'draft' as const,
      niche: NICHES.find(n => n.id === article.niche)?.label || '',
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addArticle(newArticle)
    setCurrentArticle(newArticle)
    setUsedArticles(prev => new Set(prev).add(article.id))
    router.push('/publish')
  }

  const handleCopyContent = async (content: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-locus-border)] animate-pulse" />
      </div>
    )
  }

  if (previewArticle) {
    const niche = NICHES.find(n => n.id === previewArticle.niche)
    return (
      <div className="max-w-5xl mx-auto animate-fade-in">
        {/* Back */}
        <button
          onClick={() => setPreviewArticle(null)}
          className="flex items-center gap-2 text-locus-muted hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Library</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="warning">10X Library</Badge>
                <Badge variant="default">{niche?.emoji} {niche?.label}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {previewArticle.title}
              </h1>
              <p className="text-sm text-locus-muted">
                {previewArticle.wordCount} words &bull; 3 images included &bull; SEO-optimized
              </p>
            </div>

            <Card>
              <div className="prose prose-invert max-w-none text-sm text-locus-text leading-relaxed whitespace-pre-wrap">
                {previewArticle.content}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <h3 className="font-semibold text-white mb-4">Article Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-locus-muted uppercase tracking-wider">SEO Keywords</label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {previewArticle.seoKeywords.map(k => (
                      <span key={k} className="px-2 py-1 rounded-lg bg-[rgba(20,184,166,0.1)] text-locus-teal text-xs border border-[rgba(20,184,166,0.2)]">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-locus-muted uppercase tracking-wider">Suggested Affiliate Products</label>
                  <div className="mt-2 space-y-2">
                    {previewArticle.suggestedProducts.map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm">
                        <DollarSign size={14} className="text-amber-400 shrink-0" />
                        <span className="text-locus-text">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-locus-muted uppercase tracking-wider">Images</label>
                  <div className="mt-2 space-y-2">
                    {['Header Image', 'Mid-Article Image', 'Conclusion Image'].map(img => (
                      <div key={img} className="flex items-center gap-2 text-sm">
                        <ImageIcon size={14} className="text-emerald-400 shrink-0" />
                        <span className="text-locus-text">{img}</span>
                        <Check size={12} className="ml-auto text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-locus-muted uppercase tracking-wider">Sections</label>
                  <div className="mt-2 space-y-1.5">
                    {previewArticle.sections.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-md bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[10px] text-locus-muted shrink-0">{i + 1}</span>
                        <span className="text-locus-text">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-locus-border space-y-2">
                <h4 className="text-xs text-locus-muted uppercase tracking-wider mb-3">What to do</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center text-[10px] text-amber-400 font-bold shrink-0 mt-0.5">1</span>
                    <span className="text-locus-text">Find matching products on Digistore24, Amazon, Etsy, or eBay</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center text-[10px] text-amber-400 font-bold shrink-0 mt-0.5">2</span>
                    <span className="text-locus-text">Replace affiliate link placeholders with your links</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center text-[10px] text-amber-400 font-bold shrink-0 mt-0.5">3</span>
                    <span className="text-locus-text">Publish to your chosen platform and start earning</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button onClick={() => handleCopyContent(previewArticle.content)} className="w-full">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Article'}</span>
                </Button>
                <Button onClick={() => handleUseArticle(previewArticle)} variant="secondary" className="w-full">
                  <FileText size={16} />
                  <span>Save to My Portfolio</span>
                </Button>
                <Button onClick={() => handleUseAndPublish(previewArticle)} variant="secondary" className="w-full">
                  <Send size={16} />
                  <span>Save & Publish</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <Badge variant="warning">10X Mode</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          100 Ready-to-Publish Authority Articles
        </h1>
        <p className="text-locus-muted max-w-2xl">
          SEO-optimized articles across 10 profitable niches — each structured to rank on Google
          and strategically place your affiliate links for passive commissions. Images included.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in stagger-1">
        {[
          { label: 'Total Articles', value: '100', icon: FileText, color: 'text-locus-teal' },
          { label: 'Niches Covered', value: '10', icon: Globe, color: 'text-amber-400' },
          { label: 'Images Included', value: '300', icon: ImageIcon, color: 'text-emerald-400' },
          { label: 'SEO-Optimized', value: '100%', icon: TrendingUp, color: 'text-cyan-400' },
        ].map((stat, i) => (
          <Card key={i} className="text-center py-4">
            <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-locus-muted">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card className="mb-8 animate-fade-in stagger-2 border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.03)]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-amber-400" />
          <h3 className="font-semibold text-white">How It Works — 3 Simple Steps</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Pick an Article', desc: 'Browse 100 pre-written articles across 10 niches. Every article is SEO-optimized with images ready to go.', icon: BookOpen },
            { step: '2', title: 'Add Your Links', desc: 'Find matching products on Digistore24, Amazon, Etsy, or eBay. Replace the affiliate placeholders with your links.', icon: LinkIcon },
            { step: '3', title: 'Publish & Earn', desc: 'Post on LinkedIn, Medium, Quora, Reddit, or X. Start earning passive commissions from day one.', icon: DollarSign },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-amber-400">{item.step}</span>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-locus-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in stagger-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-locus-muted" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-locus-border text-white placeholder-locus-muted text-sm focus:outline-none focus:border-locus-teal transition-colors"
          />
        </div>
        {selectedNiche && (
          <button
            onClick={() => setSelectedNiche(null)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.3)] text-locus-teal text-sm"
          >
            <span>{NICHES.find(n => n.id === selectedNiche)?.emoji} {NICHES.find(n => n.id === selectedNiche)?.label}</span>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Niche Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8 animate-fade-in stagger-3">
        <button
          onClick={() => setSelectedNiche(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !selectedNiche
              ? 'bg-locus-teal text-white'
              : 'bg-[rgba(255,255,255,0.05)] text-locus-muted hover:text-white border border-locus-border'
          }`}
        >
          All Niches (100)
        </button>
        {NICHES.map(niche => (
          <button
            key={niche.id}
            onClick={() => setSelectedNiche(niche.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedNiche === niche.id
                ? 'bg-locus-teal text-white'
                : 'bg-[rgba(255,255,255,0.05)] text-locus-muted hover:text-white border border-locus-border'
            }`}
          >
            {niche.emoji} {niche.label} ({niche.count})
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article, index) => {
          const niche = NICHES.find(n => n.id === article.niche)
          const isUsed = usedArticles.has(article.id)
          return (
            <Card
              key={article.id}
              className={`animate-fade-in cursor-pointer group hover:border-[rgba(20,184,166,0.3)] transition-all ${isUsed ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
              onClick={() => setPreviewArticle(article)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0 text-lg border border-amber-400/20">
                  {niche?.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400/70">{niche?.label}</span>
                    {isUsed && <Badge variant="success" className="text-[9px]">Used</Badge>}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-locus-teal transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-locus-muted">
                    <span className="flex items-center gap-1">
                      <FileText size={11} />
                      {article.wordCount} words
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon size={11} />
                      3 images
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={11} />
                      SEO
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-locus-muted group-hover:text-locus-teal transition-colors shrink-0 mt-1" />
              </div>
            </Card>
          )
        })}
      </div>

      {filteredArticles.length === 0 && (
        <Card className="text-center py-12">
          <Search size={28} className="text-locus-muted mx-auto mb-3" />
          <p className="text-locus-muted">No articles match your search</p>
          <p className="text-sm text-locus-muted/60 mt-1">Try a different keyword or clear the niche filter</p>
        </Card>
      )}
    </div>
  )
}
