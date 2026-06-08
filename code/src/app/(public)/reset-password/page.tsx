import { Suspense } from 'react'
import ResetPasswordPage from '@/core/auth/components/resetPasswordPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  )
}
