import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'mental-health-info-api.p.rapidapi.com';

  if (!RAPIDAPI_KEY) {
    return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 });
  }

  try {
    const res = await axios.get('https://mental-health-info-api.p.rapidapi.com/news/thetimes', {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      timeout: 10_000,
    });

    const items: unknown[] = Array.isArray(res.data)
      ? (res.data as unknown[])
      : (Array.isArray(res.data?.articles) ? (res.data.articles as unknown[]) : []);

    const articles = items.slice(0, 30).map((it: unknown) => {
      const obj = it as Record<string, unknown>;
      const title = typeof obj.title === 'string' ? obj.title : (typeof obj.headline === 'string' ? obj.headline : 'Untitled');
      const description = typeof obj.description === 'string' ? obj.description : (typeof obj.summary === 'string' ? obj.summary : '');
      const url = typeof obj.url === 'string' ? obj.url : (typeof obj.link === 'string' ? obj.link : '#');
      return { title, description, url };
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('RapidAPI /news/thetimes error:', error);
    return NextResponse.json({ error: 'failed to fetch articles' }, { status: 502 });
  }
}
