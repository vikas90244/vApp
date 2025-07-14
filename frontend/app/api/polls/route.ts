export const dynamic = 'force-dynamic'; // 👈 disables caching

import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config';
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/polls/`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      // If Django returns an error, forward that too
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    console.log(" data here in the polls api  ", data);
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error('Next.js failed to fetch polls from Django:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
