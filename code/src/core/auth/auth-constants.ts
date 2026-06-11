export const ACCESS_COOKIE_NAME = 'access-token'
export const REFRESH_COOKIE_NAME = 'refresh_token'
export const REFRESH_COOKIE_PATH = '/api/auth'

// Fallback maxAge for the access cookie when the backend omits refresh_expires_in.
// Must be >= the typical refresh token lifetime issued by the backend.
export const ACCESS_COOKIE_MAX_AGE_FALLBACK = 7 * 24 * 60 * 60
