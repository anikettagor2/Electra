import { NextRequest, NextResponse } from 'next/server';

/**
 * Basic in-memory rate limiter for serverless environments.
 * Note: In a production environment with multiple instances, Redis is preferred.
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const LIMIT = 10; // 10 requests per minute
const WINDOW = 60 * 1000; // 1 minute

export function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  if (req.nextUrl.pathname.startsWith('/api')) {
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    
    if (now - rateData.lastReset > WINDOW) {
      rateData.count = 1;
      rateData.lastReset = now;
    } else {
      rateData.count++;
    }
    
    rateLimitMap.set(ip, rateData);
    
    if (rateData.count > LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
