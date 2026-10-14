import { afterEach, describe, expect, it, vi } from 'vitest'
import { aboutSchema, fetchAbout, getPortrait } from '../lib/about'

const content = {
  seo: { metaTitle: 'About', metaDescription: 'About Marta, a designer and illustrator.' },
  introduction: 'About Marta',
  experience: [{ text: 'Design', suffix: 'through' }, { text: 'Branding' }],
  paragraphs: [{ text: 'First paragraph' }, { text: 'Second paragraph' }],
  portrait: {
    image: {
      url: 'https://res.cloudinary.com/example/image/upload/v1/portrait.jpg',
      width: 324, height: 420, alt: 'Portrait',
    },
    caption: 'Photo credit',
  },
  contactLabel: 'contact me:',
  email: 'marta@example.com',
}

afterEach(() => vi.unstubAllGlobals())

describe('About CMS content', () => {
  it('fetches and validates the About global with populated Media', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(content))
    vi.stubGlobal('fetch', fetchMock)
    expect(await fetchAbout('https://cms.example.com/')).toEqual(content)
    const endpoint = fetchMock.mock.calls[0][0] as URL
    expect(endpoint.href).toBe('https://cms.example.com/api/globals/about?depth=1')
  })

  it('normalizes a populated upload using its actual dimensions', () => {
    const parsed = aboutSchema.parse({
      ...content,
      portrait: {
        image: { id: 'image-id', url: content.portrait.image.url, width: 800, height: 1000, alt: 'New portrait' },
        caption: null,
      },
    })
    expect(getPortrait(parsed.portrait)).toEqual({
      src: content.portrait.image.url, width: 800, height: 1000, alt: 'New portrait', caption: undefined,
    })
  })

  it('rejects missing configuration and HTTP errors', async () => {
    await expect(fetchAbout(undefined)).rejects.toThrow('CMS_URL')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))
    await expect(fetchAbout('https://cms.example.com')).rejects.toThrow('HTTP 503')
  })

  it('rejects incomplete content instead of silently building an empty page', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...content, introduction: '', paragraphs: [] })))
    await expect(fetchAbout('https://cms.example.com')).rejects.toThrow('introduction, paragraphs')
  })

  it('rejects unpopulated Media, non-HTTPS images and invalid dimensions', () => {
    expect(aboutSchema.safeParse({ ...content, seo: { metaTitle: ' ', metaDescription: '' } }).success).toBe(false)
    expect(aboutSchema.safeParse({ ...content, portrait: { image: 'image-id' } }).success).toBe(false)
    for (const image of [
      { ...content.portrait.image, url: 'javascript:alert(1)' },
      { ...content.portrait.image, url: null },
      { ...content.portrait.image, width: 0 },
      { ...content.portrait.image, width: null },
      { ...content.portrait.image, height: undefined },
      { ...content.portrait.image, alt: '' },
    ]) {
      expect(aboutSchema.safeParse({ ...content, portrait: { image } }).success).toBe(false)
    }
  })
})
