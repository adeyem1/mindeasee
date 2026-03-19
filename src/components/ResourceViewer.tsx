import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { InternalResource } from '@/services/internalContentService';
import Image from 'next/image';

interface ResourceViewerProps {
  resource: InternalResource;
}

export const ResourceViewer: React.FC<ResourceViewerProps> = ({ resource }) => {
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      anxiety: 'bg-wellness-anxiety text-white',
      depression: 'bg-wellness-depression text-white',
      stress: 'bg-wellness-stress text-white',
      meditation: 'bg-wellness-meditation text-white',
      relaxation: 'bg-wellness-relaxation text-white',
      sleep: 'bg-wellness-sleep text-white',
      therapy: 'bg-wellness-therapy text-white',
      'self-help': 'bg-wellness-self-help text-white'
    };
    return colorMap[category] || 'bg-muted text-muted-foreground';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min read`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hr ${remainingMinutes > 0 ? `${remainingMinutes} min` : ''} read`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/resources">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Button>
          </Link>
        </div>

        {/* Resource Header */}
        <Card className="shadow-md ">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <Image
                src={resource.imageUrl.startsWith('/') ? resource.imageUrl : `/${resource.imageUrl}`}
                alt={resource.title}
                width={192}
                height={192}
                className="w-full md:w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(resource.category)}>
                    {resource.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatDuration(resource.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{resource.type}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{resource.description}</p>
                <p className="text-sm text-muted-foreground">
                  Source: {resource.source}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Resource Content */}
        <Card className="shadow-md">
          <CardContent className="p-8">
            {resource.htmlContent ? (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: resource.htmlContent }}
              />
            ) : resource.sections ? (
              <div className="space-y-8">
                {resource.sections.map((section, index) => (
                  <section key={index} className="border-b border-border pb-6 last:border-b-0">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                      {section.title}
                    </h2>
                    <p className="text-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </section>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Content is loading...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/resources">
            <Button variant="outline">
              View More Resources
            </Button>
          </Link>
          <Button onClick={() => window.print()}>
            Print Article
          </Button>
        </div>
      </div>
    </div>
  );
};