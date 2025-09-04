import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'authorization header is required' }, { status: 401 });
    }
    const backendResponse = await fetch(`${BACKEND_BASE_URL}/launchpad/complete-analysis`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': authHeader,
      },
    });
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('API route launchpad-complete-analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
