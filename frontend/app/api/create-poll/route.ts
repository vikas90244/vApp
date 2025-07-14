export const dynamic = 'force-dynamic'; // 👈 disables caching

import { BACKEND_URL } from '@/config';
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const response = await fetch(`${BACKEND_URL}/create-poll/`, {
      method: "POST",
      cache: 'no-store',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        poll_id: data.pollId,
        poll_title: data.pollTitle,
        description: data.description,
        poll_start: data.pollStart,
        poll_end: data.pollEnd,
        candidates: data.candidates,
        creator_wallet_key: data.walletAddress,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Django error:", errorText);
      return new Response(
        JSON.stringify({ error: "Django returned error", detail: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const responseData = await response.json();

    return new Response(JSON.stringify(responseData), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
