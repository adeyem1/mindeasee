import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
  linkText?: string;
  glass?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon,
  link,
  linkText,
  glass,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <Card glass={glass} className={cn("", className)} {...props}>
      <CardHeader>
        <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-16 h-16 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      {link && linkText && (
        <CardFooter>
          <Link 
            href={link} 
            className="text-primary font-medium inline-flex items-center hover:underline"
          >
            {linkText} <FiArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
