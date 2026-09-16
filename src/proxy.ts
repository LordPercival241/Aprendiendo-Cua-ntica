import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

// Next.js 16 renamed Middleware to Proxy. The behavior is unchanged: this
// proxy only resolves the locale and does not perform authentication.
export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|lectures|books|exams|syllabus|support|.*\\..*).*)',
    '/',
  ],
};
