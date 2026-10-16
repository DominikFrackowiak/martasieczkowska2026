import { z } from 'zod'

export const mainSchema = z.object({
  seo: z.object({
    metaTitle: z.string().trim().min(1),
    metaDescription: z.string().trim().min(1),
  }),
})

export type MainContent = z.infer<typeof mainSchema>

export async function fetchMain(cmsURL: string | undefined): Promise<MainContent> {
  if (!cmsURL) throw new Error('Set CMS_URL in apps/front/.env or the build environment to load /.')
  const origin = new URL(cmsURL)
  if (!['https:', 'http:'].includes(origin.protocol)) throw new Error('CMS_URL must be an HTTP(S) URL.')
  const endpoint = new URL(`${origin.pathname.replace(/\/$/, '')}/api/globals/main`, origin)
  endpoint.searchParams.set('depth', '0')
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) })
  if (!response.ok) throw new Error(`Cannot build /: CMS returned HTTP ${response.status}.`)
  const parsed = mainSchema.safeParse(await response.json())
  if (!parsed.success) {
    const fields = parsed.error.issues.map(issue => issue.path.join('.')).join(', ')
    throw new Error(`Cannot build /: complete and save the Main global in Payload. Invalid fields: ${fields}`)
  }
  return parsed.data
}
