'use client'

import { useEffect, useState } from 'react'
import AttachmentViewer from '@/shared/ui/attachment-viewer'

interface AttachmentRedirectProps {
  id: string
  loadUrl: (id: string) => Promise<string>
  errorMessageFallback: string
  errorTitle?: string
  redirectDelayMs?: number
}

export default function AttachmentRedirect({
  id,
  loadUrl,
  errorMessageFallback,
  errorTitle,
  redirectDelayMs,
}: AttachmentRedirectProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAndSetUrl = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    setUrl((currentUrl) => {
      if (currentUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(currentUrl)
      }

      return null
    })

    try {
      const nextUrl = await loadUrl(id)
      setUrl(nextUrl)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.message || errorMessageFallback)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAndSetUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    return () => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    }
  }, [url])

  return (
    <AttachmentViewer
      url={url}
      isLoading={isLoading}
      errorMessage={errorMessage}
      errorTitle={errorTitle}
      onRetry={fetchAndSetUrl}
      redirectDelayMs={redirectDelayMs}
    />
  )
}
