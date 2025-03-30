import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('gym-sync-jwt-token')?.value || request.headers.get('Authorization');

    // Check for token on all paths except login
    if (!token && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
