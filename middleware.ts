import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); 

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const decodedToken = JSON.parse(atob(token.value.split('.')[1])); 
  const userRole = decodedToken.role;

  if (userRole === 'USER') {
    return NextResponse.redirect(new URL('/', req.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], 
};