import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`
    // - … the files inside `/public` like `/lectures`, `/books`, `/exams`, `/syllabus`, `/favicon.ico`
    // - … all files with an extension (e.g. .pdf, .png, .ico, etc.)
    '/((?!api|_next|_vercel|lectures|books|exams|syllabus|.*\\..*).*)',
    // Always run for root
    '/'
  ]
};
