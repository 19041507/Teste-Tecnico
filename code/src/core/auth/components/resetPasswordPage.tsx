'use client'

import { FlaskConical } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { validatePasswordResetToken } from '@/core/auth/services/passwordResetService'
import { toast } from 'sonner'
import { ResetPasswordPopup } from './resetPasswordForm'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      const tokenParam = searchParams.get('token')

      if (!tokenParam) {
        router.push('/')
        return
      }

      try {
        await validatePasswordResetToken(tokenParam)

        setToken(tokenParam)
        setIsValidating(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || 'Token inválido ou expirado')
        router.push('/')
      }
    }

    validateToken()
  }, [searchParams, router])

  const handleClose = () => {
    router.push('/')
  }

  if (isValidating || !token) {
    return null
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden p-6">
      <div className="grid h-full grid-cols-12">
        <div className="col-span-12 lg:col-span-6">
          <div className="flex h-full flex-col items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md">
                <FlaskConical className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-lg font-semibold">
                  Chemicals
                </span>
              </div>
            </div>

            <span className="text-muted-foreground text-sm font-normal">
              © 2025 Motiron Technologies
            </span>
          </div>
        </div>

        <div className="col-span-12 hidden lg:col-span-6 lg:block">
          <div className="bg-primary flex h-full w-full items-center justify-end overflow-hidden rounded-lg"></div>
        </div>
      </div>

      <ResetPasswordPopup token={token} onClose={handleClose} />
    </div>
  )
}
