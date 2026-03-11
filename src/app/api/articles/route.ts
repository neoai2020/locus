import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET — Fetch all articles for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch articles error:', error)
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }

    return NextResponse.json({ articles: articles || [] })
  } catch (error) {
    console.error('Articles GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — Save a new article
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, affiliate_link, niche, platform, tone, length, hook, cta } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        user_id: user.id,
        title,
        content,
        affiliate_link: affiliate_link || null,
        niche: niche || null,
        platform: platform || [],
        tone: tone || 'authoritative',
        length: length || 'medium',
        status: 'draft',
        hook: hook || null,
        cta: cta || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Save article error details:', error)
      return NextResponse.json({ 
        error: 'Failed to save article',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Articles POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — Delete an article
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Delete article error:', error)
      return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Article deleted' })
  } catch (error) {
    console.error('Articles DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
