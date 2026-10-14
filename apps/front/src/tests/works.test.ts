import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchWorks, getWorks, getProject, getThumbnails, workSchema } from '../lib/works'

const image = { url: 'https://res.cloudinary.com/example/image/upload/v1/work.jpg', width: 900, height: 600, alt: 'Project image' }
const work = {
  title: 'Ganna Glass. logo design', slug: 'ganna-glass', category: 'Logo design', thumbnail: image,
  titleLines: [{ text: 'Ganna Glass.' }, { text: 'logo design' }],
  seo: { metaTitle: 'Ganna Glass', metaDescription: 'Logo design for Ganna Glass.' },
  intro: { headingLines: [{ text: 'Ganna Glass.' }, { text: 'logo design' }], descriptionParagraphs: [{ text: 'First paragraph' }, { text: 'Second paragraph' }] },
  galleryRows: [
    { align: 'end', justify: 'between', images: [{ image, variant: '1/2', caption: 'Credit' }, { image, variant: '1/3', caption: null }] },
    { justify: 'center', images: [{ image, variant: '2/3' }] },
    { images: [{ image, variant: 'grow' }, { image, variant: 'grow' }, { image, variant: 'grow' }] },
  ],
}
const page = (docs: unknown[], hasNextPage = false, nextPage: number | null = null, totalDocs = docs.length) => Response.json({ docs, hasNextPage, nextPage, totalDocs })
afterEach(() => vi.unstubAllGlobals())

describe('Works CMS content', () => {
  it('fetches every page with populated Media and deterministic ordering', async () => {
    const mock = vi.fn().mockResolvedValueOnce(page([work], true, 2, 2)).mockResolvedValueOnce(page([{ ...work, slug: 'branding' }], false, null, 2))
    vi.stubGlobal('fetch', mock)
    expect((await fetchWorks('https://cms.example.com/cms/')).map(item => item.slug)).toEqual(['ganna-glass', 'branding'])
    expect(mock.mock.calls.map(([url]) => (url as URL).href)).toEqual([
      'https://cms.example.com/cms/api/works?depth=1&limit=100&sort=createdAt&page=1',
      'https://cms.example.com/cms/api/works?depth=1&limit=100&sort=createdAt&page=2',
    ])
  })

  it('allows an empty Works collection so the listing can render its empty state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(page([])))
    expect(await fetchWorks('https://cms.example.com')).toEqual([])
    expect(getThumbnails([])).toEqual([])
  })

  it('preserves ordered lines, paragraphs, asymmetric rows, captions and intrinsic dimensions', () => {
    const parsed = workSchema.parse(work)
    const project = getProject(parsed)
    expect(project.slug).toBe('ganna-glass')
    expect(project.seo).toEqual(work.seo)
    expect(project.intro).toEqual({ headingLines: ['Ganna Glass.', 'logo design'], descriptionParagraphs: ['First paragraph', 'Second paragraph'] })
    expect(project.galleryRows.map(row => [row.align, row.justify, row.imageItems.map(item => item.variant)])).toEqual([
      ['end', 'between', ['1/2', '1/3']], ['start', 'center', ['2/3']], ['start', 'start', ['grow', 'grow', 'grow']],
    ])
    expect(project.galleryRows[0].imageItems[0]).toEqual({ src: image.url, intrinsicWidth: 900, intrinsicHeight: 600, alt: image.alt, caption: 'Credit', variant: '1/2' })
    expect(project.galleryRows[0].imageItems[1].caption).toBeUndefined()
    expect(getThumbnails([parsed])[0]).toEqual({ slug: 'ganna-glass', image: { src: image.url, intrinsicWidth: 900, intrinsicHeight: 600, alt: image.alt }, titleLines: ['Ganna Glass.', 'logo design'] })
  })

  it('rejects invalid slugs, categories, empty content and unresolved Media', () => {
    for (const changes of [
      { slug: '../project' }, { category: 'Unknown' }, { galleryRows: [] }, { titleLines: [] },
      { thumbnail: 'media-id' }, { thumbnail: null }, { thumbnail: { ...image, width: null } },
      { thumbnail: { ...image, url: 'http://example.com/image.jpg' } }, { thumbnail: { ...image, alt: ' ' } },
      { galleryRows: [{ images: [{ image: 'media-id' }] }] },
      { galleryRows: [{ images: [{ image, variant: 'arbitrary-css' }] }] },
    ]) expect(workSchema.safeParse({ ...work, ...changes }).success).toBe(false)
  })

  it('supports the remaining mock compositions and pairs that share the entire row', () => {
    const layouts = [
      { justify: 'start', variants: ['1/2'] }, { justify: 'end', variants: ['1/2'] },
      { justify: 'between', align: 'end', variants: ['1/4', '1/4', '1/4'] },
      { justify: 'between', variants: ['2/5', '2/5'] },
      { variants: ['1/2', '1/2'] }, { variants: ['2/3', '1/3'] },
    ]
    const parsed = workSchema.parse({ ...work, galleryRows: layouts.map(({ variants, ...row }) => ({
      ...row, images: variants.map(variant => ({ image, variant })),
    })) })
    expect(getProject(parsed).galleryRows.map(row => row.imageItems.map(item => item.variant))).toEqual(layouts.map(row => row.variants))
  })

  it('reuses requests for paths and listings and retries after a failed request', async () => {
    const mock = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValue(page([work]))
    vi.stubGlobal('fetch', mock)
    await expect(getWorks('https://cache-test.example.com')).rejects.toThrow('cannot reach CMS')
    const [paths, listing] = await Promise.all([getWorks('https://cache-test.example.com'), getWorks('https://cache-test.example.com')])
    expect(paths).toBe(listing)
    expect(mock).toHaveBeenCalledTimes(2)
  })

  it('reports the project and invalid field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(page([{ ...work, thumbnail: 'media-id' }])))
    await expect(fetchWorks('https://cms.example.com')).rejects.toThrow(/ganna-glass.*thumbnail/)
  })

  it('fails clearly on missing configuration, HTTP failures and unreachable CMS', async () => {
    await expect(fetchWorks(undefined)).rejects.toThrow('CMS_URL')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))
    await expect(fetchWorks('https://cms.example.com')).rejects.toThrow('HTTP 503')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Connection refused')))
    await expect(fetchWorks('https://cms.example.com')).rejects.toThrow('cannot reach CMS')
  })

  it('rejects duplicate slugs and broken pagination', async () => {
    for (const response of [page([work, work]), page([work], true, 1, 2), page([work], false, null, 2), Response.json({ docs: [work] })]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
      await expect(fetchWorks('https://cms.example.com')).rejects.toThrow('Cannot build portfolio projects')
    }
  })
})
