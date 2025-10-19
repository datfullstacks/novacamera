import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BACKEND_URL || 'https://api.mmoshop.site';

// This proxy route bypasses CORS by making requests from the server
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PATCH');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Build the target URL
    const path = pathSegments.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';
    const url = `${API_BASE_URL}/${path}${queryString}`;

    // Get request body for POST/PUT/PATCH
    let body = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        body = JSON.stringify(await request.json());
      } else if (contentType.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // Forward headers (exclude some that shouldn't be forwarded)
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (
        !key.toLowerCase().startsWith('host') &&
        !key.toLowerCase().startsWith('connection') &&
        !key.toLowerCase().startsWith('content-length')
      ) {
        headers.set(key, value);
      }
    });

    // Add default headers
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    // Make the proxied request
    const response = await fetch(url, {
      method,
      headers,
      body,
      // Don't follow redirects automatically
      redirect: 'manual',
    });

    // Get response body
    const contentType = response.headers.get('content-type') || '';
    let responseData;
    
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Forward the response
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Proxy request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
