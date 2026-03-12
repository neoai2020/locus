import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const TONE_PROMPTS: Record<string, string> = {
  authoritative: 'Write in an authoritative, expert tone. Use data, statistics, and confident language. Position the author as a thought leader.',
  conversational: 'Write in a friendly, conversational tone. Use personal anecdotes, ask questions, and connect with the reader emotionally.',
  bold: 'Write in a bold, provocative tone. Challenge conventional thinking, make strong statements, and be unapologetic.',
}

const LENGTH_TOKENS: Record<string, number> = {
  short: 500,
  medium: 1000,
  long: 1500,
}

const PLATFORM_FORMATS: Record<string, string> = {
  linkedin: `Format for LinkedIn:
- Start with a powerful hook in the first 2 lines (before the "see more" fold)
- Use line breaks between paragraphs for readability
- Include personal experience or story
- End with a clear call-to-action and question to encourage engagement
- Suggest 3-5 relevant hashtags at the end`,
  
  medium: `Format for Medium:
- Use a compelling headline that promises value
- Include a strong opening paragraph that hooks the reader
- Use subheadings (##) to break up sections
- Include quotes, statistics, or examples
- End with key takeaways and a CTA`,
  
  quora: `Format for Quora answer:
- Open by directly answering the question in 1-2 sentences
- Expand with detailed explanation and personal experience
- Use bullet points and numbered lists for scannability
- Include relevant data or examples
- End with a brief summary and invite the reader to follow for more`,

  reddit: `Format for Reddit post:
- Write a clear, specific title — avoid clickbait
- Open with a TL;DR or key takeaway
- Use short paragraphs and line breaks
- Be genuinely helpful and conversational — avoid marketing speak
- End with a question to invite discussion`,

  twitter: `Format for X/Twitter thread:
- Tweet 1: Bold hook or controversial insight (under 280 chars)
- Break key points into individual tweets, each standing alone
- Use line breaks and short sentences for readability
- Include 1-2 relevant stats or data points
- Final tweet: CTA + 2-3 hashtags`,
  
  facebook: `Format for Facebook post:
- Start with an attention-grabbing first sentence or question
- Use emojis to make the post visually engaging
- Break text into short, readable paragraphs
- Include clear benefits of the product/link being shared
- End with a strong, direct call-to-action
- Suggest 2-3 relevant hashtags`,
}

async function callChatGPT(messages: { role: string; content: string }[]) {
  const response = await fetch('https://chatgpt-42.p.rapidapi.com/gpt4', {
    method: 'POST',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST || 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      web_access: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('RapidAPI error:', errorText)
    throw new Error(`ChatGPT API error: ${response.status}`)
  }

  const data = await response.json()
  return data.result || data.message || data.choices?.[0]?.message?.content || JSON.stringify(data)
}

async function scrapeProductInfo(url: string) {
  const scraperApiKey = process.env.SCRAPER_API_KEY
  if (!scraperApiKey) return null

  try {
    const scraperUrl = `https://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}&render=true`
    const response = await fetch(scraperUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) return null

    const html = await response.text()

    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is)
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : ''

    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/is)
    const metaDescription = metaDescMatch ? metaDescMatch[1].replace(/\s+/g, ' ').trim() : ''

    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["'](.*?)["']/is)
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].replace(/\s+/g, ' ').trim() : ''

    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["'](.*?)["']/is)
    const ogDesc = ogDescMatch ? ogDescMatch[1].replace(/\s+/g, ' ').trim() : ''

    const priceMatch = html.match(/(?:price|سعر)[^<]*?(\d+[\.,]?\d*)/is)
    const price = priceMatch ? priceMatch[1] : ''

    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is)
    const h1Text = h1Match ? h1Match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : ''

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/is)
    let bodyText = ''
    if (bodyMatch) {
      bodyText = bodyMatch[1]
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 2000)
    }

    return {
      title: ogTitle || title || h1Text || '',
      description: ogDesc || metaDescription || '',
      h1: h1Text,
      price,
      bodySnippet: bodyText.substring(0, 500),
    }
  } catch (err) {
    console.error('Scrape error in generate route:', err)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to generate articles.' },
        { status: 401 }
      )
    }

    const apiKey = process.env.RAPIDAPI_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'RapidAPI key not configured. Please add RAPIDAPI_KEY to environment variables.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { topic, platform, platforms, tone, length, affiliateLink, niche, customPrompt } = body
    let { productInfo } = body

    // Auto-scrape if link provided but no info
    if (affiliateLink && !productInfo) {
      productInfo = await scrapeProductInfo(affiliateLink)
    }

    // Support both single platform and multiple platforms
    const targetPlatforms: string[] = platforms || (platform ? [platform] : [])

    if (!topic || targetPlatforms.length === 0 || !tone || !length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const platformFormatText = targetPlatforms
      .map((p: string) => PLATFORM_FORMATS[p] || '')
      .join('\n\n')

    const affiliateInstruction = affiliateLink
      ? `\n\nIMPORTANT: Naturally weave in a reference to this product/service link: ${affiliateLink}. 
      Do NOT just paste the raw URL. Instead, integrate it as an HTML link with descriptive text (like the product name). 
      Format: <a href='${affiliateLink}' target='_blank' class='text-locus-teal font-bold underline decoration-2 underline-offset-4 hover:text-locus-cyan transition-all'>Product Name</a>. 
      NOTE: Use single quotes (') for HTML attributes inside the JSON string to avoid breaking the JSON format! 
      Make it feel organic and helpful.`
      : ''

    const nicheContext = niche
      ? `\nThe context is ${niche}.`
      : ''

    const productContext = productInfo 
      ? `\n\nACTUAL PRODUCT DATA (Source of Truth):
- Title: ${productInfo.title || 'Unknown'}
- Description: ${productInfo.description || ''}
- Found on Page: ${productInfo.h1 || ''}
- Price Info: ${productInfo.price || ''}
- Snippet: ${productInfo.bodySnippet || ''}

CRITICAL REQUIREMENT: You MUST base the content ENTIRELY on the actual product features above. 
If it is a physical item (like a lantern, decor, or gadget), write about its physical benefits, price, and how it looks. 
Do NOT talk about 'Digital Storefronts', 'E-commerce algorithms', or 'Marketing Strategy' unless the product is specifically a marketing tool. 
Base your 'Hook', 'Body', and 'CTA' on the REAL product provided.`
      : ''

    const systemPrompt = `You are an expert copywriter and sales strategist. Your goal is to write highly relevant, specific, and engaging social media content.

${TONE_PROMPTS[tone] || TONE_PROMPTS.authoritative}

${platformFormatText}
${productContext}
${nicheContext}
${affiliateInstruction}

Important guidelines:
- Be extremely specific about the product features and benefits mentioned in the data.
- Avoid generic "business coach" or "marketing guru" language unless it fits the product perfectly.
- If the item is a festive or cultural product (Ramadan, Christmas, etc.), use a warm, celebratory, and welcoming tone.
- Do NOT include any disclaimers about AI-generated content.
- DO NOT use Markdown formatting (*, #, etc). YOU MUST USE ONLY HTML TAGS (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <br>).
- CRITICAL: When writing HTML inside the JSON string, you MUST use SINGLE QUOTES inside HTML tags.
- LANGUAGE: The primary output must be English, but you MUST preserve the original product name/title if it's in another language.`

    const userPrompt = `Create a ${length} (approximately ${LENGTH_TOKENS[length] || 1000} words) article about: "${topic}"

${targetPlatforms.length > 1 ? `This article should work well across these platforms: ${targetPlatforms.join(', ')}` : ''}

Structure your response in this exact JSON format. The string values MUST contain HTML formatting tags, not Markdown:
{
  "hook": "The opening hook/attention-grabber (first 2-3 sentences, formatted in HTML)",
  "body": "The main body of the article with proper HTML formatting (use <p>, <h2>, <ul>, etc.)",
  "cta": "The call-to-action section at the end (HTML formatted)"
}

Make the content compelling, valuable, and ready to publish immediately. Respond ONLY with the JSON object.`

    const finalSystemPrompt = customPrompt
      ? `You are an expert SEO content writer. Write complete, real articles with actual content — never use placeholder brackets or template text. Always format output as HTML (no markdown). Respond ONLY with valid JSON: {"hook": "...", "body": "...", "cta": "..."}`
      : systemPrompt

    const finalUserPrompt = customPrompt
      ? `${customPrompt}\n\nRespond ONLY with this exact JSON format (use HTML formatting inside values):\n{"hook": "opening hook HTML", "body": "main article body HTML", "cta": "call-to-action HTML"}`
      : userPrompt

    const result = await callChatGPT([
      { role: 'system', content: finalSystemPrompt },
      { role: 'user', content: finalUserPrompt },
    ])

    // Parse the response
    let parsed: { hook: string; body: string; cta: string }
    try {
      parsed = JSON.parse(result)
    } catch {
      // Try to find JSON in the response
      const match = result.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(match[0])
        } catch {
          // Fallback if the extracted JSON is still invalid
          parsed = { hook: '', body: result, cta: '' }
        }
      } else {
        // Fallback: use the whole response as body
        parsed = {
          hook: '',
          body: result,
          cta: '',
        }
      }
    }

    const fullContent = [parsed.hook, parsed.body, parsed.cta].filter(Boolean).join('\n\n')

    return NextResponse.json({
      hook: parsed.hook,
      body: parsed.body,
      cta: parsed.cta,
      fullContent,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate article. Please try again.' },
      { status: 500 }
    )
  }
}
