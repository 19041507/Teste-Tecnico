/**
 * Garante que o callback de redirect seja um path interno válido,
 * evitando open redirect (ex.: ?callback=https://evil.com).
 */
export function getSafeCallbackUrl(callback: string | null): string | null {
  if (!callback || typeof callback !== 'string') return null
  const trimmed = callback.trim()
  if (!trimmed.startsWith('/')) return null
  if (trimmed.startsWith('//')) return null
  if (/^https?:\/\//i.test(trimmed)) return null
  if (/[\s\\\0]/.test(trimmed)) return null
  return trimmed
}
