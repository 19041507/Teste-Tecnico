import axios, { AxiosError } from 'axios'
import { handleAuthExpired } from '@/core/auth/logout-broadcast'

/** Thrown only when the refresh endpoint explicitly rejects the session (401/403). */
export class RefreshFailedError extends Error {
  constructor() {
    super('refresh_failed')
    this.name = 'RefreshFailedError'
  }
}

// Deduplicates concurrent refresh calls within the same tab
let refreshPromise: Promise<void> | null = null

export async function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          throw new RefreshFailedError()
        }
        if (!res.ok) {
          // Transient server error — don't kill the session
          throw new Error(`refresh_server_error_${res.status}`)
        }
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

const instance = axios.create({
  baseURL: '/api/backend',
  withCredentials: true,
})

instance.interceptors.response.use(
  (response) => response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (error: AxiosError<any>) => {
    const fallback = {
      statusCode: 500,
      message: 'Erro interno do servidor.',
      code: 'INTERNAL_ERROR',
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = error.config as any
    if (error.response?.status === 401 && !config?.['_retry']) {
      try {
        await refreshAccessToken()

        const retryConfig = { ...error.config, _retry: true }

        // FormData boundary changes on re-serialization; let browser regenerate it
        if (retryConfig.data instanceof FormData) {
          if (retryConfig.headers) {
            delete retryConfig.headers['Content-Type']
          }
        }

        return instance(retryConfig)
      } catch (err) {
        if (err instanceof RefreshFailedError) handleAuthExpired()
        return Promise.reject({
          statusCode: 401,
          message: 'Sessão expirada. Faça login novamente.',
          code: 'UNAUTHORIZED',
        })
      }
    }

    if (error.response?.data) {
      return Promise.reject({
        statusCode: error.response.data.statusCode ?? error.response.status,
        message: error.response.data.message ?? fallback.message,
        code: error.response.data.code ?? fallback.code,
      })
    }

    return Promise.reject(fallback)
  }
)

export default instance
