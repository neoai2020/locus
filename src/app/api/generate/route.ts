import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GenerateArticleInput } from '@/types'

// Force dynamic rendering - don't try to pre-render this route
export const dynamic = 'force-dynamic'

const TONE_PROMPTS = {
  authoritative: 'Write in an authoritative, expert tone. Use data, statistics, and confident language. Position the author as a thought leader.',
  conversational: 'Write in a friendly, conversational tone. Use personal anecdotes, ask questions, and connect with the reader emotionally.',
  bold: 'Write in a bold, provocative tone. Challenge conventional thinking, make strong statements, and be unapologetic.',
}

const LENGTH_TOKENS = {
  short: 500,
  medium: 1000,
  long: 1500,
}

const PLATFORM_FORMATS = {
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
  
  substack: `Format for Substack newsletter:
- Write an engaging email-friendly headline
- Start with a personal greeting or hook
- Use conversational tone throughout
- Include actionable insights
- End with a question or CTA to encourage replies`,
  
  general: `Format for general publication:
- Professional headline with SEO keywords
- Strong introduction with thesis statement
- Well-structured body with clear sections
- Include expert quotes or data
- Professional conclusion with CTA`,
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key at runtime
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.' },
        { status: 500 }
      )
    }

    // Initialize OpenAI client at runtime
    const openai = new OpenAI({ apiKey })

    const body: GenerateArticleInput = await request.json()
    const { topic, platform, tone, length } = body

    if (!topic || !platform || !tone || !length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an expert content strategist and copywriter who specializes in creating authority-building content for professionals. Your content helps establish thought leadership and drives engagement on high-trust platforms.

${TONE_PROMPTS[tone]}

${PLATFORM_FORMATS[platform]}

Important guidelines:
- Create original, valuable content that positions the author as an expert
- Avoid generic advice - be specific and actionable
- Use power words and emotional triggers appropriately
- Ensure the content is publication-ready
- Do NOT include any disclaimers about AI-generated content`

    const userPrompt = `Create a ${length} (approximately ${LENGTH_TOKENS[length]} words) article about: "${topic}"

Structure your response in this exact JSON format:
{
  "hook": "The opening hook/attention-grabber (first 2-3 sentences that appear before any 'see more' fold)",
  "body": "The main body of the article with proper formatting",
  "cta": "The call-to-action section at the end"
}

Make the content compelling, valuable, and ready to publish immediately.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: LENGTH_TOKENS[length] * 2,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated')
    }

    const parsed = JSON.parse(content)
    const fullContent = `${parsed.hook}\n\n${parsed.body}\n\n${parsed.cta}`

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
