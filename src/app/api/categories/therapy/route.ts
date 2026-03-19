import { NextResponse } from 'next/server';
import { Client } from 'podcast-api';

const client = Client({
  apiKey: process.env.LISTEN_NOTES_API_KEY!,
});

export async function GET() {
  try {
    const response = await client.search({
      q: 'therapy',
      type: 'episode',
      language: 'English',
      safe_mode: 1,
      sort_by_date: 0,
      page_size: 15,
    });

    const episodes = (response.data.results as Array<{
      id: string;
      title_original: string;
      description_original: string;
      audio: string;
      image: string;
    }>).map((episode) => ({
      id: episode.id,
      title: episode.title_original,
      description: episode.description_original,
      audio: episode.audio,
      image: episode.image,
    }));

    return NextResponse.json(episodes);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}