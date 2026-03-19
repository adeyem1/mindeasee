import React from "react";
import { cn } from "@/lib/utils";

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  number: number;
  title: string;
  description: string;
}

export function Step({ number, title, description, className, ...props }: StepProps) {
  return (
    <div className={cn("text-center", className)} {...props}>
      <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="font-bold">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
