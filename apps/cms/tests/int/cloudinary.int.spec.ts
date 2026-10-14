// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import { cloudinaryAdapter } from '../../src/storage/cloudinary'
import { Media } from '../../src/collections/Media'

const sdk = vi.hoisted(() => ({ config: vi.fn(), upload_stream: vi.fn() }))
vi.mock('cloudinary', () => ({ v2: { config: sdk.config, uploader: { upload_stream: sdk.upload_stream } } }))

const args = {
  collection: Media, data: {}, req: {}, clientUploadContext: undefined,
  file: { buffer: Buffer.from('image-bytes'), filename: 'portrait.jpg', filesize: 11, mimeType: 'image/jpeg' },
} as Parameters<HandleUpload>[0]

afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks() })

describe('Cloudinary storage adapter', () => {
  it('returns the original delivery URL without display transformations', () => {
    const original = 'https://res.cloudinary.com/test-cloud/image/upload/v123/unique.jpg'
    const adapter = cloudinaryAdapter({ collection: Media })
    expect(adapter.generateURL?.({ data: { cloudinaryURL: original } } as never)).toBe(original)
  })
  it('returns upload metadata for Payload to persist and uses a unique asset', async () => {
    vi.stubEnv('CLOUDINARY_CLOUD_NAME', 'test-cloud')
    vi.stubEnv('CLOUDINARY_API_KEY', 'test-key')
    vi.stubEnv('CLOUDINARY_API_SECRET', 'test-secret')
    const uploaded = {
      secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v123/unique.jpg',
      public_id: 'unique', width: 800, height: 1000,
    }
    const end = vi.fn(() => sdk.upload_stream.mock.calls[0][1](undefined, uploaded))
    sdk.upload_stream.mockReturnValue({ end })
    const adapter = cloudinaryAdapter({ collection: Media })
    const metadata = await adapter.handleUpload(args)
    expect(metadata).toMatchObject({
      url: uploaded.secure_url, cloudinaryURL: uploaded.secure_url,
      cloudinaryPublicID: 'unique', width: 800, height: 1000,
    })
    expect(end).toHaveBeenCalledWith(args.file.buffer)
    expect(sdk.upload_stream.mock.calls[0][0]).toMatchObject({ resource_type: 'image', overwrite: false })
    expect(sdk.upload_stream.mock.calls[0][0].public_id).toMatch(/^[a-f0-9-]{36}$/)
  })

  it('fails before contacting Cloudinary when credentials are missing', async () => {
    vi.stubEnv('CLOUDINARY_API_SECRET', '')
    const adapter = cloudinaryAdapter({ collection: Media })
    await expect(adapter.handleUpload(args)).rejects.toThrow('CLOUDINARY_API_SECRET')
    expect(sdk.upload_stream).not.toHaveBeenCalled()
  })

  it('propagates upload errors instead of saving a broken URL', async () => {
    vi.stubEnv('CLOUDINARY_CLOUD_NAME', 'test-cloud')
    vi.stubEnv('CLOUDINARY_API_KEY', 'test-key')
    vi.stubEnv('CLOUDINARY_API_SECRET', 'test-secret')
    sdk.upload_stream.mockReturnValue({ end: () => sdk.upload_stream.mock.calls[0][1](new Error('Upload failed')) })
    const adapter = cloudinaryAdapter({ collection: Media })
    await expect(adapter.handleUpload(args)).rejects.toThrow('Upload failed')
  })
})
