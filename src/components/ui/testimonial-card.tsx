import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FiUser } from "react-icons/fi";

interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  text: string;
  avatarUrl?: string;
  rating?: number;
  glass?: boolean;
}

export function TestimonialCard({
  name,
  text,
  avatarUrl,
  rating = 5,
  glass,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <Card glass={glass} className={cn("", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 dark:bg-primary/20 h-12 w-12 rounded-full flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="rounded-full h-10 w-10 object-cover"
              />
            ) : (
              <FiUser className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">"{text}"</p>
      </CardContent>
    </Card>
  );
}
