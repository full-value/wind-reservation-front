import { log } from "console";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const siret = searchParams.get('siret');
  if (!siret || siret.length !== 14 || isNaN(Number(siret))) {
    return new Response(JSON.stringify({ error: 'Invalid SIRET number' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const response = await fetch(`https://api.insee.fr/sirene/siret/${siret}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SIRET_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return new Response(JSON.stringify({ error: process.env.SIRET_API_KEY }));
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to verify SIRET' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
