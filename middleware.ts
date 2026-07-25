import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isToolsHost, normalizeHost } from '@/lib/hosts'

export function middleware(request: NextRequest) {
  const hostname = normalizeHost(request.headers.get('host') || '')
  
  if (isToolsHost(hostname)) {
    const path = request.nextUrl.pathname
    const destination = path === '/' 
      ? 'http://localhost:3000/tools' 
      : `http://localhost:3000/tools${path}`
    
    return NextResponse.redirect(destination)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
