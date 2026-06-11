'use client'

import { useEffect, useState } from 'react'
import { CircleAlert, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface AttachmentViewerProps {
  url: string | null
  isLoading?: boolean
  errorMessage?: string | null
  errorTitle?: string
  onRetry?: () => void | Promise<void>
  redirectDelayMs?: number
}

export default function AttachmentViewer({
  url,
  isLoading = false,
  errorMessage = null,
  errorTitle = 'Nao foi possivel carregar o anexo',
  onRetry,
  redirectDelayMs = 100,
}: AttachmentViewerProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const checkIsMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

    setIsMobile(checkIsMobile)
  }, [])

  useEffect(() => {
    if (!isMobile || !url) {
      return
    }

    const timer = setTimeout(() => {
      window.location.replace(url)
    }, redirectDelayMs)

    return () => clearTimeout(timer)
  }, [isMobile, redirectDelayMs, url])

  if (errorMessage) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <div className="bg-background flex w-full max-w-md flex-col items-center gap-6 rounded-xl border p-8 text-center">
          <div className="bg-destructive/10 flex h-30 w-30 items-center justify-center rounded-full">
            <CircleAlert className="text-destructive h-14 w-14" />
          </div>
          <div className="space-y-1">
            <h1 className="text-foreground text-xl font-semibold">
              {errorTitle}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {errorMessage}
            </p>
          </div>
          {onRetry ? (
            <Button onClick={onRetry} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          ) : null}
        </div>
      </div>
    )
  }

  if (isLoading || isMobile === null || !url || isMobile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <iframe src={url} width="100%" height="100%" className="border-0" />
    </div>
  )
}
