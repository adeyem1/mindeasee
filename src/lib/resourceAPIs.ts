import axios from 'axios';

// Server-side helpers for fetching mental health resources
// This implementation uses the RapidAPI "mental-health-info-api" endpoint.
// Configure the following environment variables in your deployment or local `.env`:
// RAPIDAPI_KEY (your RapidAPI key)
// RAPIDAPI_HOST (usually "mental-health-info-api.p.rapidapi.com")

export interface ArticleSummary {
  title: string;
  description: string;
  url: string;
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'mental-health-info-api.p.rapidapi.com';

export async function fetchArticles(): Promise<ArticleSummary[]> {
  if (!RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not set; fetchArticles will return an empty list. Set RAPIDAPI_KEY in your environment to enable article fetching.');
    return [];
  }

  try {
    const res = await axios.get('https://mental-health-info-api.p.rapidapi.com/news/thetimes', {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      // RapidAPI returns JSON; ensure we get the data object
      timeout: 10_000,
    });

    // Response shape can vary; defensively extract articles
    const items: unknown[] = Array.isArray(res.data)
      ? (res.data as unknown[])
      : (Array.isArray(res.data?.articles) ? (res.data.articles as unknown[]) : []);

    return items.slice(0, 30).map((it: unknown) => {
      const obj = it as Record<string, unknown>;
      const title = typeof obj.title === 'string'
        ? obj.title
        : (typeof obj.headline === 'string' ? obj.headline : 'Untitled');
      const description = typeof obj.description === 'string'
        ? obj.description
        : (typeof obj.summary === 'string' ? obj.summary : '');
      const url = typeof obj.url === 'string'
        ? obj.url
        : (typeof obj.link === 'string' ? obj.link : '#');
      return { title, description, url };
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('fetchArticles error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('fetchArticles unexpected error:', error);
    }
    return [];
  }
}
