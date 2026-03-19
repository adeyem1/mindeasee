'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sendChatMessageStream, MessageWithMetadata } from '@/services/aiService';

export function AuthAwareHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageWithMetadata[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);

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

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isTyping) return;

    const messageText = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      const userMessage: MessageWithMetadata = {
        id: `${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      let assistantContent = '';

      await sendChatMessageStream(
        updatedMessages,
        (delta) => {
          assistantContent += delta;
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = assistantContent;
              return [...prev];
            }
            return [...prev, { id: `${Date.now()}`, role: 'assistant', content: assistantContent, timestamp: new Date() }];
          });
        },
        () => {
          setIsTyping(false);
        },
        (error) => {
          console.error('AI error:', error);
          setMessages((prev) => [...prev, { id: `${Date.now()}`, role: 'assistant', content: `Error: ${error}`, timestamp: new Date() }]);
          setIsTyping(false);
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  return (
   <>
      <header
        className={cn(
          'fixed top-0 z-40 w-full transition-all duration-300 px-4 md:px-20 py-5',
          showScrolledStyle
            ? 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
            : 'bg-transparent'
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile menu toggle (left of logo) */}
          <div className="flex items-center">
           

            {/* Logo */}
            <Link
              href="/"
              className={cn(
                'text-xl font-bold transition-colors duration-300',
                showScrolledStyle || needsDarkText ? 'text-primary' : 'text-white'
              )}
            >
              MindEase
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors py-2 px-3 rounded-md  font-medium',
                  pathname === item.href
                    ? showScrolledStyle || needsDarkText
                      ? 'text-primary bg-primary/10'
                      : 'text-white bg-white/10'
                    : showScrolledStyle || needsDarkText
                      ? 'text-foreground/70 hover:text-primary hover:bg-muted/50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:inline-flex"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>

            {/* User Avatar */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={user?.photoURL || ''} alt={user?.name || 'User'} />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

             <Button
              variant="ghost"
              size="icon"
              className="mr-3 md:hidden text-2xl text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-background border-t">
            {/* Close button in mobile menu */}
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FiX />
              </Button>
            </div>
            <div className="flex flex-col p-3 space-y-4">
              {/* Navigation Links */}
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'transition-all duration-200 py-3 px-4 rounded-lg text-lg',
                    pathname === item.href
                      ? 'text-primary font-medium bg-primary/10'
                      : 'text-foreground/80 hover:text-primary hover:bg-muted/50'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-6 mt-6 border-t border-border">
                {isAuthenticated && user ? (
                  /* Authenticated User Actions */
                    <div className="space-y-4">
                      
                      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL || ''} alt={user.name || 'User'} />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          {user.name && (
                            <p className="font-medium text-sm">{user.name}</p>
                          )}
                          {user.email && (
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/profile">
                        <FiUser className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  /* Unauthenticated User Actions */
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button 
                      className="w-full" 
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}

                {/* Theme Toggle */}
                <div className="pt-4 mt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    disabled={!mounted}
                  >
                    {mounted && theme === 'dark' ? (
                      <>
                        <SunIcon className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <MoonIcon className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}    
    </>
  );
}