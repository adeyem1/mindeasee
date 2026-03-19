import { NextResponse } from 'next/server';
import { Client } from 'podcast-api';

const client = Client({
  apiKey: process.env.LISTEN_NOTES_API_KEY!,
});

interface PodcastEpisode {
  id: string;
  audio: string;
  image: string;
}

interface PodcastSearchResult {
  results: PodcastEpisode[];
}

export async function GET() {
  try {
    const response = await client.search({
      q: 'mental health OR therapy OR mindfulness OR stress relief OR self-improvement',
      type: 'episode',
      language: 'English',
      safe_mode: 1,
      sort_by_date: 0,
      page_size: 15,
    });

    const episodes: PodcastEpisode[] = (response.data as PodcastSearchResult).results.map((episode) => ({
      id: episode.id,
      audio: episode.audio,
      image: episode.image,
    }));

    return NextResponse.json(episodes);
  } catch (error) {
    console.error('Podcast API error:', error);
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 });
  }
}
