import { NextResponse } from 'next/server';

function parseISO8601Duration(duration: string): number {
  // Very small parser for ISO 8601 durations like PT1H2M30S -> seconds
  const match = duration.match(/P(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? '0', 10) || 0;
  const minutes = parseInt(match[2] ?? '0', 10) || 0;
  const seconds = parseInt(match[3] ?? '0', 10) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || 'mental health').trim();
  const max = Math.min(Number(searchParams.get('max') || '12'), 50);

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY not set in environment' }, { status: 500 });
  }

  try {
    // 1) search for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${max}&q=${encodeURIComponent(
      q,
    )}&key=${YOUTUBE_API_KEY}`;
    const searchResp = await fetch(searchUrl);
    if (!searchResp.ok) {
      const text = await searchResp.text();
      return NextResponse.json({ error: 'YouTube search failed', details: text }, { status: 502 });
    }
    const searchJson = await searchResp.json();
    const items = Array.isArray(searchJson.items) ? searchJson.items : [];
    const ids = items.map((it: unknown) => {
      const obj = it as Record<string, unknown>;
      const idVal = obj.id as unknown;
      if (typeof idVal === 'object' && idVal !== null) {
        const vid = (idVal as Record<string, unknown>)['videoId'];
        return typeof vid === 'string' ? vid : undefined;
      }
      return undefined;
    }).filter(Boolean) as string[];

    // 2) get contentDetails (duration) for videos in a single call
    const durationsMap: Record<string, number> = {};
    if (ids.length > 0) {
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`;
      const videosResp = await fetch(videosUrl);
      if (videosResp.ok) {
        const videosJson = await videosResp.json();
        const videoItems = Array.isArray(videosJson.items) ? videosJson.items : [];
        for (const vi of videoItems) {
          const vid = vi.id;
          const dur = typeof vi.contentDetails?.duration === 'string' ? parseISO8601Duration(vi.contentDetails.duration) : 0;
          durationsMap[vid] = dur;
        }
      }
    }

    const results = items.map((it: unknown) => {
      const obj = it as Record<string, unknown>;
      const idObj = obj.id as Record<string, unknown> | undefined;
      const videoId = idObj ? (idObj.videoId as string | undefined) : undefined;
      const snippet = (obj.snippet as Record<string, unknown> | undefined) ?? {};
  const thumbnails = snippet.thumbnails as Record<string, unknown> | undefined;
  const thumb = thumbnails ? ((thumbnails['high'] ?? thumbnails['medium'] ?? thumbnails['default']) as Record<string, unknown> | undefined) : null;
      return {
        id: videoId ?? null,
        title: (snippet.title as string) ?? 'Untitled',
        description: (snippet.description as string) ?? '',
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
        thumbnail: thumb?.url ?? null,
        durationSec: videoId ? (durationsMap[videoId] ?? 0) : 0,
        publishedAt: (snippet.publishedAt as string) ?? null,
      };
    });

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error', details: String(err) }, { status: 500 });
  }
}
