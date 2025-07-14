export const dynamic = 'force-dynamic'; // 👈 disables caching

import { BACKEND_URL } from '@/config';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  const { pollId } = params;

  try {
    const res = await fetch(`${BACKEND_URL}/polls/${pollId}/`, {
      cache:'no-store',
    });
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error forwarding request to Django:', err);
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
  }
}
