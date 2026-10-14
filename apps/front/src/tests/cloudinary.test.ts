import { describe, expect, it } from 'vitest'
import { cloudinaryImageURL } from '../lib/cloudinary'

const original = 'https://res.cloudinary.com/example/image/upload/v123/folder/portrait.jpg'

describe('Cloudinary image delivery', () => {
  it('keeps the version and asset path while applying automatic format and quality', () => {
    expect(cloudinaryImageURL(original)).toBe('https://res.cloudinary.com/example/image/upload/f_auto,q_auto/v123/folder/portrait.jpg')
    expect(cloudinaryImageURL(original, 324)).toBe('https://res.cloudinary.com/example/image/upload/f_auto,q_auto,c_limit,w_324/v123/folder/portrait.jpg')
  })

  it('does not duplicate transformations on repeated calls', () => {
    const optimized = cloudinaryImageURL(original, 324)
    expect(cloudinaryImageURL(optimized, 324)).toBe(optimized)
    const alreadyTransformed = original.replace('/upload/', '/upload/c_fill,w_200/f_auto,q_auto/')
    expect(cloudinaryImageURL(alreadyTransformed, 324)).toBe(alreadyTransformed)
  })

  it('keeps existing crops and explicit format or quality settings', () => {
    const cropped = original.replace('/upload/', '/upload/c_fill,h_100,w_200/f_png,q_80/')
    expect(cloudinaryImageURL(cropped)).toBe(cropped)
  })

  it('supports unversioned asset names containing underscores', () => {
    expect(cloudinaryImageURL('https://res.cloudinary.com/example/image/upload/my_portrait.jpg'))
      .toBe('https://res.cloudinary.com/example/image/upload/f_auto,q_auto/my_portrait.jpg')
  })

  it('leaves other hosts, local paths and other Cloudinary resource types unchanged', () => {
    for (const src of ['https://example.com/portrait.jpg', '/portrait.jpg', original.replace('/image/', '/video/'), original.replace('/upload/', '/upload/s--signature--/')]) {
      expect(cloudinaryImageURL(src, 324)).toBe(src)
    }
  })
})
