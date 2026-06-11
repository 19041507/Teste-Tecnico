/**
 * Extracts a named cookie value from a fetch Response's Set-Cookie headers.
 * Uses getSetCookie() (Node 18+ / WHATWG Fetch) when available, falls back to
 * the combined get('set-cookie') string.
 */
export function extractCookieFromResponse(
  headers: Headers,
  cookieName: string
): string | null {
  const entries: string[] =
    typeof (headers as unknown as { getSetCookie: () => string[] })
      .getSetCookie === 'function'
      ? (headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
      : [headers.get('set-cookie') ?? '']

  const prefix = `${cookieName}=`
  for (const entry of entries) {
    const valuePart = entry.split(';')[0]?.trim() ?? ''
    if (valuePart.startsWith(prefix)) {
      return valuePart.slice(prefix.length) || null
    }
  }
  return null
}
