import type { PayloadRequest } from 'payload'

// Await the request so a serverless invocation cannot end before it is sent.
export async function triggerFrontendDeploy<T>({ doc, req }: { doc: T; req: PayloadRequest }): Promise<T> {
  const url = process.env.FRONTEND_DEPLOY_HOOK_URL
  if (!url) return doc

  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) {
      req.payload.logger.error(`Frontend deployment trigger failed: HTTP ${response.status}. Content was saved.`)
    }
  } catch {
    // Do not log the error or URL: the deploy hook URL is a secret.
    req.payload.logger.error('Frontend deployment trigger failed: request failed or timed out. Content was saved.')
  }

  return doc
}
