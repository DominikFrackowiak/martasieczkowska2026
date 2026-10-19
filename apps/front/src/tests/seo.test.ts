import { describe, expect, it } from 'vitest'
import { getCanonicalURL, getSocialImage, seoSchema } from '../lib/seo'

const image = {
  url: 'https://res.cloudinary.com/example/image/upload/v123/folder/work.avif',
  width: 1600, height: 900, alt: 'Project artwork',
}
const seo = { metaTitle: 'Portfolio', metaDescription: 'Design and illustration.' }

describe('Social sharing metadata', () => {
  it('accepts existing SEO records and optional populated Media', () => {
    for (const socialImage of [undefined, null, image]) {
      expect(seoSchema.parse({ ...seo, socialImage }).socialImage).toEqual(socialImage)
    }
    expect(seoSchema.parse(seo)).toEqual(seo)
  })

  it('rejects unresolved or incomplete selected Media', () => {
    for (const socialImage of ['media-id', { ...image, width: null }, { ...image, alt: '' }, { ...image, url: 'http://example.com/image.jpg' }]) {
      expect(seoSchema.safeParse({ ...seo, socialImage }).success).toBe(false)
    }
  })

  it('uses the production origin and only the page path for canonical URLs', () => {
    const current = new URL('http://localhost:4321/works/project?utm_source=social#gallery')
    expect(getCanonicalURL(current.pathname, new URL('https://martasieczkowska.com')))
      .toBe('https://martasieczkowska.com/works/project')
  })

  it('delivers existing Cloudinary assets as JPEG without changing dimensions or cropping', () => {
    expect(getSocialImage(image)).toEqual({
      ...image, url: 'https://res.cloudinary.com/example/image/upload/f_jpg,q_auto/v123/folder/work.avif',
    })
    const transformed = { ...image, url: image.url.replace('/upload/', '/upload/f_auto,q_auto/') }
    expect(getSocialImage(transformed).url).toContain('/f_auto,q_auto/f_jpg,q_auto/v123/')
  })

  it('preserves signed URLs and images hosted elsewhere', () => {
    for (const url of ['https://example.com/work.jpg', image.url.replace('/upload/', '/upload/s--signature--/')]) {
      expect(getSocialImage({ ...image, url }).url).toBe(url)
    }
  })
})
