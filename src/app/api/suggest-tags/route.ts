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

    const { platform, articleTitle, articleContent, niche } = await request.json()

    if (!platform || !articleTitle) {
      return NextResponse.json({ error: 'Platform and article title are required' }, { status: 400 })
    }

    const platformFormats: Record<string, string> = {
      linkedin: 'LinkedIn hashtags (e.g. #DigitalMarketing). Suggest 5-8 hashtags. Mix 2-3 broad/popular hashtags with 3-5 niche-specific ones.',
      quora: 'Quora topics/spaces the answer should be added to (e.g. "Digital Marketing", "Affiliate Marketing Tips"). Suggest 5-8 relevant Quora topics.',
      medium: 'Medium tags (e.g. "Marketing", "Side Hustle"). Medium allows up to 5 tags. Suggest exactly 5 tags, ordered by popularity.',
      reddit: 'Relevant subreddits to post in (e.g. "r/Entrepreneur", "r/SEO") and post flair keywords. Suggest 3-5 subreddits and 2-3 flair keywords.',
      twitter: 'X/Twitter hashtags (e.g. #MarketingTips). Suggest 3-5 hashtags only — over-hashtagging hurts reach on X.',
    }

    const contentSnippet = articleContent
      ? articleContent.substring(0, 500)
      : ''

    const prompt = `You are a social media growth expert. Based on the following article, suggest the best ${platformFormats[platform] || 'tags/hashtags'}

Article Title: ${articleTitle}
${niche ? `Niche: ${niche}` : ''}
${contentSnippet ? `Article Excerpt: ${contentSnippet}` : ''}

Requirements:
- Tags should maximize discoverability and reach on ${platform}
- Include a mix of high-volume and niche-specific tags
- Order by relevance (most important first)
- For each tag, add a brief reason why it's effective (one short sentence)

Respond ONLY with valid JSON in this exact format:
{"tags": [{"tag": "the tag or hashtag", "reason": "why this tag works"}]}`

    const result = await callChatGPT([{ role: 'user', content: prompt }])

    let tags: { tag: string; reason: string }[] = []
    try {
      const parsed = JSON.parse(result)
      tags = parsed.tags || []
    } catch {
      const match = result.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          tags = parsed.tags || []
        } catch {
          // fallback
        }
      }
    }

    return NextResponse.json({ tags, platform })
  } catch (error: any) {
    console.error('Suggest tags error:', error)
    return NextResponse.json({ error: error.message || 'Failed to suggest tags' }, { status: 500 })
  }
}
