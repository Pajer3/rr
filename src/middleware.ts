import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Beschermt het hele factuursysteem: zonder geldige inlog-cookie kom je
// nergens binnen /admin/facturen of /api/factuur (behalve de login zelf).
const COOKIE_NAME = 'frisspits_factuur';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Inloggen / uitloggen mag altijd door.
  if (
    pathname === '/admin/facturen/login' ||
    pathname.startsWith('/api/factuur/login') ||
    pathname.startsWith('/api/factuur/logout')
  ) {
    return NextResponse.next();
  }

  const token = process.env.FACTUUR_SESSIE_TOKEN || '';
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const ingelogd = !!token && cookie === token;

  if (ingelogd) return NextResponse.next();

  // API: nette 401. Pagina's: stuur door naar de loginpagina.
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = '/admin/facturen/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/facturen/:path*', '/api/factuur/:path*'],
};
