'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ResourceViewer } from '@/components/ResourceViewer';
import { Client } from 'podcast-api';

const client = Client({ apiKey: '6fcd8e00c4ec4f279e1264143d4a2fc8' });

interface PodcastEpisode {
  id: string;
  title_original: string;
  description_original: string;
  audio: string;
  image: string;
}

interface ExtendedPodcastEpisode extends PodcastEpisode {
  title: string;
  description: string;
  type: 'audio';
  category: 'anxiety' | 'depression' | 'stress' | 'meditation' | 'relaxation' | 'sleep' | 'therapy' | 'self-help';
  imageUrl: string;
  duration: number;
  favorite: boolean;
  url: string;
  isExternal: boolean;
}

export default function ResourceDetailPage() {
  const { category, type } = useParams<{ category: string; type: string }>();
  const [resource, setResource] = useState<ExtendedPodcastEpisode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      if (!category || !type) return;
      
      setLoading(true);
      try {
        const response = await client.fetchPlaylistById({
          id: '6u1gcFVw39L',
          type: 'episode_list',
          last_timestamp_ms: 0,
          sort: 'recent_added_first',
        });
        const found = response.data.episodes.find((r: PodcastEpisode) => r.title_original.includes(type));
        if (found) {
          setResource({
            id: found.id,
            title: found.title_original,
            description: found.description_original,
            type: 'audio',
            category: 'therapy',
            imageUrl: found.image,
            duration: found.audio_length_sec,
            favorite: false,
            url: found.audio,
            isExternal: true,
            title_original: found.title_original,
            description_original: found.description_original,
            audio: found.audio,
            image: found.image,
          });
        } else {
          setResource(null);
        }
      } catch (error) {
        console.error('Failed to fetch resource:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [category, type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Resource Not Found</h2>
          <Link 
            href="/resources" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return <ResourceViewer resource={resource} />;
}
