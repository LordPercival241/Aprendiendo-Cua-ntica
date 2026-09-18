import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityPolicy = "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; media-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests";
const embeddedDocumentPolicy = securityPolicy.replace("frame-ancestors 'none'", "frame-ancestors 'self'");
const academicDocumentHeaders = [
  { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
  // PDFs may be framed only by this same site, never by an external origin.
  { key: 'Content-Security-Policy', value: embeddedDocumentPolicy },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Disposition', value: 'inline' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Historical portraits carry fine grain and handwritten details. Keep a
    // high-quality source option available for the museum without disabling
    // responsive image optimization.
    qualities: [75, 90, 100],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: securityPolicy,
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
        ],
      },
      {
        source: '/lectures/:path*',
        headers: academicDocumentHeaders,
      },
      {
        source: '/books/:path*',
        headers: academicDocumentHeaders,
      },
      {
        source: '/syllabus/:path*',
        headers: academicDocumentHeaders,
      },
      {
        source: '/support/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
