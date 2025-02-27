import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE_URL}/albums`
// const BASE_URL = 'http://54.72.59.0/albums';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const albumId = url.pathname.split('/').pop();

    const res = await fetchWithAuth(`${BASE_URL}/${albumId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }, req,
  );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: `Failed to fetch album with ID ${albumId}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: `Failed to fetch album` }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const albumId = url.pathname.split('/').pop();

    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    const res = await fetchWithAuth(
      `${BASE_URL}/${albumId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      req
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: `Failed to update album with ID ${albumId}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: `Failed to update album` }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const albumId = url.pathname.split('/').pop();

    const res = await fetchWithAuth(`${BASE_URL}/${albumId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }, req);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: `Failed to delete album with ID ${albumId}` }, { status: res.status });
    }

    return NextResponse.json(({ message: `Album with ID ${albumId} deleted successfully` }));
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: `Failed to delete album` }, { status: 500 });
  }
}
