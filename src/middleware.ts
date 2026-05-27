import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // 관리자 페이지 보호
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value
    const secret = process.env.ADMIN_SECRET
    
    if (!secret || token !== secret) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // 로그인된 상태에서 로그인 페이지 접근 시 리다이렉트
  if (path === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value
    const secret = process.env.ADMIN_SECRET
    
    if (secret && token === secret) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
