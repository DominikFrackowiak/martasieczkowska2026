import { z } from 'zod'
import type { Work } from '../../../cms/src/payload-types'
import type { ContentImageProps } from '../components/atoms/content-image/content-image.astro'
import type { GalleryRowProps } from '../components/molecules/gallery-row/gallery-row.astro'

const text = z.string().trim().min(1)
const lines = z.array(z.object({ text })).min(1)
const mediaSchema = z.object({
  url: z.url().refine(value => new URL(value).protocol === 'https:', 'Expected an HTTPS image URL'),
  width: z.number().int().positive(), height: z.number().int().positive(), alt: text,
})

// Validate only the fields used by the front; Payload's generated types also
// include IDs, timestamps and nullable/unpopulated upload metadata.
export const workSchema = z.object({
  title: text,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(['graphic-design', 'illustration'] satisfies Work['category'][]),
  thumbnail: z.object({ image: mediaSchema, titleLines: lines }),
  seo: z.object({ metaTitle: text, metaDescription: text }),
  description: z.object({ titleLines: lines, paragraphs: lines }),
  galleryRows: z.array(z.object({
    align: z.enum(['start', 'center', 'end', 'stretch']).nullish(),
    justify: z.enum(['start', 'center', 'end', 'between', 'around']).nullish(),
    images: z.array(z.object({
      image: mediaSchema,
      variant: z.enum(['full', 'grow', '1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5']).nullish(),
      caption: z.string().nullish(),
    })).min(1),
  })).min(1),
})

export type WorkContent = z.infer<typeof workSchema>

const pageSchema = z.object({
  docs: z.array(z.unknown()),
  totalDocs: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  nextPage: z.number().int().positive().nullable(),
})

export async function fetchWorks(cmsURL: string | undefined): Promise<WorkContent[]> {
  if (!cmsURL) throw new Error('Set CMS_URL in apps/front/.env or the build environment to load portfolio projects.')
  const origin = new URL(cmsURL)
  if (!['https:', 'http:'].includes(origin.protocol)) throw new Error('CMS_URL must be an HTTP(S) URL.')
  const works: WorkContent[] = []
  const slugs = new Set<string>()
  let page = 1
  while (true) {
    const endpoint = new URL(`${origin.pathname.replace(/\/$/, '')}/api/works`, origin)
    endpoint.searchParams.set('depth', '1')
    endpoint.searchParams.set('limit', '100')
    endpoint.searchParams.set('sort', '_order')
    endpoint.searchParams.set('page', String(page))
    let response: Response
    try {
      response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) })
    } catch (error) {
      throw new Error(`Cannot build portfolio projects: cannot reach CMS (page ${page}).`, { cause: error })
    }
    if (!response.ok) throw new Error(`Cannot build portfolio projects: CMS returned HTTP ${response.status} (page ${page}).`)
    let body: unknown
    try {
      body = await response.json()
    } catch (error) {
      throw new Error(`Cannot build portfolio projects: CMS returned invalid JSON (page ${page}).`, { cause: error })
    }
    const result = pageSchema.safeParse(body)
    if (!result.success) throw new Error(`Cannot build portfolio projects: invalid Works pagination response (page ${page}).`)
    for (const [index, doc] of result.data.docs.entries()) {
      const parsed = workSchema.safeParse(doc)
      if (!parsed.success) {
        const fields = parsed.error.issues.map(issue => issue.path.join('.')).join(', ')
        const slug = typeof doc === 'object' && doc !== null && 'slug' in doc ? String(doc.slug) : `page ${page}, item ${index + 1}`
        throw new Error(`Cannot build project "${slug}": complete and save it in Payload and select populated Media with URL, dimensions and alt text. Invalid fields: ${fields}`)
      }
      if (slugs.has(parsed.data.slug)) throw new Error(`Cannot build portfolio projects: duplicate slug "${parsed.data.slug}".`)
      slugs.add(parsed.data.slug)
      works.push(parsed.data)
    }
    if (!result.data.hasNextPage) {
      if (works.length !== result.data.totalDocs) throw new Error('Cannot build portfolio projects: incomplete Works pagination. Rebuild after saving CMS changes.')
      break
    }
    if (!result.data.docs.length || result.data.nextPage !== page + 1) throw new Error('Cannot build portfolio projects: invalid next Works page.')
    page = result.data.nextPage
  }
  return works
}

// Reuse the same request sequence for static paths and the listing in Layout.
let cachedWorks: { url: string | undefined; promise: Promise<WorkContent[]> } | undefined
export function getWorks(cmsURL: string | undefined) {
  if (!cachedWorks || cachedWorks.url !== cmsURL) {
    const promise = fetchWorks(cmsURL).catch(error => { cachedWorks = undefined; throw error })
    cachedWorks = { url: cmsURL, promise }
  }
  return cachedWorks.promise
}

function getImage(image: z.infer<typeof mediaSchema>): ContentImageProps {
  return { src: image.url, intrinsicWidth: image.width, intrinsicHeight: image.height, alt: image.alt }
}

export function getProject(work: WorkContent) {
  return {
    slug: work.slug, seo: work.seo,
    intro: {
      headingLines: work.description.titleLines.map(line => line.text),
      descriptionParagraphs: work.description.paragraphs.map(paragraph => paragraph.text),
    },
    galleryRows: work.galleryRows.map(row => ({
      align: row.align ?? 'start', justify: row.justify ?? 'start',
      imageItems: row.images.map(({ image, variant, caption }) => ({
        ...getImage(image), variant: variant ?? 'full', caption: caption?.trim() || undefined,
      })),
    } satisfies GalleryRowProps)),
  }
}

export type Project = ReturnType<typeof getProject>

export function getThumbnails(works: WorkContent[]) {
  return works.map(work => ({
    slug: work.slug, image: getImage(work.thumbnail.image), titleLines: work.thumbnail.titleLines.map(line => line.text),
  }))
}
