'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  Search,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Send,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  DollarSign,
  Globe,
  BookOpen,
  X,
  Save,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
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
  seoKeywords: string[]
  suggestedProducts: string[]
  sections: string[]
  content: string
}

function buildArticleContent(title: string, nicheLabel: string, keywords: string[], products: string[]): string {
  const kw0 = keywords[0] || 'this topic'
  const kw1 = keywords[1] || 'related products'
  const kw2 = keywords[2] || 'best options'
  const p0 = products[0] || 'Product A'
  const p1 = products[1] || 'Product B'
  const p2 = products[2] || 'Product C'

  return `<p>If you've been searching for reliable information about <strong>${kw0}</strong>, you're in the right place. With so many options flooding the market in 2025, it can be overwhelming to separate what actually works from what's just clever marketing. This comprehensive guide cuts through the noise and gives you evidence-based recommendations you can trust.</p>

<p>Whether you're completely new to ${nicheLabel.toLowerCase()} or looking to upgrade your current approach, this article covers everything you need to know — from the fundamentals to specific product recommendations that deliver real results. By the end, you'll have a clear action plan and know exactly which products are worth your investment.</p>

<h2>Why ${title.replace(/^(The |How to |Best )/i, '')} Matters More Than Ever</h2>

<p>The landscape of ${nicheLabel.toLowerCase()} has shifted dramatically. Recent studies show that consumers who take the time to research <strong>${kw1}</strong> before purchasing save an average of 40% and report significantly higher satisfaction with their choices. The problem? Most review sites are paid promotions disguised as honest assessments.</p>

<p>What sets this guide apart is that we've spent weeks testing, comparing, and analyzing real user feedback across thousands of reviews. We looked at price-to-performance ratios, long-term reliability, customer support quality, and overall value. The result is a guide you can actually trust when making your decision about <strong>${kw2}</strong>.</p>

<p>Here are the key trends shaping this space right now:</p>
<ul>
<li><strong>Quality over quantity</strong> — consumers are gravitating toward fewer, better products rather than cluttering their lives with mediocre options</li>
<li><strong>Transparency demands</strong> — brands that openly share their ingredients, sourcing, and testing data are winning customer loyalty</li>
<li><strong>Personalization</strong> — one-size-fits-all solutions are being replaced by tailored approaches based on individual needs</li>
</ul>

<h2>Our Research Methodology</h2>

<p>Before diving into the recommendations, it's important to understand how we arrived at our picks. We evaluated over 50 options in the ${nicheLabel.toLowerCase()} category using a weighted scoring system that prioritizes the factors that matter most to real users.</p>

<p>Our evaluation criteria included: effectiveness and performance (35%), value for money (25%), ease of use (20%), customer reviews and reputation (15%), and return policy and guarantees (5%). Products that scored below 7.5 out of 10 were eliminated from consideration.</p>

<h2>Detailed Breakdown: What We Found</h2>

<h3>Key Finding #1: Premium Doesn't Always Mean Better</h3>

<p>One of the most surprising discoveries in our research was that the most expensive option in the <strong>${kw0}</strong> category wasn't the best performer. In fact, our top pick — <strong>${p0}</strong> — sits in the mid-price range while outperforming products that cost twice as much. This is because ${p0} focuses on the fundamentals rather than flashy features that look good on paper but rarely matter in real-world use.</p>

<p>The data consistently showed that products in the $30-$80 range offered the best balance of quality and value. Below that threshold, you start sacrificing reliability. Above it, you're often paying for brand prestige rather than measurable improvements.</p>

<h3>Key Finding #2: User Experience Is the Differentiator</h3>

<p>When two products perform similarly on paper, what separates the winner from the runner-up is almost always user experience. Products like <strong>${p1}</strong> have invested heavily in making their offering intuitive and enjoyable to use, which translates directly to consistency — you'll actually use it regularly instead of abandoning it after a week.</p>

<p>We found that products with simpler designs and clearer instructions had 3x higher long-term satisfaction rates compared to feature-heavy alternatives that require a learning curve.</p>

<h3>Key Finding #3: Community and Support Matter</h3>

<p>The best products in the <strong>${kw2}</strong> space are backed by active communities and responsive customer support. <strong>${p2}</strong> stands out here with their dedicated user community, detailed FAQ section, and average support response time of under 2 hours. When you're investing in your ${nicheLabel.toLowerCase()} journey, knowing that help is available when you need it makes a significant difference.</p>

<h2>Product Comparisons & Our Top 3 Recommendations</h2>

<p>After extensive testing and analysis, here are our top three recommendations for anyone looking for the best <strong>${kw0}</strong> options in 2025. Each product has been personally tested and verified against our rigorous evaluation criteria.</p>

<h3>#1: ${p0} — Best Overall</h3>

<p><strong>${p0}</strong> earns our top spot for delivering exceptional performance at a reasonable price point. What impressed us most was the consistency — it performed reliably across every test we ran, with no significant drop-off over extended use. The build quality is excellent, the design is intuitive, and customer reviews align closely with our findings.</p>

<p><strong>Why we recommend it:</strong> Best balance of quality, price, and reliability. Perfect for both beginners and experienced users. <a href='#' class='text-locus-teal font-bold underline decoration-2 underline-offset-4 hover:text-locus-cyan transition-all'>[YOUR LINK HERE]</a></p>

<h3>#2: ${p1} — Best Premium Option</h3>

<p><strong>${p1}</strong> is the choice for those who want the absolute best and don't mind paying a premium. It edges out ${p0} in raw performance by about 10-15%, with superior materials and a more polished experience. If ${nicheLabel.toLowerCase()} is a priority for you and budget isn't the primary concern, this is the one to go with.</p>

<p><strong>Why we recommend it:</strong> Top-tier performance and premium experience for serious enthusiasts. <a href='#' class='text-locus-teal font-bold underline decoration-2 underline-offset-4 hover:text-locus-cyan transition-all'>[YOUR LINK HERE]</a></p>

<h3>#3: ${p2} — Best Budget Pick</h3>

<p><strong>${p2}</strong> proves that you don't need to break the bank to get a solid product. At roughly half the price of our top pick, it delivers about 80% of the performance — which for most people is more than enough. It's an ideal entry point if you're just starting your journey with <strong>${kw1}</strong> and want to test the waters before committing to a higher investment.</p>

<p><strong>Why we recommend it:</strong> Outstanding value for money, perfect for beginners. <a href='#' class='text-locus-teal font-bold underline decoration-2 underline-offset-4 hover:text-locus-cyan transition-all'>[YOUR LINK HERE]</a></p>

<h2>Pros & Cons at a Glance</h2>

<p>Here's a quick comparison to help you decide:</p>

<p><strong>${p0} (Best Overall):</strong></p>
<ul>
<li>✅ Excellent performance-to-price ratio</li>
<li>✅ Intuitive design, easy to use</li>
<li>✅ Strong customer reviews</li>
<li>❌ Limited color/style options</li>
<li>❌ Shipping can take 5-7 days</li>
</ul>

<p><strong>${p1} (Premium):</strong></p>
<ul>
<li>✅ Best-in-class performance</li>
<li>✅ Premium materials and build</li>
<li>✅ Fast shipping and great support</li>
<li>❌ Significantly higher price point</li>
<li>❌ May be overkill for casual users</li>
</ul>

<p><strong>${p2} (Budget):</strong></p>
<ul>
<li>✅ Very affordable</li>
<li>✅ Solid performance for the price</li>
<li>✅ Great for beginners</li>
<li>❌ Fewer features than premium options</li>
<li>❌ Build quality is adequate but not exceptional</li>
</ul>

<h2>Our #1 Pick: ${p0}</h2>

<p>If we had to choose just one product to recommend, it would be <strong>${p0}</strong> without hesitation. It strikes the perfect balance between performance, price, and usability that most people are looking for when researching <strong>${kw0}</strong>. The overwhelmingly positive user reviews confirm what our testing showed — this is a product that consistently delivers on its promises.</p>

<p><strong>Ready to get started?</strong> <a href='#' class='text-locus-teal font-bold underline decoration-2 underline-offset-4 hover:text-locus-cyan transition-all'>[YOUR LINK HERE]</a></p>

<h2>Conclusion: Your Next Step</h2>

<p>Choosing the right product in the <strong>${kw2}</strong> space doesn't have to be complicated. If you want the best overall value, go with <strong>${p0}</strong>. If budget is your primary concern, <strong>${p2}</strong> is a solid starting point. And if you want the absolute best regardless of price, <strong>${p1}</strong> won't disappoint.</p>

<p>The most important thing is to take action. Research paralysis is real — don't let the pursuit of the "perfect" option prevent you from getting started. Any of our three recommended products will serve you well, and you can always upgrade later as your needs evolve.</p>

<p>We hope this guide has helped clarify your options for <strong>${kw0}</strong>. If you found it valuable, consider sharing it with someone who's also navigating this space. And if you have questions or want personalized advice, drop a comment below — we read and respond to every one.</p>

<p><em>Keywords: ${keywords.join(', ')}</em></p>`
}

function getArticles(): PrewrittenArticle[] {
  const data: Record<string, { titles: string[]; keywords: string[][]; products: string[][] }> = {
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
      titles: ['How to Start Investing with Just $100: A Complete Beginner\'s Guide','The 5 Best Budgeting Apps That Will Save You Thousands','Passive Income 101: 7 Realistic Ways to Earn Money While You Sleep','Credit Score Secrets: How I Raised Mine 200 Points in 6 Months','The Best High-Yield Savings Accounts Compared (2025)','Cryptocurrency for Beginners: What to Buy and How to Start','How to Pay Off Debt Fast: The Strategy That Saved Me $40K','Side Hustles That Actually Pay: 10 Ideas You Can Start This Week','Retirement Planning in Your 30s: The Guide I Wish I Had','Best Cashback Credit Cards: Maximize Every Dollar You Spend'],
      keywords: [['investing for beginners','start investing $100','investment guide'],['best budgeting apps','money saving apps','budget tracker'],['passive income ideas','make money while sleeping','income streams'],['improve credit score','raise credit score fast','credit tips'],['high yield savings','best savings accounts','HYSA comparison'],['crypto for beginners','buy cryptocurrency','crypto guide'],['pay off debt fast','debt payoff strategy','debt free journey'],['best side hustles','make extra money','side income ideas'],['retirement planning 30s','401k guide','retirement savings'],['best cashback cards','credit card rewards','cashback comparison']],
      products: [['Investment courses','Stock market books','Brokerage accounts'],['Budgeting app subscriptions','Financial planners','Expense trackers'],['Online course platforms','Print on demand tools','Domain hosting'],['Credit monitoring services','Credit repair tools','Financial books'],['Savings account offers','CD ladders','Money market accounts'],['Crypto wallets','Trading platforms','Crypto courses'],['Debt payoff planners','Consolidation loans','Financial coaching'],['Freelance platforms','Side hustle toolkits','Business starter kits'],['Retirement calculators','IRA accounts','Financial planning books'],['Credit card offers','Reward optimization tools','Travel credit cards']],
    },
    tech: {
      titles: ['Best Laptops for Remote Workers in 2025: Complete Buying Guide','Smart Home Essentials: 10 Devices That Are Actually Worth It','The Best Noise-Cancelling Headphones Compared (Budget to Premium)','How to Set Up a Home Office That Boosts Productivity','Top 10 Must-Have iPhone Accessories You\'re Missing Out On','Best VPN Services Reviewed: Protect Your Privacy in 2025','The Ultimate Streaming Setup: Cameras, Mics, and Lights','Robot Vacuums Ranked: Which One Cleans Best for the Price?','Best Portable Chargers and Power Banks: Never Run Out Again','AI Tools That Will Save You 10 Hours a Week (Tried and Tested)'],
      keywords: [['best laptops remote work','laptop buying guide','work from home laptop'],['smart home devices','best smart gadgets','home automation'],['noise cancelling headphones','best headphones','headphone review'],['home office setup','productivity desk','work from home gear'],['best iPhone accessories','iPhone gadgets','phone accessories'],['best VPN services','VPN comparison','online privacy'],['streaming setup guide','best webcam','content creator gear'],['best robot vacuum','robot vacuum review','automated cleaning'],['best portable charger','power bank review','travel charger'],['best AI tools','AI productivity','AI automation tools']],
      products: [['MacBook Air','ThinkPad X1','Laptop stands'],['Smart speakers','Smart bulbs','Smart plugs'],['Sony WH-1000XM5','AirPods Pro','Budget earbuds'],['Standing desks','Monitor arms','Ergonomic chairs'],['MagSafe chargers','Phone grips','Screen protectors'],['NordVPN','ExpressVPN','Surfshark'],['Webcams','USB microphones','Ring lights'],['Roomba','Roborock','Ecovacs'],['Anker power banks','Solar chargers','USB-C hubs'],['ChatGPT Plus','Jasper','Notion AI']],
    },
    beauty: {
      titles: ['The 10-Step Skincare Routine That Transformed My Skin','Best Retinol Products for Every Skin Type (Dermatologist-Approved)','How to Build a Minimalist Makeup Kit That Does It All','Sunscreen Guide: The Products Dermatologists Actually Use','Anti-Aging Skincare on a Budget: Drugstore Products That Work','The Best Hair Growth Products That Deliver Real Results','Clean Beauty Brands Worth Switching To in 2025','How to Get Glass Skin: The Korean Skincare Method Explained','Best Under-Eye Products for Dark Circles and Puffiness','The Ultimate Guide to Chemical Exfoliants (AHA, BHA, PHA)'],
      keywords: [['skincare routine','best skincare products','10 step skincare'],['best retinol','retinol for beginners','anti aging retinol'],['minimalist makeup','essential makeup products','makeup kit'],['best sunscreen face','SPF guide','dermatologist sunscreen'],['anti aging drugstore','budget skincare','affordable anti aging'],['hair growth products','best hair serum','hair loss treatment'],['clean beauty brands','natural skincare','non toxic beauty'],['glass skin routine','Korean skincare','dewy skin how to'],['under eye treatment','dark circle cream','eye cream best'],['chemical exfoliant guide','AHA BHA','exfoliating acids']],
      products: [['Cleanser sets','Serum bundles','Moisturizer packs'],['Retinol serums','Retinoid creams','Night treatments'],['Foundation','Concealer','Setting spray'],['SPF 50 sunscreens','Tinted moisturizers','UV protection'],['CeraVe products','The Ordinary serums','Neutrogena line'],['Hair growth serums','Biotin supplements','Scalp treatments'],['Clean foundation','Organic moisturizer','Natural lip products'],['Essence toners','Sheet masks','Hydrating mists'],['Eye creams','Eye patches','Cooling rollers'],['AHA toners','BHA serums','PHA pads']],
    },
    fitness: {
      titles: ['The Best Home Gym Equipment for Under $500','How to Lose 20 Pounds Without a Gym Membership','Protein Powders Ranked: The Best (and Worst) Options in 2025','The 30-Day Workout Plan for Complete Beginners','Best Fitness Trackers Compared: Which One Is Right for You?','Meal Prep for Weight Loss: A Full Week of Recipes and Plans','Running Shoes Guide: How to Pick the Perfect Pair','The Science of Building Muscle After 40','Best Pre-Workout Supplements That Actually Boost Performance','Yoga for Beginners: Equipment, Apps, and Programs Reviewed'],
      keywords: [['home gym equipment','best home gym','budget gym setup'],['lose weight no gym','weight loss at home','home workouts'],['best protein powder','protein comparison','whey protein review'],['beginner workout plan','30 day fitness','exercise for beginners'],['best fitness tracker','fitness watch comparison','activity tracker'],['meal prep weight loss','healthy meal prep','weekly meal plan'],['best running shoes','running shoe guide','shoes for runners'],['build muscle over 40','strength training age','muscle after 40'],['best pre workout','pre workout review','energy supplements'],['yoga for beginners','best yoga mat','yoga equipment guide']],
      products: [['Adjustable dumbbells','Resistance bands','Pull-up bars'],['Yoga mats','Jump ropes','Workout apps'],['Whey protein','Plant protein','Protein bars'],['Workout programs','Fitness journals','Exercise guides'],['Apple Watch','Fitbit','Garmin watches'],['Meal prep containers','Kitchen scales','Cookbooks'],['Nike running shoes','Brooks','ASICS'],['Creatine','Testosterone boosters','Recovery supplements'],['Pre-workout powder','Energy drinks','Beta-alanine'],['Yoga mats','Yoga blocks','Online yoga subscriptions']],
    },
    business: {
      titles: ['How to Start an Online Business in 2025: The Complete Roadmap','Best Email Marketing Platforms for Small Businesses (Compared)','Dropshipping vs Print on Demand: Which Model Makes More Money?','The Ultimate Guide to Affiliate Marketing for Beginners','Best Website Builders for Non-Technical Entrepreneurs','How to Create and Sell Digital Products (Step-by-Step)','Social Media Management Tools That Save Hours Per Week','The Best CRM Software for Small Business Owners','How I Built a 6-Figure Blog in 18 Months (Exact Blueprint)','SEO Tools Every Online Business Needs (Free and Paid)'],
      keywords: [['start online business','online business ideas','internet business'],['email marketing platforms','best email tool','email automation'],['dropshipping vs POD','ecommerce comparison','online store models'],['affiliate marketing guide','affiliate for beginners','make money affiliate'],['best website builders','create website easy','business website'],['sell digital products','digital product ideas','online products'],['social media tools','scheduling tools','social management'],['best CRM','small business CRM','customer management'],['start a blog','blogging for money','profitable blog'],['SEO tools','best SEO software','keyword research tools']],
      products: [['Business courses','Domain registrars','Hosting plans'],['Mailchimp','ConvertKit','ActiveCampaign'],['Shopify plans','Printful','Oberlo alternatives'],['Affiliate networks','Link tracking tools','Affiliate courses'],['Wix','Squarespace','WordPress themes'],['Gumroad','Teachable','Canva Pro'],['Buffer','Hootsuite','Later'],['HubSpot','Salesforce','Zoho CRM'],['Hosting plans','WordPress themes','SEO courses'],['Ahrefs','SEMrush','Ubersuggest']],
    },
    education: {
      titles: ['Best Online Learning Platforms Compared: Which One Is Worth It?','How to Learn Any Skill in 30 Days (Proven Method)','The Best Coding Bootcamps for Career Changers in 2025','Top 10 Productivity Apps Every Student Needs','How to Build a Second Income with Online Courses You Create','Speed Reading Techniques That Actually Work (Tools Included)','The Best Language Learning Apps Reviewed and Ranked','Study Tools and Apps That Top Students Swear By','How to Get Certified in High-Demand Skills Without a Degree','Best Books for Self-Education: The Ultimate Reading List'],
      keywords: [['best online learning','online courses comparison','learning platforms'],['learn new skill fast','self learning method','skill development'],['best coding bootcamps','learn to code','career change tech'],['student productivity apps','study apps','organization tools'],['create online course','sell courses online','course creator'],['speed reading','read faster','reading techniques'],['language learning apps','best language app','learn language online'],['study tools','flashcard apps','note taking apps'],['online certifications','professional certificates','upskill online'],['best self help books','learning books','self education reading']],
      products: [['Coursera','Udemy','Skillshare'],['Learning journals','Habit trackers','Online courses'],['Bootcamp subscriptions','Code editors','Coding books'],['Notion','Todoist','Forest app'],['Teachable','Thinkific','Kajabi'],['Speed reading apps','Kindle','Book summaries'],['Duolingo Plus','Babbel','Rosetta Stone'],['Anki','Quizlet Plus','GoodNotes'],['Google certificates','LinkedIn Learning','edX courses'],['Book bundles','Audiobook subscriptions','Reading lists']],
    },
    travel: {
      titles: ['Best Travel Credit Cards for Free Flights and Hotels','How to Travel the World on $50 a Day (Complete Budget Guide)','The Best Travel Gear and Accessories for 2025','Digital Nomad Guide: Best Countries to Work From Remotely','Best Travel Insurance Plans Compared (Don\'t Skip This)','Packing Like a Pro: The Minimalist Travel Checklist','How to Find Cheap Flights Every Time (My Exact Strategy)','Best Luggage Sets Reviewed: Carry-On to Checked Bags','Travel Photography Guide: Gear, Settings, and Tips','The Best Travel Apps That Will Save You Time and Money'],
      keywords: [['travel credit cards','free flights card','travel rewards'],['budget travel guide','travel cheap','backpacking budget'],['best travel gear','travel accessories','packing essentials'],['digital nomad countries','remote work abroad','work from anywhere'],['best travel insurance','travel insurance comparison','trip protection'],['packing checklist','minimalist packing','travel packing tips'],['cheap flights','flight deals','save on airfare'],['best luggage','carry on suitcase','luggage review'],['travel photography','best travel camera','photo tips'],['travel apps','best apps travelers','travel planning tools']],
      products: [['Chase Sapphire','Amex Platinum','Capital One Venture'],['Hostel booking','Budget airlines','Travel guides'],['Packing cubes','Travel adapters','Portable chargers'],['Co-working spaces','VPN services','Remote work tools'],['World Nomads','SafetyWing','Allianz Travel'],['Compression bags','Travel bottles','Toiletry bags'],['Google Flights','Skyscanner','Scott\'s Cheap Flights'],['Away luggage','Samsonite','Osprey backpacks'],['Sony cameras','GoPro','DJI drones'],['Google Maps','TripIt','Hopper']],
    },
    pets: {
      titles: ['Best Dog Food Brands Reviewed by Veterinarians','How to Train Your Puppy in 7 Days (Positive Reinforcement Guide)','The Best Cat Litter Options: Odor Control, Clumping, and Eco-Friendly','Top 10 Must-Have Products for New Dog Owners','Best Pet Insurance Plans Compared: Is It Worth It?','How to Keep Your Pet Healthy on a Budget','The Best Interactive Toys to Keep Your Dog Entertained','Raw Diet for Dogs: Benefits, Risks, and Best Products','Best Flea and Tick Prevention Products That Actually Work','How to Travel with Pets: Carriers, Tips, and Essentials'],
      keywords: [['best dog food','vet recommended dog food','dog food review'],['puppy training guide','train puppy fast','dog training tips'],['best cat litter','cat litter review','odor control litter'],['new dog owner essentials','dog supplies list','puppy starter kit'],['best pet insurance','pet insurance comparison','dog insurance'],['budget pet care','affordable pet products','cheap vet care'],['dog toys','interactive pet toys','puzzle toys dogs'],['raw dog food','BARF diet dogs','raw pet food brands'],['flea prevention','best tick treatment','flea and tick products'],['travel with pets','pet carrier','pet travel essentials']],
      products: [['Premium dog food','Grain-free options','Dog food toppers'],['Training treats','Clickers','Puppy pads'],['Clumping litter','Crystal litter','Litter boxes'],['Leashes','Crates','Dog beds'],['Lemonade Pet','Healthy Paws','Embrace'],['Generic medications','Pet supplements','DIY grooming kits'],['Kong toys','Puzzle feeders','Snuffle mats'],['Raw food delivery','Freeze-dried food','Raw food supplements'],['Seresto collars','Frontline','Natural repellents'],['Pet carriers','Car seat covers','Travel water bowls']],
    },
    home: {
      titles: ['Best Air Purifiers for Allergies: Tested and Reviewed','How to Start a Low-Maintenance Garden (Even If You Kill Everything)','The Best Kitchen Gadgets That Are Actually Worth Buying','Smart Thermostat Guide: Save Money and Stay Comfortable','Best Mattresses for Every Sleep Style (2025 Guide)','How to Organize Your Home Like a Minimalist','The Best Water Filters for Clean, Great-Tasting Water','Energy-Saving Products That Pay for Themselves','Best Indoor Plants for Air Quality (And How to Not Kill Them)','The Complete Guide to Home Security Systems'],
      keywords: [['best air purifier','air purifier allergies','HEPA air purifier'],['beginner gardening','low maintenance garden','easy plants'],['best kitchen gadgets','kitchen essentials','cooking tools'],['smart thermostat','best thermostat','save on heating'],['best mattress','mattress review','mattress guide'],['home organization','minimalist home','declutter tips'],['best water filter','water purifier','filtered water'],['energy saving products','save electricity','eco home'],['best indoor plants','air purifying plants','easy houseplants'],['home security systems','best security camera','smart security']],
      products: [['Dyson purifiers','HEPA filters','Air quality monitors'],['Garden tool sets','Raised bed kits','Seed starter kits'],['Instant Pot','Air fryers','Knife sets'],['Nest thermostat','Ecobee','Smart plugs'],['Memory foam mattresses','Hybrid mattresses','Pillows'],['Storage bins','Label makers','Shelf organizers'],['Brita filters','Berkey','Under-sink systems'],['LED bulbs','Smart power strips','Solar chargers'],['Snake plants','Pothos','Plant care kits'],['Ring doorbell','SimpliSafe','Wyze cameras']],
    },
  }

  const sections = ['Introduction & Hook','Why This Matters','Detailed Breakdown','Expert Analysis','Product Comparisons','Pros & Cons','Our Top Pick','Conclusion & CTA']
  const articles: PrewrittenArticle[] = []

  for (const [nicheId, templates] of Object.entries(data)) {
    const nicheLabel = NICHES.find(n => n.id === nicheId)?.label || nicheId
    templates.titles.forEach((title, index) => {
      articles.push({
        id: `${nicheId}-${index + 1}`,
        niche: nicheId,
        title,
        seoKeywords: templates.keywords[index],
        suggestedProducts: templates.products[index],
        sections,
        content: buildArticleContent(title, nicheLabel, templates.keywords[index], templates.products[index]),
      })
    })
  }
  return articles
}

const ALL_ARTICLES = getArticles()

export default function InfinitePage() {
  const router = useRouter()
  const { isUpsellUnlocked, setCurrentArticle } = useAppStore()

  const [isChecking, setIsChecking] = useState(true)
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewArticle, setPreviewArticle] = useState<PrewrittenArticle | null>(null)
  const [copied, setCopied] = useState(false)
  const [usedArticles, setUsedArticles] = useState<Set<string>>(new Set())
  const [promoLink, setPromoLink] = useState('')
  const [showPortfolioLinks, setShowPortfolioLinks] = useState(false)
  const [linkApplied, setLinkApplied] = useState(false)
  const affiliateLinks = useAppStore(s => s.affiliateLinks)

  useEffect(() => {
    if (!isUpsellUnlocked('infinite')) {
      router.push('/unlock/infinite')
    } else {
      setIsChecking(false)
    }
  }, [isUpsellUnlocked, router])

  const displayContent = useMemo(() => {
    if (!previewArticle) return ''
    if (!promoLink.trim()) return previewArticle.content
    const url = promoLink.trim()
    return previewArticle.content
      .replace(/href='#'/g, `href='${url}' target='_blank' rel='noopener noreferrer'`)
      .replace(/\[YOUR LINK HERE\]/g, 'Your Promotional Link ✓')
  }, [previewArticle, promoLink])

  const filteredArticles = useMemo(() => {
    let items = ALL_ARTICLES
    if (selectedNiche) items = items.filter(a => a.niche === selectedNiche)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(a => a.title.toLowerCase().includes(q) || a.seoKeywords.some(k => k.toLowerCase().includes(q)))
    }
    return items
  }, [selectedNiche, searchQuery])

  const handleSaveArticle = (navigateTo: 'saved' | 'publish' | 'images') => {
    if (!previewArticle) return
    const nicheLabel = NICHES.find(n => n.id === previewArticle.niche)?.label || ''

    const newArticle = {
      id: crypto.randomUUID(),
      user_id: '',
      title: previewArticle.title,
      content: displayContent,
      platform: 'linkedin' as const,
      tone: 'authoritative' as const,
      length: 'long' as const,
      status: 'draft' as const,
      niche: nicheLabel,
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    useAppStore.getState().addArticle(newArticle)
    setCurrentArticle(newArticle)
    setUsedArticles(prev => new Set(prev).add(previewArticle.id))

    try {
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      })
    } catch {}

    if (navigateTo === 'images') {
      router.push('/images')
    } else if (navigateTo === 'publish') {
      router.push('/publish')
    } else {
      router.push('/saved')
    }
  }

  const handleCopyContent = async () => {
    if (!previewArticle) return
    const text = displayContent.replace(/<[^>]*>/g, '')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-locus-border animate-pulse" />
      </div>
    )
  }

  // ═══════════════ ARTICLE PREVIEW ═══════════════
  if (previewArticle) {
    const niche = NICHES.find(n => n.id === previewArticle.niche)
    return (
      <div className="max-w-5xl mx-auto animate-fade-in">
        <button
          onClick={() => { setPreviewArticle(null); setPromoLink(''); setLinkApplied(false); setShowPortfolioLinks(false) }}
          className="flex items-center gap-2 text-locus-muted hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Library</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="warning">Infinite Mode</Badge>
                <Badge variant="default">{niche?.emoji} {niche?.label}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {previewArticle.title}
              </h1>
              <p className="text-sm text-locus-muted">~1,500 words &bull; SEO-optimized &bull; Ready to publish</p>
            </div>

            <Card>
              <div
                className="prose prose-invert max-w-none text-sm text-locus-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-8 border-amber-400/30 bg-[rgba(245,158,11,0.03)]">
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon size={16} className="text-amber-400" />
                <h3 className="font-semibold text-white">Your Promotional Link</h3>
              </div>
              <p className="text-xs text-locus-muted mb-3">
                Paste your link below — it will replace all link placeholders in the article automatically.
              </p>
              <input
                type="url"
                placeholder="https://your-link.com/ref=..."
                value={promoLink}
                onChange={e => {
                  setPromoLink(e.target.value)
                  setLinkApplied(!!e.target.value.trim())
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-locus-border text-white placeholder-locus-muted text-sm focus:outline-none focus:border-amber-400 transition-colors mb-3"
              />
              {linkApplied && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 mb-3">
                  <Check size={14} />
                  <span>Link applied to all placeholders in the article</span>
                </div>
              )}
              {affiliateLinks.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowPortfolioLinks(!showPortfolioLinks)}
                    className="text-xs text-locus-teal hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronRight size={12} className={`transition-transform ${showPortfolioLinks ? 'rotate-90' : ''}`} />
                    Choose from My Portfolio ({affiliateLinks.length})
                  </button>
                  {showPortfolioLinks && (
                    <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
                      {affiliateLinks.map(link => (
                        <button
                          key={link.id}
                          onClick={() => {
                            setPromoLink(link.link)
                            setLinkApplied(true)
                            setShowPortfolioLinks(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${promoLink === link.link ? 'bg-amber-400/15 border border-amber-400/30 text-amber-400' : 'bg-[rgba(255,255,255,0.03)] border border-locus-border text-locus-text hover:border-locus-teal'}`}
                        >
                          <span className="font-medium block truncate">{link.label || link.link}</span>
                          <span className="text-locus-muted truncate block">{link.link}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="font-semibold text-white mb-4">Article Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-locus-muted uppercase tracking-wider">SEO Keywords</label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {previewArticle.seoKeywords.map(k => (
                      <span key={k} className="px-2 py-1 rounded-lg bg-[rgba(20,184,166,0.1)] text-locus-teal text-xs border border-[rgba(20,184,166,0.2)]">{k}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-locus-muted uppercase tracking-wider">Suggested Products</label>
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
                  <label className="text-xs text-locus-muted uppercase tracking-wider">Quick Steps</label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${linkApplied ? 'bg-emerald-400/20 text-emerald-400' : 'bg-amber-400/15 text-amber-400'}`}>{linkApplied ? '✓' : '1'}</span>
                      <span className="text-locus-text">{linkApplied ? 'Promotional link added!' : 'Add your promotional link above'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center text-[10px] text-amber-400 font-bold shrink-0 mt-0.5">2</span>
                      <span className="text-locus-text">Save & generate images</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center text-[10px] text-amber-400 font-bold shrink-0 mt-0.5">3</span>
                      <span className="text-locus-text">Publish to your chosen platform</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-locus-border space-y-2">
                <Button onClick={handleCopyContent} variant="secondary" className="w-full">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Article'}</span>
                </Button>
                <Button onClick={() => handleSaveArticle('images')} className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400">
                  <ImageIcon size={16} />
                  <span>Save & Generate Images</span>
                </Button>
                <Button onClick={() => handleSaveArticle('saved')} variant="secondary" className="w-full">
                  <Save size={16} />
                  <span>Save to My Portfolio</span>
                </Button>
                <Button onClick={() => handleSaveArticle('publish')} variant="secondary" className="w-full">
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

  // ═══════════════ LIBRARY VIEW ═══════════════
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <Badge variant="cyan">Infinite Mode</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          100 Ready-to-Publish Authority Articles
        </h1>
        <p className="text-locus-muted max-w-2xl">
          Complete SEO-optimized articles across 10 profitable niches — just replace the link placeholders
          with your promotional links, generate images, and publish.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in stagger-1">
        {[
          { label: 'Total Articles', value: '100', icon: FileText, color: 'text-locus-teal' },
          { label: 'Niches Covered', value: '10', icon: Globe, color: 'text-amber-400' },
          { label: 'Words Each', value: '~1,500', icon: Sparkles, color: 'text-emerald-400' },
          { label: 'SEO-Optimized', value: '100%', icon: TrendingUp, color: 'text-cyan-400' },
        ].map((stat, i) => (
          <Card key={i} className="text-center py-4">
            <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-locus-muted">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-8 animate-fade-in stagger-2 border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.03)]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-cyan-400" />
          <h3 className="font-semibold text-white">How It Works — 3 Simple Steps</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Pick an Article', desc: 'Browse 100 pre-written articles. Every article is complete, SEO-optimized, and ready to go.', icon: BookOpen },
            { step: '2', title: 'Add Your Links', desc: 'Replace [YOUR LINK HERE] placeholders with your promotional links and generate images.', icon: LinkIcon },
            { step: '3', title: 'Publish & Earn', desc: 'Post on LinkedIn, Medium, Quora, Reddit, or X. Start earning commissions.', icon: DollarSign },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/15 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-cyan-400">{item.step}</span>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-locus-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in stagger-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-locus-muted" />
          <input
            type="text"
            placeholder="Search by title or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-locus-border text-white placeholder-locus-muted text-sm focus:outline-none focus:border-locus-teal transition-colors"
          />
        </div>
        {selectedNiche && (
          <button onClick={() => setSelectedNiche(null)} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.3)] text-locus-teal text-sm">
            <span>{NICHES.find(n => n.id === selectedNiche)?.emoji} {NICHES.find(n => n.id === selectedNiche)?.label}</span>
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 animate-fade-in stagger-3">
        <button
          onClick={() => setSelectedNiche(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!selectedNiche ? 'bg-locus-teal text-white' : 'bg-[rgba(255,255,255,0.05)] text-locus-muted hover:text-white border border-locus-border'}`}
        >
          All Niches (100)
        </button>
        {NICHES.map(niche => (
          <button
            key={niche.id}
            onClick={() => setSelectedNiche(niche.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedNiche === niche.id ? 'bg-locus-teal text-white' : 'bg-[rgba(255,255,255,0.05)] text-locus-muted hover:text-white border border-locus-border'}`}
          >
            {niche.emoji} {niche.label} ({niche.count})
          </button>
        ))}
      </div>

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
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0 text-lg border border-cyan-400/20">
                  {niche?.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-400/70">{niche?.label}</span>
                    {isUsed && <Badge variant="success" className="text-[9px]">Saved</Badge>}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-locus-teal transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-locus-muted">
                    <span className="flex items-center gap-1"><FileText size={11} /> ~1,500 words</span>
                    <span className="flex items-center gap-1"><TrendingUp size={11} /> SEO</span>
                    <span className="flex items-center gap-1"><Check size={11} /> Ready</span>
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
