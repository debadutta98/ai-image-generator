import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const maxDuration = 120_000

export function middleware(request: NextRequest) {
  const url = new URL(
    request.nextUrl.toString().replace(request.nextUrl.origin, process.env.BACKEND_URL as string)
  );
  return NextResponse.rewrite(url, {
    request: {
      headers: new Headers(request.headers)
    }
  });
}

export const config = {
  matcher: ['/api/:path*'],
};
