// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import type { MigrateUpArgs } from '@payloadcms/db-mongodb'
import { up } from '../../src/migrations/20261014_160000_about_portrait_image'

function migrationArgs(portrait: Record<string, unknown>) {
  const globals = {
    findOne: vi.fn().mockResolvedValue({ _id: 'about-id', portrait }),
    updateOne: vi.fn().mockResolvedValue({ matchedCount: 1 }),
  }
  const payload = { db: { globals: { collection: globals } }, findByID: vi.fn().mockResolvedValue({ id: 'media-id' }) }
  const args = { payload, req: {}, session: undefined } as unknown as MigrateUpArgs
  return { args, globals, payload }
}

describe('About portrait migration', () => {
  it('copies the existing Media relationship without replacing the portrait or caption', async () => {
    const { args, globals, payload } = migrationArgs({ source: 'media', media: 'media-id', caption: 'Photo credit' })
    await up(args)
    expect(payload.findByID).toHaveBeenCalledWith({ collection: 'media', id: 'media-id', depth: 0, req: args.req })
    expect(globals.updateOne.mock.calls[0][1]).toEqual({ $set: { 'portrait.image': 'media-id' } })
  })

  it('keeps an already selected image on a repeat run', async () => {
    const { args, globals } = migrationArgs({ image: 'new-image', media: 'old-image' })
    await up(args)
    expect(globals.updateOne).not.toHaveBeenCalled()
  })

  it('stops without writing when the old portrait has only a URL or the Media record is missing', async () => {
    const urlOnly = migrationArgs({ source: 'url', url: 'https://example.com/portrait.jpg' })
    await expect(up(urlOnly.args)).rejects.toThrow('manually selected or uploaded Media record')
    expect(urlOnly.globals.updateOne).not.toHaveBeenCalled()
    const missingMedia = migrationArgs({ source: 'media', media: 'missing' })
    missingMedia.payload.findByID.mockRejectedValue(new Error('Not found'))
    await expect(up(missingMedia.args)).rejects.toThrow('Not found')
    expect(missingMedia.globals.updateOne).not.toHaveBeenCalled()
  })
})
