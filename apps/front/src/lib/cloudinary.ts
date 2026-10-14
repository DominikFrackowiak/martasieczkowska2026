/** Apply delivery defaults to standard Cloudinary URLs, keeping existing transforms. */
export function cloudinaryImageURL(src: string, width?: number): string {
  let url: URL
  try { url = new URL(src) } catch { return src }
  if (url.hostname !== 'res.cloudinary.com') return src
  const prefix = url.pathname.match(/^\/[^/]+\/image\/upload\//)?.[0]
  if (!prefix) return src

  const parts = url.pathname.slice(prefix.length).split('/')
  // A signed URL would need a new signature after changing its transforms.
  if (parts[0]?.startsWith('s--')) return src
  const transforms: string[] = []
  while (/^(?:[a-z]|ar|bo|co|dpr|fl|if|pg)_/.test(parts[0] ?? '')) transforms.push(parts.shift()!)
  const parameters = transforms.flatMap(transform => transform.split(','))
  const defaults: string[] = []
  if (!parameters.some(parameter => parameter.startsWith('f_'))) defaults.push('f_auto')
  if (!parameters.some(parameter => parameter.startsWith('q_'))) defaults.push('q_auto')
  if (width && !parameters.some(parameter => parameter.startsWith('w_'))) defaults.push(`c_limit,w_${Math.round(width)}`)
  if (!defaults.length) return src

  url.pathname = prefix + [...transforms, defaults.join(','), ...parts].join('/')
  return url.href
}
