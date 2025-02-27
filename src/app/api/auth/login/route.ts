import { NextResponse } from 'next/server';
import { setCookie } from '@/utils/cookieUtils';

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';  
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.json(); // Log the server's raw response for debugging
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: errorText.message }, { status: res.status });
    }

    const data = await res.json();
    console.log(data);
    
    await setCookie('accessToken', data.accessToken, { maxAge: 60 * 60 });
    await setCookie('refreshToken', data.refreshToken, { maxAge: 60 * 60 });
    await setCookie('userRole', data.role, { maxAge: 60 * 60 });

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
      return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
    }
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
