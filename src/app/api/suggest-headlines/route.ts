import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = process.env.RAPIDAPI_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'RapidAPI key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { affiliateLink, niche, previousHeadlines = [], productInfo, suggestTone, topic } = body

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const excludeList = previousHeadlines.length > 0 
      ? `\n\nDo NOT repeat any of these previously suggested headlines:\n${previousHeadlines.map((h: string, i: number) => `${i+1}. ${h}`).join('\n')}`
      : ''

    const productContext = productInfo 
      ? `\n\nProduct Details (scraped from the affiliate link):
- Product Name: ${productInfo.title || 'Unknown'}
- Description: ${productInfo.description || 'No description available'}
- Additional Info: ${productInfo.bodySnippet || ''}

IMPORTANT: The headlines MUST be specifically about THIS product. Do NOT make up features or confuse it with other products.`
      : ''

    const prompt = `You are an expert content strategist. Generate exactly 5 unique, compelling article headline suggestions for the following:

Niche: ${niche}
${affiliateLink ? `Affiliate/Product Link: ${affiliateLink}` : ''}
${productContext}
${excludeList}

Requirements:
- Each headline should be attention-grabbing and optimized for engagement
- Headlines MUST be specifically relevant to the actual product/service described above
- Each headline should take a different angle or approach (review, comparison, how-to, benefits, guide)
- Make headlines specific and detailed, not generic
- Write headlines in the same language as the product name/description

Respond ONLY with a JSON array of exactly 5 strings, like:
["headline 1", "headline 2", "headline 3", "headline 4", "headline 5"]`


    const result = await callChatGPT([
      { role: 'user', content: prompt }
    ])

    // console.log('Headline Generation Result:', result)

    // Parse the response - try to extract JSON array
    let headlines: string[] = []
    try {
      // Try direct JSON parse
      headlines = JSON.parse(result)
    } catch {
      // Try to find JSON array in the response
      const match = result.match(/\[[\s\S]*?\]/)
      if (match) {
        try {
          headlines = JSON.parse(match[0])
        } catch {
          // If regex find failed parse, fall through
        }
      }
      
      // If headlines still empty, try splitting by known patterns
      if (!headlines || headlines.length === 0) {
        // Try splitting by newline first
        const splitLines = result.split(/\n+/)
        
        if (splitLines.length > 1) {
          headlines = splitLines
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 5)
            .map((line: string) => line.replace(/^\d+[\.\)]\s*/, '').replace(/^["']|["']$/g, '').trim())
        } else {
          // If only one line, try splitting by the number pattern "1. " "2. " etc.
          // Look for digits followed by dot/paren
          const matches = [...result.matchAll(/(?:\d+[\.\)]\s*)([^\d]+?)(?=\s*\d+[\.\)]|$)/g)]
          if (matches.length > 0) {
            headlines = matches.map(m => m[1].trim())
          } else {
            // Last resort
            headlines = [result]
          }
        }
      }
    }

    // Clean up results
    headlines = headlines
      .filter((h: any) => typeof h === 'string' && h.length > 5)
      .map((h: string) => h.replace(/^\d+[\.\)]\s*/, '').trim())
      .slice(0, 5)

    // If tone suggestion requested, do a second call
    let suggestedToneResult = null
    let toneReason = ''
    if (suggestTone) {
      try {
        const tonePrompt = `You are a content strategy expert. Based on the following, recommend the single best tone for an article:

Niche: ${niche}
${topic ? `Topic: ${topic}` : ''}
${affiliateLink ? `Product Link: ${affiliateLink}` : ''}

Available tones: authoritative, conversational, bold

Respond ONLY with JSON: {"tone": "chosen_tone", "reason": "one very short, friendly, and simple sentence explaining why this is the best fit for the reader (user-facing)"}`

        const toneResult = await callChatGPT([{ role: 'user', content: tonePrompt }])
        try {
          const parsed = JSON.parse(toneResult)
          suggestedToneResult = parsed.tone
          toneReason = parsed.reason
        } catch {
          const match = toneResult.match(/\{[\s\S]*?\}/)
          if (match) {
            const parsed = JSON.parse(match[0])
            suggestedToneResult = parsed.tone
            toneReason = parsed.reason
          }
        }
      } catch (err) {
        console.error('Tone suggestion failed:', err)
      }
    }

    return NextResponse.json({ headlines, suggestedTone: suggestedToneResult, toneReason })

  } catch (error: any) {
    console.error('Suggest headlines error:', error)
    return NextResponse.json({ error: error.message || 'Failed to suggest headlines' }, { status: 500 })
  }
}
