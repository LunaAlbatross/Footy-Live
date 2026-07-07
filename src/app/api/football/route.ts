import { NextResponse, type NextRequest } from 'next/server';
import { API_BASE_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  if (!endpoint) {
    return new Response('Missing ?endpoint query param', { status: 400 });
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  console.debug('API token present:', !!apiKey);
  if (!apiKey) {
    return new Response('API key not configured', { status: 500 });
  }

  try {
    const upstream = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'X-Auth-Token': apiKey },
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    console.warn('External API fetch failed, returning empty payload', e);
    // Return an empty matches array so the client falls back to mock data.
    return NextResponse.json({ matches: [] }, { status: 200 });
  }
}
