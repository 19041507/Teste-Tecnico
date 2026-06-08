'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  ArrowRight,
  Building2,
  CarFront,
  CircleAlert,
  Gauge,
  RefreshCw,
  RotateCcw,
  Users,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { getCompanies } from '@/modules/companies'
import { getUsers } from '@/modules/users'
import { getVehicles, VehicleType } from '@/modules/vehicles'
import type { Vehicle } from '@/modules/vehicles'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart'
import { Label } from '@/shared/ui/label'
import { Progress } from '@/shared/ui/progress'
import { SelectCombobox } from '@/shared/ui/select-combobox'
import { Skeleton } from '@/shared/ui/skeleton'
import { Pagination } from '@/shared/ui/table/pagination'

const chartConfig = {
  total: {
    label: 'Veículos',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

const STATUS_OPTIONS = [
  { value: 'true', label: 'Ativos' },
  { value: 'false', label: 'Inativos' },
] as const

const RECENT_PAGE_SIZE = 4

interface DashboardFilters {
  companyId?: string
  vehicleType?: VehicleType
  isActive?: 'true' | 'false'
}

async function getDashboardData() {
  const [companies, users, vehicles] = await Promise.all([
    getCompanies({
      page: 1,
      limit: 100,
      orderBy: 'createdAt',
      order: 'desc',
    }),
    getUsers({
      page: 1,
      limit: 100,
      orderBy: 'createdAt',
      order: 'desc',
    }),
    getVehicles({
      page: 1,
      limit: 100,
      orderBy: 'updatedAt',
      order: 'desc',
    }),
  ])

  return {
    companies: companies.data,
    users: users.data,
    vehicles: vehicles.data,
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-label="Carregando dashboard">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  href,
}: {
  label: string
  value: number | string
  description: string
  icon: LucideIcon
  href: string
}) {
  return (
    <Link
      href={href}
      className="group focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={`${label}: ${value}. ${description}`}
    >
      <Card className="group-hover:border-primary/40 group-hover:bg-muted/20 h-full gap-3 transition-colors">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-0">
          <div className="space-y-1">
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
          </div>
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
        <CardFooter className="text-primary mt-auto border-t pt-3 text-xs font-medium">
          Abrir módulo
          <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5" />
        </CardFooter>
      </Card>
    </Link>
  )
}

function buildVehicleHref(
  filters: DashboardFilters,
  overrides: Partial<DashboardFilters> = {}
) {
  const merged = { ...filters, ...overrides }
  const params = new URLSearchParams()

  if (merged.companyId) params.set('companyId', merged.companyId)
  if (merged.vehicleType) params.set('vehicleType', merged.vehicleType)
  if (merged.isActive) params.set('isActive', merged.isActive)

  const query = params.toString()
  return query ? `/vehicles?${query}` : '/vehicles'
}

function RecentVehicleItem({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/vehicles?vehicleId=${vehicle.id}`}
      className="hover:bg-muted/50 focus-visible:ring-ring flex items-center gap-3 rounded-lg border p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`Visualizar detalhes do veículo ${vehicle.plate}`}
    >
      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
        <CarFront className="text-muted-foreground size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium uppercase">
            {vehicle.plate}
          </span>
          <Badge variant={vehicle.isActive ? 'default' : 'outline'}>
            {vehicle.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        <p className="text-muted-foreground truncate text-xs">
          {vehicle.brand} {vehicle.model} · {vehicle.company.tradeName}
        </p>
      </div>
      <ArrowRight className="text-muted-foreground size-4 shrink-0" />
    </Link>
  )
}

export function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({})
  const [recentPage, setRecentPage] = useState(1)
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    refetchOnWindowFocus: false,
  })

  const filteredVehicles = useMemo(() => {
    if (!data) return []

    return data.vehicles.filter((vehicle) => {
      if (filters.companyId && vehicle.companyId !== filters.companyId) {
        return false
      }
      if (filters.vehicleType && vehicle.vehicleType !== filters.vehicleType) {
        return false
      }
      if (
        filters.isActive !== undefined &&
        vehicle.isActive !== (filters.isActive === 'true')
      ) {
        return false
      }
      return true
    })
  }, [data, filters])

  useEffect(() => setRecentPage(1), [filters])

  if (isLoading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Alert variant="destructive" className="max-w-xl">
          <CircleAlert />
          <AlertTitle>Não foi possível carregar a dashboard</AlertTitle>
          <AlertDescription>
            <p>
              Ocorreu um erro ao consultar os dados mockados. Tente novamente.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const companyOptions = data.companies.map((company) => ({
    value: company.id,
    label: company.tradeName,
  }))
  const vehicleTypeOptions = Object.values(VehicleType).map((type) => ({
    value: type,
    label: type,
  }))

  const activeCompanies = data.companies.filter((item) => item.isActive).length
  const activeUsers = data.users.filter((item) => item.isActive).length
  const activeVehicles = filteredVehicles.filter((item) => item.isActive).length
  const inactiveVehicles = filteredVehicles.length - activeVehicles
  const fleetAvailability = filteredVehicles.length
    ? Math.round((activeVehicles / filteredVehicles.length) * 100)
    : 0

  const typeData = Object.values(VehicleType).map((type) => ({
    type,
    total: filteredVehicles.filter((vehicle) => vehicle.vehicleType === type)
      .length,
  }))

  const recentTotalPages = Math.max(
    1,
    Math.ceil(filteredVehicles.length / RECENT_PAGE_SIZE)
  )
  const recentVehicles = filteredVehicles.slice(
    (recentPage - 1) * RECENT_PAGE_SIZE,
    recentPage * RECENT_PAGE_SIZE
  )
  const hasFilters = Object.values(filters).some(Boolean)
  const vehiclesHref = buildVehicleHref(filters)

  return (
    <div className="space-y-5">
      <section className="from-primary/12 via-primary/5 relative overflow-hidden rounded-xl border bg-gradient-to-br to-transparent p-5 sm:p-6">
        <div className="bg-primary/10 absolute -top-24 -right-20 size-64 rounded-full blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="text-primary flex items-center gap-2 text-sm font-medium">
              <Gauge className="size-4" aria-hidden="true" />
              Visão geral da operação
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Motiron Technologies
              </h1>
              <p className="text-muted-foreground mt-1 max-w-xl text-sm">
                Acompanhe os principais indicadores e acesse rapidamente os
                registros da frota.
              </p>
            </div>
          </div>

          <Button asChild className="w-fit">
            <Link href={vehiclesHref}>
              Gerenciar frota
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Card className="gap-4 py-4">
        <CardHeader className="px-4 pb-0 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Filtros da frota</CardTitle>
              <CardDescription>
                Os indicadores e a lista abaixo refletem a seleção atual.
              </CardDescription>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
                <RotateCcw className="size-4" />
                Limpar filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 px-4 sm:grid-cols-3 sm:px-5">
          <div className="space-y-1.5">
            <Label htmlFor="dashboard-company-filter">Empresa</Label>
            <SelectCombobox
              id="dashboard-company-filter"
              options={companyOptions}
              value={filters.companyId}
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  companyId: value || undefined,
                }))
              }
              placeholder="Todas as empresas"
              searchPlaceholder="Buscar empresa..."
              showSearch
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dashboard-type-filter">Tipo</Label>
            <SelectCombobox
              id="dashboard-type-filter"
              options={vehicleTypeOptions}
              value={filters.vehicleType}
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  vehicleType: (value as VehicleType | null) || undefined,
                }))
              }
              placeholder="Todos os tipos"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dashboard-status-filter">Status</Label>
            <SelectCombobox
              id="dashboard-status-filter"
              options={STATUS_OPTIONS}
              value={filters.isActive}
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  isActive:
                    value === 'true' || value === 'false' ? value : undefined,
                }))
              }
              placeholder="Todos os status"
            />
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Clientes cadastrados"
          value={data.companies.length}
          description={`${activeCompanies} clientes ativos`}
          icon={Building2}
          href="/companies"
        />
        <MetricCard
          label="Usuários ativos"
          value={activeUsers}
          description={`${data.users.length} usuários cadastrados`}
          icon={Users}
          href="/users"
        />
        <MetricCard
          label="Veículos encontrados"
          value={filteredVehicles.length}
          description={`${activeVehicles} ativos e ${inactiveVehicles} inativos`}
          icon={CarFront}
          href={vehiclesHref}
        />
        <MetricCard
          label="Disponibilidade"
          value={`${fleetAvailability}%`}
          description="Percentual de veículos ativos"
          icon={Activity}
          href={buildVehicleHref(filters, { isActive: 'true' })}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Composição da frota</CardTitle>
              <CardDescription>
                Distribuição dos veículos por categoria.
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {filteredVehicles.length} no total
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            {filteredVehicles.length === 0 ? (
              <div className="text-muted-foreground flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center text-sm">
                <CarFront className="size-8" aria-hidden="true" />
                Nenhum veículo corresponde aos filtros selecionados.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart
                  accessibilityLayer
                  data={typeData}
                  margin={{ left: 0, right: 8 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="type"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-total)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}

            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Disponibilidade da seleção
                </span>
                <span className="font-medium tabular-nums">
                  {fleetAvailability}%
                </span>
              </div>
              <Progress
                value={fleetAvailability}
                aria-label="Disponibilidade da frota"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Veículos recentes</CardTitle>
                <CardDescription>
                  Cadastros atualizados mais recentemente.
                </CardDescription>
              </div>
              {isFetching && (
                <RefreshCw
                  className="text-muted-foreground size-4 animate-spin"
                  aria-label="Atualizando dados"
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentVehicles.length > 0 ? (
              recentVehicles.map((vehicle) => (
                <RecentVehicleItem key={vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              <div className="text-muted-foreground flex min-h-52 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm">
                <CarFront className="size-8" aria-hidden="true" />
                Nenhum veículo para exibir.
                {hasFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({})}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </CardContent>
          {filteredVehicles.length > 0 && (
            <CardFooter className="border-t pt-4">
              <Pagination
                currentPage={recentPage}
                totalPages={recentTotalPages}
                totalItems={filteredVehicles.length}
                itemsPerPage={RECENT_PAGE_SIZE}
                onPageChange={setRecentPage}
                itemLabel="veículo"
                itemLabelPlural="veículos"
                showNumbers={false}
              />
            </CardFooter>
          )}
        </Card>
      </section>
    </div>
  )
}
