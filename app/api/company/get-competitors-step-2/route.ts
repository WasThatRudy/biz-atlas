import { NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get the Authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // Forward the request to the backend with JWT token
    const backendResponse = await fetch(`${BACKEND_BASE_URL}/company/get-competitors-step-2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader, // JWT token from frontend
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('API route get-competitors-step-2 error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while updating competitors' },
      { status: 500 }
    );
  }
}
