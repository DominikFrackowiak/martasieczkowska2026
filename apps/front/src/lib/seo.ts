import { z } from 'zod'

export const mediaSchema = z.object({
  url: z.url().refine(value => new URL(value).protocol === 'https:', 'Expected an HTTPS image URL'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().trim().min(1),
})

export const seoSchema = z.object({
  metaTitle: z.string().trim().min(1),
  metaDescription: z.string().trim().min(1),
  socialImage: mediaSchema.nullish(),
})

export type SocialImage = z.infer<typeof mediaSchema>

/** Share a JPEG variant of the existing asset without cropping the artwork. */
export function getSocialImage(image: SocialImage) {
  const url = new URL(image.url)
  const prefix = url.pathname.match(/^\/[^/]+\/image\/upload\//)?.[0]
  if (url.hostname !== 'res.cloudinary.com' || !prefix || url.pathname.slice(prefix.length).startsWith('s--')) {
    return image
  }
  // Apply the format after any existing transformations, before the version/asset.
  const parts = url.pathname.slice(prefix.length).split('/')
  const transforms: string[] = []
  while (/^(?:[a-z]|ar|bo|co|dpr|fl|if|pg)_/.test(parts[0] ?? '')) transforms.push(parts.shift()!)
  url.pathname = prefix + [...transforms, 'f_jpg,q_auto', ...parts].join('/')
  return { ...image, url: url.href }
}

export function getCanonicalURL(pathname: string, site: URL) {
  // Only the path identifies the page; filters and tracking parameters are omitted.
  return new URL(pathname, site).href
}
