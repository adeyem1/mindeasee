'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { sendChatMessageStream, MessageWithMetadata } from '@/services/aiService';
import {
  saveMessage,
  subscribeToMessages,
  getConversationMessages,
  getUserConversations,
  createNewConversation,
  Conversation,
} from '@/services/chatService';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ChatUI() {
   const [scrolled, setScrolled] = useState(false);
  const [messages, setMessages] = useState<MessageWithMetadata[]>([]);
  const [newMessage, setNewMessage] = useState('');
   const pathname = usePathname();
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationList, setConversationList] = useState<Conversation[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const {  isAuthenticated } = useAuthStore();

  const isHome = pathname === '/';
  
  
  
    useEffect(() => {
      if (!isHome) return;
  
      const handleScroll = () => {
        setScrolled(window.scrollY > 10);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);
  // Load conversation list
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.uid) return;
      const conversations = await getUserConversations(user.uid);
      setConversationList(conversations);
    };
    fetchConversations();
  }, [user?.uid]);

   const showScrolledStyle = isHome ? scrolled : true;
   const needsDarkText = pathname === '/signin' || pathname === '/signup' || pathname === '/forgot-password';


    const navigationItems = [
    { label: 'Resources', href: '/resources' },
    { label: 'Therapists', href: '/therapists' },
    ...(isAuthenticated ? [
      { label: 'AI Chat', href: '/chat' },
      { label: 'Mood Tracker', href: '/mood-tracker' }
    ] : [])
  ];
  // Initialize chat messages
  useEffect(() => {
    if (!user?.uid) return;

    const initializeChat = async () => {
      try {
        if (!conversationId) return;
        const existingMessages = await getConversationMessages(conversationId);
        const convertedMessages: MessageWithMetadata[] = existingMessages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: msg.timestamp,
        }));
        setMessages(convertedMessages);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, [user?.uid, conversationId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = subscribeToMessages(conversationId, (firestoreMessages: MessageWithMetadata[]) => {
      setMessages((prev) => {
        // If a temp assistant message exists, merge it with Firestore messages
        const tempAssistant = prev.find((m) => m.isLoading && m.role === 'assistant');
        if (!tempAssistant) return firestoreMessages;

        // Avoid duplicates: if Firestore already has an assistant message that matches content, drop temp
        const existsSameContent = firestoreMessages.some(
          (m) => m.role === 'assistant' && m.content === tempAssistant.content
        );
        if (existsSameContent) {
          return firestoreMessages;
        }
        return [...firestoreMessages, tempAssistant];
      });
    });
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Crisis detection keywords
const crisisKeywords = [
  'tired of life',
  'suicide',
  'end my life',
  'kill myself',
  'self-harm',
  'hurt myself',
  'want to die',
];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping || !conversationId) return;

    const messageText = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      await saveMessage(conversationId, messageText, 'user');

      // Prepare a streaming assistant message placeholder
      const tempId = `assistant-${Date.now()}`;
      const tempAssistantMessage: MessageWithMetadata = {
        id: tempId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };

      // Optimistically insert the assistant bubble to display streaming content
      setMessages((prev) => [...prev, tempAssistantMessage]);

      const messagesForAI: MessageWithMetadata[] = [
        ...messages,
        {
          id: `${Date.now()}`,
          role: 'user',
          content: messageText,
          timestamp: new Date(),
        },
      ];

      // Crisis detection logic
      const isCrisis = crisisKeywords.some((keyword) =>
        messageText.toLowerCase().includes(keyword)
      );

      if (isCrisis) {
        const crisisMsg = `I'm really sorry to hear that you're feeling this way. Please know that you're not alone, and there are people who care about you and want to help. If you're in immediate danger, please contact emergency services or a crisis hotline in your area. Here are some resources:

- National Suicide Prevention Lifeline: 1-800-273-8255
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911 (US) or your local emergency number`;
        // Update the temporary assistant message with crisis guidance
        setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, content: crisisMsg, isLoading: false } : m));
        await saveMessage(conversationId, crisisMsg, 'assistant');
        setIsTyping(false);
      } else {
        await sendChatMessageStream(
          messagesForAI,
          (delta: string) => {
            // Stream the delta into the temp message
            setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, content: (m.content || '') + delta } : m));
          },
          async () => {
            // Finalize: persist the assistant message
            // We need the latest content from state; do a functional read
            let finalContent = '';
            setMessages((prev) => {
              const current = prev.find(m => m.id === tempId)?.content || '';
              finalContent = current;
              return prev.map(m => m.id === tempId ? { ...m, isLoading: false } : m);
            });
            if (finalContent.trim().length > 0) {
              await saveMessage(conversationId, finalContent, 'assistant');
            }
            setIsTyping(false);
          },
          async (error: string) => {
            console.error('AI error:', error);
            const errMsg = `Error: ${error}`;
            setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, content: errMsg, isLoading: false } : m));
            await saveMessage(conversationId, errMsg, 'assistant');
            setIsTyping(false);
          }
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  // Automatically create a new chat with a context-based title
  useEffect(() => {
    const createNewChat = async () => {
      if (!user?.uid) return;

      try {
        const title = 'Conversation about AI Support'; // Example context-based title
        const newConversation = await createNewConversation(user.uid, title);
        setConversationId(newConversation.id);
        setConversationList((prev) => [newConversation, ...prev]); // Add to the conversation list
      } catch (error) {
        console.error('Error creating new chat:', error);
      }
    };

    createNewChat();
  }, [user?.uid]);

  // State to manage pagination
const [visibleConversations, setVisibleConversations] = useState(5);

// Function to handle showing more conversations
const handleShowMore = () => {
  setVisibleConversations((prev) => prev + 5);
};

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        {/* <AuthAwareHeader /> */}
      </div>

      <header className="fixed top-0 left-0 w-full bg-primary text-primary-foreground shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className={cn(
              'text-xl font-bold transition-colors duration-300',
              showScrolledStyle || needsDarkText ? 'text-white' : 'text-white'
            )}
          >
            MindEase
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors py-2 px-3 rounded-md text-sm font-medium',
                  pathname === item.href
                    ? showScrolledStyle || needsDarkText
                      ? 'text-primary bg-white'
                      : 'text-white bg-white'
                    : showScrolledStyle || needsDarkText
                      ? 'text-white hover:text-amber-50 hover:bg-muted/50'
                      : 'text-white hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden bg-primary-light text-primary-foreground p-2 rounded-md shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
        </div>
      </header>

      {/* Main layout below navbar */}
      <div className="flex flex-col md:flex-row flex-1 pt-16 ">
        {/* Sidebar */}
        <div
          className={`fixed md:static z-30 bg-muted text-muted-foreground p-4 border-r h-full w-64 transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto`}
        >
          <button
            onClick={() => {
              setConversationId(null);
              setIsSidebarOpen(false);
            }}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg mb-4 hover:bg-primary/90"
          >
            New Chat
          </button>

          {/* Ensure unique keys in the conversation list */}
          {conversationList.length > 0 && (
            <ul className="space-y-2">
              {Array.from(new Map(conversationList.map((conv) => [conv.id, conv])).values()).slice(0, visibleConversations).map((conversation) => (
                <li
                  key={conversation.id}
                  className="cursor-pointer py-2 px-4 rounded-lg hover:bg-muted/50"
                  onClick={() => {
                    setConversationId(conversation.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  {conversation.title}
                </li>
              ))}

              {visibleConversations < conversationList.length && (
                <button
                  onClick={handleShowMore}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg mt-4 hover:bg-primary/90"
                >
                  Show More
                </button>
              )}
            </ul>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-8 mt-8 md:mt-0">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-6 flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 bg-primary/20 text-primary flex items-center justify-center font-semibold">
                      AI
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[80%] sm:max-w-md md:max-w-lg ${
                      message.role === 'assistant'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-6">
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-2 bg-primary/20 text-primary flex items-center justify-center font-semibold">
                    AI
                  </div>
                  <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message input */}
          <div className="bg-background border-t p-2 sm:p-4 sticky bottom-0">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-border rounded-l-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-r-lg flex items-center justify-center hover:bg-primary/90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #6366f1;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
}
