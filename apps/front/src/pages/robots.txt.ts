import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set site in astro.config.mjs to generate robots.txt.')

  return new Response(`User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', site).href}
`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
