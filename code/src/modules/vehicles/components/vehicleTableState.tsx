'use client'

import { CarFront, CircleAlert, RefreshCw, SearchX } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'

export function VehicleTableLoading() {
  return (
    <div
      className="flex min-h-72 flex-col gap-3 border-y px-5 py-5"
      aria-label="Carregando veículos"
      aria-busy="true"
    >
      <div className="grid grid-cols-[52px_90px_1fr_1fr_1fr] gap-4 border-b pb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[52px_90px_1fr_1fr_1fr] gap-4 py-2"
        >
          {Array.from({ length: 5 }).map((__, cellIndex) => (
            <Skeleton key={cellIndex} className="h-7 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function VehicleTableError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-72 items-center justify-center border-y p-5">
      <Alert variant="destructive" className="max-w-xl">
        <CircleAlert />
        <AlertTitle>Não foi possível carregar os veículos</AlertTitle>
        <AlertDescription>
          <p>
            Ocorreu um erro ao consultar os dados mockados. Tente novamente.
          </p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="size-4" />
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export function VehicleTableEmpty({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean
  onClearFilters: () => void
}) {
  const Icon = hasFilters ? SearchX : CarFront

  return (
    <div className="flex min-h-72 items-center justify-center border-y p-6 text-center">
      <div className="max-w-sm space-y-3">
        <div className="bg-muted mx-auto flex size-12 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground size-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold">
            {hasFilters
              ? 'Nenhum veículo encontrado'
              : 'Nenhum veículo cadastrado'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {hasFilters
              ? 'Ajuste os termos da busca ou remova os filtros aplicados.'
              : 'Use o botão “Criar Veículo” para adicionar o primeiro registro.'}
          </p>
        </div>
        {hasFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
