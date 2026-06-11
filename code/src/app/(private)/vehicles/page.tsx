import { Suspense } from 'react'
import { Can } from '@/core/permissions/context/abilityContext'
import {
  CreateVehicleButton,
  ExportVehiclesButton,
  Header,
  VehicleManagement,
} from '@/modules/vehicles'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

function VehicleManagementFallback() {
  return (
    <Card
      className="h-full min-h-96 gap-4 p-5"
      aria-label="Carregando veículos"
    >
      <div className="flex gap-3">
        <Skeleton className="h-9 w-full max-w-96" />
        <Skeleton className="ml-auto h-9 w-24" />
      </div>
      <Skeleton className="h-full min-h-72 w-full" />
    </Card>
  )
}

export default function VehiclesPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:gap-6 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-0">
            <h1 className="text-lg font-semibold">Gestão de Veículos</h1>
            <p className="text-muted-foreground text-sm">
              Cadastre, consulte e acompanhe os veículos vinculados às empresas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:ml-auto">
            <ExportVehiclesButton />
            <Can I="create" a="Vehicle">
              <CreateVehicleButton />
            </Can>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <Suspense fallback={<VehicleManagementFallback />}>
            <VehicleManagement />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
