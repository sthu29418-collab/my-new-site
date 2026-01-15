'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Newspaper, Clock } from 'lucide-react';

const supabase = createClient(
  'https://nfngeklmyyvvrqblvgcg.supabase.co',
  'sb_publishable_BfAagtaG1jv2B0TegSXCZQ_Cp1Y2mRM'
);

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // အစပိုင်းမှာ Database ထဲက အချက်အလက်တွေ ယူမယ်
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('id', { ascending: false });
      if (data) setMessages(data);
    };

    fetchMessages();

    // Real-time ချိတ်ဆက်မယ် (Telegram က စာဝင်လာတာနဲ့ Website မှာ တန်းပေါ်ဖို့)
    const channel = supabase
      .channel('realtime-messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex items-center justify-between mb-12 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">BREAKING NEWS</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Connection Active
          </div>
        </header>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    {msg.user}
                  </span>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  {msg.text}
                </p>

                <div className="flex items-center text-xs text-gray-500 gap-2 border-t border-gray-800 pt-4">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.created_at || Date.now()).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <p className="animate-pulse">Waiting for new updates from Telegram...</p>
          </div>
        )}
      </div>
    </main>
  );
}