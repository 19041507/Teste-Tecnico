/**
 * URL base do backend externo. Usado pelo BFF (signin e proxy).
 */
export function getBackendUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not set')
  }
  return url.replace(/\/$/, '')
}
