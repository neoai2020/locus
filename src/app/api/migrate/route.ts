import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// POST — Create the articles table (run once)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create articles table
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.articles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          affiliate_link TEXT,
          niche TEXT,
          platform TEXT[] DEFAULT '{}',
          tone TEXT DEFAULT 'authoritative',
          length TEXT DEFAULT 'medium',
          status TEXT DEFAULT 'draft',
          hook TEXT,
          cta TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can read own articles" ON public.articles
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert own articles" ON public.articles
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update own articles" ON public.articles
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete own articles" ON public.articles
          FOR DELETE USING (auth.uid() = user_id);
      `
    })

    if (error) {
      // Table might already exist, try direct creation
      return NextResponse.json({ message: 'Migration may need to be run manually', error: error.message }, { status: 200 })
    }

    return NextResponse.json({ message: 'Articles table created successfully' })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 })
  }
}
