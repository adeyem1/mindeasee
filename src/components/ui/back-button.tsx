import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export const BackButton: React.FC<BackButtonProps> = ({
  href,
  onClick,
  children = 'Back',
  className,
  variant = 'outline'
}) => {
  const buttonContent = (
    <Button 
      variant={variant} 
      className={cn("flex items-center gap-2", className)}
      onClick={onClick}
    >
      <ArrowLeft className="w-4 h-4" />
      {children}
    </Button>
  );

  if (href) {
    return (
      <Link href={href}>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};
