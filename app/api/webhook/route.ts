import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Database ချိတ်ဆက်မှုအတွက် Keys များ
const SUPABASE_URL = 'https://nfngeklmyyvvrqblvgcg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BfAagtaG1jv2B0TegSXCZQ_Cp1Y2mRM'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Telegram က ပို့လိုက်တဲ့ Message သို့မဟုတ် Channel Post ကို ယူခြင်း
    const post = body.channel_post || body.message;

    if (post && post.text) {
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            // Logical OR (||) ကို သေချာထည့်ထားပါတယ်
            user: post.chat?.title  post.from?.first_name  'News Bot', 
            text: post.text 
          }
        ]);

      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}