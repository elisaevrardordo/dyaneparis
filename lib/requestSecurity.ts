type RateLimitEntry = {
  count: number
  resetAt: number
}

export function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'local'
}

export function isTrustedSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = forwardedHost || request.headers.get('host')
  if (!host) return false

  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const protocol = forwardedProtocol || new URL(request.url).protocol.replace(':', '')
  return origin === `${protocol}://${host}`
}

export function requestBodyTooLarge(request: Request, maximumBytes: number) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  return Number.isFinite(contentLength) && contentLength > maximumBytes
}

export function createMemoryRateLimiter(windowMs: number, maximum: number) {
  const entries = new Map<string, RateLimitEntry>()

  return (key: string) => {
    const now = Date.now()
    const current = entries.get(key)

    if (!current || current.resetAt <= now) {
      entries.set(key, { count: 1, resetAt: now + windowMs })
      if (entries.size > 1000) {
        for (const [entryKey, entry] of entries) {
          if (entry.resetAt <= now) entries.delete(entryKey)
        }
      }
      return false
    }

    current.count += 1
    entries.set(key, current)
    return current.count > maximum
  }
}
