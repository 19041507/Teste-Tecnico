'use client'

import { Button } from '@/shared/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ForbiddenPage() {
  const router = useRouter()

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center p-6">
      <div className="mx-auto flex flex-col items-center space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-primary text-9xl font-extrabold">403</h1>
          <h2 className="text-3xl font-bold">Acesso negado</h2>
          <p className="text-muted-foreground max-w-md">
            Você não tem permissão para acessar esta página.
          </p>
        </div>

        <Button onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </Button>
      </div>
    </div>
  )
}
