import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchMain } from '../lib/main'

afterEach(() => vi.unstubAllGlobals())

describe('Main CMS content', () => {
  it('fetches home SEO from the Main global, preserving the CMS base path', async () => {
    const content = { seo: { metaTitle: 'Portfolio', metaDescription: 'Design and illustration by Marta.' } }
    const fetchMock = vi.fn().mockResolvedValue(Response.json(content))
    vi.stubGlobal('fetch', fetchMock)
    expect(await fetchMain('https://cms.example.com/cms/')).toEqual(content)
    expect((fetchMock.mock.calls[0][0] as URL).href).toBe('https://cms.example.com/cms/api/globals/main?depth=1')
  })

  it('rejects missing configuration, invalid protocols and HTTP errors', async () => {
    await expect(fetchMain(undefined)).rejects.toThrow('CMS_URL')
    await expect(fetchMain('file:///cms')).rejects.toThrow('HTTP(S)')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))
    await expect(fetchMain('https://cms.example.com')).rejects.toThrow('HTTP 503')
  })

  it('rejects missing or blank SEO with an actionable error', async () => {
    for (const content of [{}, { seo: { metaTitle: ' ', metaDescription: '' } }]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(content)))
      await expect(fetchMain('https://cms.example.com')).rejects.toThrow('complete and save the Main global')
    }
  })
})
