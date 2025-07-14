export const dynamic = 'force-dynamic'; // 👈 disables caching

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BACKEND_URL } from '@/config';
export async function DELETE(
   request: NextRequest,
  { params }:{params:{pollId:string}}
) {

  const { pollId } = params;
  console.log("poll ID in next backend DELETE-POLL", pollId);
  try {
    const res = await fetch(`${BACKEND_URL}/polls/delete/${pollId}/`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    if (!res.ok) {
      // If Django returns an error, forward that too
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({"message": "Poll deleted sucessfully "}, { status: 200 });

  } catch (err) {
    console.error('Next.js failed to fetch polls from Django:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
