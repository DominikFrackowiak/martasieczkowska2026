import { z } from 'zod'
import { seoSchema } from './seo'

const httpsURL = z.string().url().refine((value) => new URL(value).protocol === 'https:', 'Expected an HTTPS image URL')
const dimensions = z.number().int().positive()

export const aboutSchema = z.object({
  seo: seoSchema,
  introduction: z.string().trim().min(1),
  experience: z.array(z.object({
    text: z.string().trim().min(1),
    suffix: z.string().nullable().optional(),
  })).min(1),
  paragraphs: z.array(z.object({ text: z.string().trim().min(1) })).min(1),
  portrait: z.object({
    // Payload types allow absent upload metadata; a rendered portrait needs it.
    image: z.object({
      url: httpsURL, width: dimensions, height: dimensions,
      alt: z.string().trim().min(1),
    }),
    caption: z.string().nullish(),
  }),
  contactLabel: z.string().trim().min(1),
  email: z.string().email(),
})

export type AboutContent = z.infer<typeof aboutSchema>

export async function fetchAbout(cmsURL: string | undefined): Promise<AboutContent> {
  if (!cmsURL) throw new Error('Set CMS_URL in apps/front/.env or the Vercel build environment to load /about.')
  const origin = new URL(cmsURL)
  if (!['https:', 'http:'].includes(origin.protocol)) throw new Error('CMS_URL must be an HTTP(S) URL.')
  const endpoint = new URL(`${origin.pathname.replace(/\/$/, '')}/api/globals/about`, origin)
  endpoint.searchParams.set('depth', '1')
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) })
  if (!response.ok) throw new Error(`Cannot build /about: CMS returned HTTP ${response.status}.`)
  const parsed = aboutSchema.safeParse(await response.json())
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new Error(`Cannot build /about: complete and save the About global in Payload. Invalid fields: ${fields}`)
  }
  return parsed.data
}

export function getPortrait(portrait: AboutContent['portrait']) {
  const { image, caption } = portrait
  return { src: image.url, width: image.width, height: image.height, alt: image.alt, caption: caption ?? undefined }
}
