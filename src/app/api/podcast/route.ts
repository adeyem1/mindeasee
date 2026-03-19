import { NextResponse } from 'next/server';
import { Client } from 'podcast-api';
import axios from 'axios';

const client = Client({
  apiKey: process.env.LISTEN_NOTES_API_KEY!,
});

const NEWS_API_KEY = process.env.NEWS_API_KEY;

interface PodcastEpisode {
  id: string;
  title_original: string;
  audio: string;
  image: string;
}

interface NewsArticle {
  title: string;
  url: string;
  urlToImage: string;
}

export async function GET() {
  try {
    const [podcastResponse, newsResponse] = await Promise.all([
      client.search({
        q: 'mental health OR therapy OR mindfulness OR stress relief OR self-improvement',
        type: 'episode',
        language: 'English',
        safe_mode: 1,
        sort_by_date: 0,
        page_size: 15,
      }).then(response => {
        console.log('Podcast API response:', response);
        return response;
      }).catch(error => {
        console.error('Podcast API error:', error);
        throw error;
      }),
      axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: 'mental health',
          language: 'en',
          apiKey: NEWS_API_KEY,
        },
      }),
    ]);

    const episodes: PodcastEpisode[] = (podcastResponse.data as { results: PodcastEpisode[] }).results.map((episode: PodcastEpisode) => ({
      id: episode.id,
      title_original: episode.title_original,
      audio: episode.audio,
      image: episode.image,
    }));

    const articles: NewsArticle[] = (newsResponse.data as { articles: NewsArticle[] }).articles.map((article: NewsArticle) => ({
      title: article.title,
      url: article.url,
      urlToImage: article.urlToImage,
    }));

    return NextResponse.json({ podcasts: episodes, news: articles });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
