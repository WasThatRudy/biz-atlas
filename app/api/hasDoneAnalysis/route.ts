import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:4000';
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'authorization header is required' }, { status: 401 });
    }
    const response = await fetch(`${BACKEND_BASE_URL}/hasDoneAnalysis`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': authHeader,
      },
    });
    
    if (!response.ok) {
      return NextResponse.json({ 
        success: false,
        error: 'Backend request failed'
      }, { status: response.status });
    }
    
    const hasAnalysis = await response.json();
    
    return NextResponse.json({ 
      success: hasAnalysis?.success || false
    });
    
  } catch (error) {
    console.error('Error checking analysis status:', error);
    return NextResponse.json({ 
      success: false 
    }, { status: 500 });
  }
}
