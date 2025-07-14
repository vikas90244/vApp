export const dynamic = 'force-dynamic'; // 👈 disables caching

import { BACKEND_URL } from '@/config';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { wallet_key: string } }
) {
  const { wallet_key } = params;

  try {
    const res = await fetch(`${BACKEND_URL}/polls/by-wallet/${wallet_key}/`,{
      cache: 'no-store',
    });
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error forwarding request to Django:', err);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}
