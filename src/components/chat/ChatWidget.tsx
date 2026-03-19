'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically load ChatUI so it doesn’t render server-side
const ChatUI = dynamic(() => import('@/app/chat/page').then((mod) => mod.default), { ssr: false });

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="w-[90vw] sm:w-96 h-[70vh] sm:h-[500px] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between bg-primary text-primary-foreground px-4 py-2">
              <h2 className="font-semibold">MindEase Chat</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-hidden">
              <ChatUI />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
        className="bg-pink-500 text-white p-4 rounded-full shadow-xl hover:bg-pink-600 focus:outline-none"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
