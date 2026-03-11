import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

async function callBananaAPI(prompt: string) {
  const url = 'https://google-nano-banana4.p.rapidapi.com/index.php';
  
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
      'x-rapidapi-host': 'google-nano-banana4.p.rapidapi.com',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ prompt, format: 'base64' }).toString(),
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('RapidAPI error:', errorText);
    throw new Error(`Nano Banana API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== 'success' || !data.image_base64) {
    console.error('Invalid response from Banana API:', data);
    throw new Error('Failed to generate image from API');
  }

  return data.image_base64;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to generate images.' },
        { status: 401 }
      )
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY
    if (!rapidApiKey) {
      return NextResponse.json(
        { error: 'RapidAPI key not configured. Please add RAPIDAPI_KEY to environment variables.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required field: prompt' },
        { status: 400 }
      )
    }

    // 1. Generate image using RapidAPI
    const base64Image = await callBananaAPI(prompt);

    // 2. Decode base64 to buffer
    const buffer = Buffer.from(base64Image, 'base64');

    // 3. Upload to Supabase Storage
    const fileName = `${user.id}/${uuidv4()}.png`;
    
    // Attempt uploading to 'article-images' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase Storage Error: Failed to save image:', uploadError);
      return NextResponse.json(
        { error: 'Failed to save generated image to storage. Make sure the "article-images" bucket exists and RLS policies allow inserts.' },
        { status: 500 }
      );
    }

    // 4. Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrl
    })

  } catch (error: any) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: `Backend Error: ${error.message || String(error)}` },
      { status: 500 }
    )
  }
}
