import { BACKEND_URL } from '@/config';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { candidateId: string } }
) {
  try {
    const { candidateId } = params;

    if (!candidateId) {
      return NextResponse.json(
        { error: 'Candidate ID is required' },
        { status: 400 }
      );
    }

    // Make request to your Django backend
    const response = await fetch(
      `${BACKEND_URL}/candidates/${candidateId}/vote/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to record vote' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
