import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
    title: string;
    description: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    image?: React.ReactNode;
}

export function HeroSection({
    className,
    title,
    description,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
    image,
    ...props
}: HeroSectionProps) {
    return (
       <header
            className={cn(
                "relative overflow-hidden w-full bg-emerald-900 dark:from-dark-green dark:via-dark-green/95 dark:to-dark-green/90  min-h-screen flex items-center justify-center",
                className
            )}
            {...props}
        >


            {/* Animated decorative blobs - more vivid */}
            <div className="absolute top-10 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/40 to-secondary/40 dark:from-primary/20 dark:to-secondary/20 blur-[100px] opacity-80 wave-animate" />
            <div className="absolute bottom-1/3 -left-24 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-secondary/30 to-accent/40 dark:from-secondary/15 dark:to-accent/20 blur-[80px] opacity-80 float-animate" />
            <div className="absolute top-1/3 -right-24 w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-accent/40 to-citrine/30 dark:from-accent/20 dark:to-citrine/15 blur-[70px] opacity-70 pulse-animate" />
            
            {/* Additional decorative elements */}
            <div className="absolute top-3/4 left-1/4 w-24 h-24 rounded-full bg-citrine/30 dark:bg-citrine/20 blur-xl opacity-70 blob-animate" />
            <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full bg-secondary/40 dark:bg-secondary/20 blur-lg opacity-60 float-animate" />

            {/* Web3 radial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-background/40 dark:to-background/60" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10 flex items-center justify-center h-full py-12 sm:py-16 md:py-20">
                <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto w-full">
                    <div className="relative w-full">
                        {/* Animated highlight for title */}
                        <div className="absolute -left-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-r from-accent/30 to-secondary/30 dark:from-accent/20 dark:to-secondary/20 blur-xl opacity-80 blob-animate" />
                        <div className="absolute right-0 bottom-0 w-20 h-20 rounded-full bg-gradient-to-r from-secondary/30 to-accent/30 dark:from-secondary/20 dark:to-accent/20 blur-lg opacity-80 float-animate" />

                        {/* Title with enhanced glow effect */}
                        <div className="relative mb-8">
                            {/* Title glow background effect */}
                            <div className="absolute -inset-1 bg-white/5 blur-lg rounded-lg"></div>
                            <div className="absolute -inset-4 bg-gradient-to-r from-citrine/5 via-accent/10 to-citrine/5 blur-xl rounded-lg glow-animate opacity-70"></div>
                            
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white dark:text-white relative z-10 leading-tight">
                                {title}
                            </h1>

                            {/* Enhanced glow under title */}
                            <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-citrine/70 to-transparent pulse-animate" />
                        </div>

                        {/* Glass card for description */}
                        <div className="text-center relative rounded-2xl px-4 sm:px-6 py-4 sm:py-5 mb-8 sm:mb-10 max-w-2xl mx-auto">
                            {/* Animated decorative elements */}
                            <div className="absolute -top-2 -left-2 w-16 h-16 bg-accent/30 dark:bg-accent/20 rounded-full blur-xl opacity-70 pulse-animate" />
                            <div className="absolute -bottom-3 right-1/4 w-16 h-16 bg-secondary/30 dark:bg-secondary/20 rounded-full blur-xl opacity-70 float-animate" />
                            <div className="absolute top-1/2 right-0 w-12 h-12 bg-citrine/30 dark:bg-citrine/20 rounded-full blur-lg opacity-70 blob-animate" />
                            
                            <p className="text-lg sm:text-xl text-white dark:text-white/90 mx-auto relative z-10 leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md sm:max-w-none">
                            {primaryButtonLink && primaryButtonText && (
                                <Link href={primaryButtonLink}>
                                    <Button 
                                        size="xl" 
                                        className="relative overflow-hidden group w-full sm:w-auto"
                                        style={{ backgroundColor: "#efd523", color: "#173217" }}
                                    >
                                        {/* Button glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-accent to-accent/30 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                        <span className="relative z-10 font-medium flex items-center">
                                            {primaryButtonText} <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                    </Button>
                                </Link>
                            )}
                            {secondaryButtonLink && secondaryButtonText && (
                                <Link href={secondaryButtonLink}>
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        className="font-medium backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/10 text-white hover:text-white transition-all duration-300 w-full sm:w-auto"
                                    >
                                        {secondaryButtonText}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-fern-green via-fern-green/90 to-transparent dark:from-dark-green dark:via-dark-green/90"></div>
        </header>
    );
}
