import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children: React.ReactNode;
  container?: boolean;
  glass?: boolean;
}

export function Section({
  className,
  children,
  container = true,
  glass = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-12 sm:py-16 md:py-20 lg:py-24",
        glass && "glass",
        className
      )}
      {...props}
    >
      {container ? (
        <div className="container mx-auto px-4 sm:px-6">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

export function SectionHeading({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 tracking-tight", className)}
      {...props}
    >
      {children}
    </h2>
  );
}
