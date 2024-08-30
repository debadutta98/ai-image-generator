import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = new URL(
    request.nextUrl.toString().replace(request.nextUrl.origin, process.env.BACKEND_URL as string)
  );
  const options: RequestInit = {
    method: request.method,
    headers: request.headers
  };
  if (['PUT', 'DELETE', 'POST', 'PATCH'].includes(request.method.toUpperCase())) {
    options.body = JSON.stringify(await request.json());
  }
  try {
    return await fetch(url, options);
  } catch (err) {
    console.error('Error send proxy response', err);
    return NextResponse.json({ message: 'Internal Server Error' });
  }
}

export const config = {
  matcher: ['/api/:path*']
};
