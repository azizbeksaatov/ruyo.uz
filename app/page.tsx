// This file is intentionally minimal — the proxy.ts middleware handles locale
// detection for the root path and rewrites it to app/[locale]/page.tsx.
// A redirect here would create a redirect loop: / → /ru → / (middleware).
export { default } from '@/app/[locale]/page';
