'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { FiBookmark, FiBookOpen, FiVideo, FiHeadphones, FiActivity, FiSearch } from 'react-icons/fi';
import { Client } from 'podcast-api';

const client = Client({
  apiKey: process.env.LISTEN_NOTES_API_KEY!,
});

interface PodcastEpisode {
  id: string;
  title_original: string;
  description_original: string;
  audio: string;
  image: string;
  audio_length_sec: number;
}

interface ExtendedPodcastEpisode extends PodcastEpisode {
  title: string;
  description: string;
  duration: number;
  category: string;
  type: string;
  favorite: boolean;
  imageUrl: string;
  url: string;
}

export default function ResourcesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [resources, setResources] = useState<ExtendedPodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch resources on mount (podcasts + YouTube videos)
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await client.search({
          q: selectedCategory === 'All' ? '' : selectedCategory,
          type: 'episode',
          language: 'English',
          safe_mode: 1,
          sort_by_date: 0,
          page_size: 15,
        });
        const mappedResources = response.data.results.map((episode: PodcastEpisode) => ({
          ...episode,
          title: episode.title_original,
          description: '',
          duration: Math.ceil(episode.audio_length_sec / 60),
          category: selectedCategory,
          type: 'audio',
          favorite: false,
          imageUrl: episode.image,
          url: episode.audio,
        }));

        // Fetch YouTube videos from our server-side API route
        let videoResources: ExtendedPodcastEpisode[] = [];
        try {
          const q = selectedCategory === 'All' ? 'mental health' : selectedCategory;
          const vidRes = await fetch(`/api/youtube?q=${encodeURIComponent(q)}&max=12`);
          if (vidRes.ok) {
            const vids = await vidRes.json();
            videoResources = vids.map((v: unknown, idx: number) => {
              const obj = v as Record<string, unknown>;
              const id = (typeof obj.id === 'string' ? obj.id : `yt-${idx}-${Date.now()}`) as string;
              const title = typeof obj.title === 'string' ? obj.title : 'Untitled';
              const description = typeof obj.description === 'string' ? obj.description : '';
              const duration = Math.ceil(((typeof obj.durationSec === 'number' ? obj.durationSec : 0) as number) / 60);
              const thumbnail = typeof obj.thumbnail === 'string' ? obj.thumbnail : '/images/resources/placeholder.jpg';
              const url = typeof obj.url === 'string' ? obj.url : '#';

              return {
                id,
                title,
                description,
                duration,
                category: selectedCategory,
                type: 'video',
                favorite: false,
                imageUrl: thumbnail,
                url,
                // keep original podcast fields empty to satisfy type
                title_original: title,
                description_original: description,
                audio: '',
                image: thumbnail,
                audio_length_sec: 0,
              } as ExtendedPodcastEpisode;
            });
          } else {
            console.warn('YouTube API returned non-ok status when fetching videos');
          }
        } catch (err) {
          console.error('Failed to fetch YouTube videos:', err);
        }

        setResources([...mappedResources, ...videoResources]);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [selectedCategory]);

  // Filtering logic
  const filteredResources = resources.filter(resource => {
    if (searchTerm &&
      !resource.title_original.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !resource.description_original.toLowerCase().includes(searchTerm.toLowerCase())
    ) return false;
    if (selectedCategory !== 'All' &&
      resource.category.toLowerCase() !== selectedCategory.toLowerCase()
    ) return false;
    if (selectedType !== 'all' && resource.type !== selectedType) return false;
    if (showFavorites && !resource.favorite) return false;
    return true;
  });

  // Toggle favorites
  const toggleFavorite = (id: string) => {
    setResources(resources.map(resource =>
      resource.id === id ? { ...resource, favorite: !resource.favorite } : resource
    ));
  };

  // Icons by type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FiBookOpen className="text-blue-500" />;
      case 'video': return <FiVideo className="text-red-500" />;
      case 'audio': return <FiHeadphones className="text-purple-500" />;
      case 'exercise': return <FiActivity className="text-green-500" />;
      default: return <FiBookOpen className="text-gray-500" />;
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes > 0 ? `${remainingMinutes} min` : ''}`;
  };

  // Categories list
  const categories = [
    'All',
    'Anxiety',
    'Depression',
    'Stress',
    'Meditation',
    'Relaxation',
    'Sleep',
    'Therapy',
    'Self-Help'
  ];

  return (
    <UnifiedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          {/* <BackButton href="/" /> */}
        </div>
        <h1 className="text-3xl font-bold mb-2">Wellness Resources</h1>
        <p className="text-muted-foreground mb-6">
          Explore articles, videos, audio guides, and exercises to support your mental health journey.
        </p>

        {/* Search and filter bar */}
        <div className="bg-card rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Favorites filter */}
            <div className="flex-shrink-0 flex items-center">
              <input
                type="checkbox"
                id="favorites"
                checked={showFavorites}
                onChange={() => setShowFavorites(!showFavorites)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="favorites" className="ml-2 text-sm text-foreground">
                Favorites only
              </label>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-4">
            <div className="mb-4 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Types */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`flex items-center px-3 py-1 text-sm rounded-md ${
                  selectedType === 'all'
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-card border border-border text-foreground hover:bg-accent'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType('article')}
                className={`flex items-center px-3 py-1 text-sm rounded-md ${
                  selectedType === 'article'
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-card border border-border text-foreground hover:bg-accent'
                }`}
              >
                <FiBookOpen className="mr-1" /> Articles
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`flex items-center px-3 py-1 text-sm rounded-md ${
                  selectedType === 'video'
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-card border border-border text-foreground hover:bg-accent'
                }`}
              >
                <FiVideo className="mr-1" /> Videos
              </button>
              <button
                onClick={() => setSelectedType('audio')}
                className={`flex items-center px-3 py-1 text-sm rounded-md ${
                  selectedType === 'audio'
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-card border border-border text-foreground hover:bg-accent'
                }`}
              >
                <FiHeadphones className="mr-1" /> Audio
              </button>
              <button
                onClick={() => setSelectedType('exercise')}
                className={`flex items-center px-3 py-1 text-sm rounded-md ${
                  selectedType === 'exercise'
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-card border border-border text-foreground hover:bg-accent'
                }`}
              >
                <FiActivity className="mr-1" /> Exercises
              </button>
            </div>
          </div>
        </div>

        {/* Resources grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-card p-6 rounded-lg shadow-md text-center">
            <p className="text-muted-foreground">No resources found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedType('all');
                setShowFavorites(false);
              }}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col border border-border">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={resource.imageUrl}
                    alt={`Image representing ${resource.title}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(resource.id)}
                    className="absolute top-2 right-2 p-2 bg-card rounded-full shadow-md hover:bg-accent"
                  >
                    <FiBookmark
                      className={resource.favorite ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}
                    />
                  </button>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-card/90 rounded-md flex items-center">
                    {getTypeIcon(resource.type)}
                    <span className="ml-1 text-xs capitalize">{resource.type}</span>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg font-semibold mb-2 text-foreground">{resource.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">{resource.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-muted-foreground">{formatDuration(resource.duration)}</span>
                    <button
                      onClick={() => router.push(resource.url)}
                      className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
                    >
                      View Resource
                    </button>
                  </div>
                </div>
                <div className="px-4 py-2 bg-muted/30 border-t border-border">
                  <span className="text-xs text-muted-foreground capitalize">
                    Category: {resource.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UnifiedLayout>
  );
}
