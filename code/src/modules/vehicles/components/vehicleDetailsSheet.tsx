'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  Building2,
  CalendarDays,
  CarFront,
  CircleAlert,
  Clock3,
  History,
  RefreshCw,
  SquarePen,
  Tag,
} from 'lucide-react'
import type { Vehicle } from '@/modules/vehicles/types/Vehicle/base-vehicle.dto'
import {
  getVehicleById,
  getVehicleHistory,
} from '@/modules/vehicles/services/vehicleService'
import { useAbility } from '@/core/permissions/context/AbilityProvider'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Pagination } from '@/shared/ui/table/pagination'
import { Separator } from '@/shared/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { Skeleton } from '@/shared/ui/skeleton'

interface VehicleDetailsSheetProps {
  vehicleId: string
  onClose: () => void
  onEdit?: (vehicle: Vehicle) => void
}

const HISTORY_PAGE_SIZE = 4

function formatDate(value: Date, includeTime = false) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  }).format(new Date(value))
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-lg border p-3">
      <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-md">
        <Icon className="text-muted-foreground size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="truncate text-sm font-medium" title={value}>
          {value}
        </p>
      </div>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className="space-y-5 p-5" aria-label="Carregando detalhes do veículo">
      <Skeleton className="h-12 w-48" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

export default function VehicleDetailsSheet({
  vehicleId,
  onClose,
  onEdit,
}: VehicleDetailsSheetProps) {
  const ability = useAbility()
  const [historyPage, setHistoryPage] = useState(1)

  useEffect(() => setHistoryPage(1), [vehicleId])

  const detailsQuery = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => getVehicleById(vehicleId),
  })

  const historyQuery = useQuery({
    queryKey: ['vehicle-history', vehicleId, historyPage],
    queryFn: () =>
      getVehicleHistory(vehicleId, {
        page: historyPage,
        limit: HISTORY_PAGE_SIZE,
      }),
    placeholderData: (previousData) => previousData,
  })

  const details = detailsQuery.data

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b p-5 pr-12">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
              <CarFront className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-xl uppercase">
                  {details?.plate ?? 'Detalhes do veículo'}
                </SheetTitle>
                {details && (
                  <Badge variant={details.isActive ? 'default' : 'outline'}>
                    {details.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                )}
              </div>
              <SheetDescription className="mt-1">
                Informações completas e histórico de alterações do veículo.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {detailsQuery.isLoading ? (
          <DetailsSkeleton />
        ) : detailsQuery.isError || !details ? (
          <div className="p-5">
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Não foi possível carregar os detalhes</AlertTitle>
              <AlertDescription>
                <p>Tente novamente para consultar este veículo.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => detailsQuery.refetch()}
                >
                  <RefreshCw className="size-4" />
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-6 p-5">
            {ability.can('update', 'Vehicle') && onEdit && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(details)}
                >
                  <SquarePen className="size-4" />
                  Editar veículo
                </Button>
              </div>
            )}

            <section aria-labelledby="vehicle-summary-title">
              <div className="mb-3">
                <h2
                  id="vehicle-summary-title"
                  className="text-sm font-semibold"
                >
                  Dados do veículo
                </h2>
                <p className="text-muted-foreground text-xs">
                  Identificação e vínculo operacional.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={Building2}
                  label="Empresa"
                  value={details.company.tradeName}
                />
                <DetailItem
                  icon={Tag}
                  label="Tipo"
                  value={details.vehicleType}
                />
                <DetailItem
                  icon={CarFront}
                  label="Marca e modelo"
                  value={`${details.brand} ${details.model}`}
                />
                <DetailItem
                  icon={CalendarDays}
                  label="Ano"
                  value={String(details.year)}
                />
              </div>
            </section>

            <section aria-labelledby="vehicle-description-title">
              <h2
                id="vehicle-description-title"
                className="mb-2 text-sm font-semibold"
              >
                Observações
              </h2>
              <Card className="gap-0 py-0 shadow-none">
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {details.description || 'Nenhuma observação cadastrada.'}
                  </p>
                </CardContent>
              </Card>
            </section>

            <div className="grid gap-3 text-xs sm:grid-cols-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <Clock3 className="size-4" aria-hidden="true" />
                Criado em {formatDate(details.createdAt, true)}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 sm:justify-end">
                <Activity className="size-4" aria-hidden="true" />
                Atualizado em {formatDate(details.updatedAt, true)}
              </div>
            </div>

            <Separator />

            <section aria-labelledby="vehicle-history-title">
              <div className="mb-4 flex items-start gap-3">
                <div className="bg-muted flex size-9 items-center justify-center rounded-md">
                  <History className="text-muted-foreground size-4" />
                </div>
                <div>
                  <h2
                    id="vehicle-history-title"
                    className="text-sm font-semibold"
                  >
                    Histórico de alterações
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Registro mockado das ações realizadas durante a sessão.
                  </p>
                </div>
              </div>

              {historyQuery.isLoading ? (
                <div className="space-y-3" aria-label="Carregando histórico">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full" />
                  ))}
                </div>
              ) : historyQuery.isError ? (
                <Alert variant="destructive">
                  <CircleAlert />
                  <AlertTitle>Erro ao consultar o histórico</AlertTitle>
                  <AlertDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => historyQuery.refetch()}
                    >
                      <RefreshCw className="size-4" />
                      Tentar novamente
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : historyQuery.data?.data.length ? (
                <div className="space-y-3">
                  {historyQuery.data.data.map((entry) => (
                    <article key={entry.id} className="rounded-lg border p-3">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                        <div>
                          <h3 className="text-sm font-medium">{entry.title}</h3>
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            {entry.description}
                          </p>
                        </div>
                        <time className="text-muted-foreground shrink-0 text-xs">
                          {formatDate(entry.createdAt, true)}
                        </time>
                      </div>

                      {entry.changes.length > 0 && (
                        <ul className="mt-3 space-y-2 border-t pt-3">
                          {entry.changes.map((change) => (
                            <li
                              key={`${entry.id}-${change.field}`}
                              className="grid gap-1 text-xs sm:grid-cols-[90px_1fr]"
                            >
                              <span className="font-medium">
                                {change.label}
                              </span>
                              <span className="text-muted-foreground break-words">
                                {change.from} → {change.to}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}

                  <Pagination
                    currentPage={historyPage}
                    totalPages={historyQuery.data.meta.totalPages}
                    totalItems={historyQuery.data.meta.total}
                    itemsPerPage={HISTORY_PAGE_SIZE}
                    onPageChange={setHistoryPage}
                    itemLabel="registro"
                    itemLabelPlural="registros"
                    showNumbers={false}
                    className="pt-1"
                  />
                </div>
              ) : (
                <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                  Nenhuma alteração registrada.
                </p>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
