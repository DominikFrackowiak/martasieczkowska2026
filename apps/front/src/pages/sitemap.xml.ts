import type { APIRoute } from 'astro'
import { getCanonicalURL } from '../lib/seo'
import { getWorks } from '../lib/works'

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Set site in astro.config.mjs to generate the sitemap.')

  const works = await getWorks(import.meta.env.CMS_URL)
  // /works redirects to /, so only include canonical pages.
  const paths = ['/', '/about', ...works.map(work => `/works/${work.slug}`)]
  const urls = paths.map(path => {
    const location = getCanonicalURL(path, site).replace(/[<>&"']/g, character => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
    })[character]!)
    return `  <url><loc>${location}</loc></url>`
  })

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
