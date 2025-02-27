import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE_URL}/albums`
// const BASE_URL = 'http://54.72.59.0/albums';

export async function POST(req: Request) {
  try {
    const { albumId, count } = await req.json();
    console.log(albumId, count)
    // Perform any server-side logic, like validating the albumId or count

    const response = await fetchWithAuth(`${BASE_URL}/presigned-urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You can add authorization headers if needed
      },
      body: JSON.stringify({ albumId, count }),
    }, 
    req,
  );

    if (!response.ok) {
      throw new Error('Failed to fetch presigned URLs');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in presigned-urls API:', error);
    return NextResponse.error();
  }
}
