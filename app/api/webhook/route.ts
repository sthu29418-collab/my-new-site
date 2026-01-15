import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://nfngeklmyyvvrqblvgcg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BfAagtaG1jv2B0TegSXCZQ_Cp1Y2mRM'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = body.channel_post || body.message;

    if (post && post.text) {
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            // ဤနေရာတွင် || သင်္ကေတ နှစ်ခု ပါဝင်ရပါမည်
            user: post.chat?.title  post.from?.first_name  'News Bot', 
            text: post.text 
          }
        ]);

      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}