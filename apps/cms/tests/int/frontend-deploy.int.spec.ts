// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'
import { triggerFrontendDeploy } from '../../src/hooks/triggerFrontendDeploy'
import { Main } from '../../src/globals/Main'
import { About } from '../../src/globals/About'
import { Works } from '../../src/collections/Works'
import { Media } from '../../src/collections/Media'

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

function setup(url = 'https://api.vercel.com/v1/integrations/deploy/test-secret') {
  vi.stubEnv('FRONTEND_DEPLOY_HOOK_URL', url)
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
  vi.stubGlobal('fetch', fetchMock)
  const error = vi.fn()
  const req = { payload: { logger: { error } } } as unknown as PayloadRequest
  const doc = { id: 'saved-document' }
  return { fetchMock, error, req, doc }
}

describe('Frontend deployment', () => {
  it('is disabled when the deploy hook URL is empty', async () => {
    const { req, doc, fetchMock } = setup('')
    expect(await triggerFrontendDeploy({ req, doc })).toBe(doc)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('awaits the POST request and preserves the saved document', async () => {
    const { req, doc, fetchMock, error } = setup()
    let complete!: (response: Response) => void
    fetchMock.mockReturnValue(new Promise<Response>(resolve => { complete = resolve }))
    let finished = false
    const result = triggerFrontendDeploy({ req, doc }).then(value => { finished = true; return value })
    await Promise.resolve()
    expect(finished).toBe(false)
    expect(fetchMock).toHaveBeenCalledWith(process.env.FRONTEND_DEPLOY_HOOK_URL, {
      method: 'POST', signal: expect.any(AbortSignal),
    })
    complete(new Response(null, { status: 200 }))
    expect(await result).toBe(doc)
    expect(error).not.toHaveBeenCalled()
  })

  it('logs failed HTTP responses without failing the content operation', async () => {
    const { req, doc, fetchMock, error } = setup()
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }))
    expect(await triggerFrontendDeploy({ req, doc })).toBe(doc)
    expect(error).toHaveBeenCalledWith(expect.stringContaining('HTTP 503'))
  })

  it('handles network failures without exposing the secret URL', async () => {
    const { req, doc, fetchMock, error } = setup()
    fetchMock.mockRejectedValue(new Error(`Request failed: ${process.env.FRONTEND_DEPLOY_HOOK_URL}`))
    expect(await triggerFrontendDeploy({ req, doc })).toBe(doc)
    expect(error).toHaveBeenCalledOnce()
    expect(JSON.stringify(error.mock.calls)).not.toContain('test-secret')
  })

  it('covers global saves and collection saves and deletions', () => {
    for (const config of [Main, About, Works, Media]) {
      expect(config.hooks?.afterChange).toContain(triggerFrontendDeploy)
    }
    for (const config of [Works, Media]) {
      expect(config.hooks?.afterDelete).toContain(triggerFrontendDeploy)
    }
  })
})
