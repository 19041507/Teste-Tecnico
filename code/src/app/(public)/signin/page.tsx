import { Suspense } from 'react'
import { Gauge } from 'lucide-react'
import { SigninForm } from '@/core/auth/components/signinForm'

export default function Signin() {
  return (
    <Suspense fallback={null}>
      <div className="from-primary/90 to-primary flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-zinc-900">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full">
              <Gauge className="size-6" />
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight">
                Motiron
              </span>
              <span className="text-muted-foreground text-sm">
                Entre na sua conta para continuar
              </span>
            </div>
          </div>

          <SigninForm />

          <p className="text-muted-foreground mt-8 text-center text-xs">
            © 2025 Motiron Technologies
          </p>
        </div>
      </div>
    </Suspense>
  )
}
