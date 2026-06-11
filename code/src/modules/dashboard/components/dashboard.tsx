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
  ShieldCheck,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart'
import { Label } from '@/shared/ui/label'
import { SelectCombobox } from '@/shared/ui/select-combobox'
import { Skeleton } from '@/shared/ui/skeleton'
import { Pagination } from '@/shared/ui/table/pagination'
import { cn } from '@/shared/utils/cn'

const chartConfig = {
  active: {
    label: 'Ativos',
    color: 'var(--chart-1)',
  },
  inactive: {
    label: 'Inativos',
    color: 'var(--muted-foreground)',
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
      <Skeleton className="h-72 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 w-full" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

type MetricTone = 'green' | 'blue' | 'violet' | 'amber'

const metricToneClasses: Record<
  MetricTone,
  { icon: string; line: string; value: string }
> = {
  green: {
    icon: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    line: 'bg-emerald-500',
    value: 'text-emerald-700 dark:text-emerald-300',
  },
  blue: {
    icon: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    line: 'bg-sky-500',
    value: 'text-sky-700 dark:text-sky-300',
  },
  violet: {
    icon: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    line: 'bg-violet-500',
    value: 'text-violet-700 dark:text-violet-300',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    line: 'bg-amber-500',
    value: 'text-amber-700 dark:text-amber-300',
  },
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  href,
  tone,
}: {
  label: string
  value: number | string
  description: string
  icon: LucideIcon
  href: string
  tone: MetricTone
}) {
  const toneClasses = metricToneClasses[tone]

  return (
    <Link
      href={href}
      className="group focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={`${label}: ${value}. ${description}`}
    >
      <Card className="relative h-full gap-3 overflow-hidden transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        <span
          className={cn('absolute inset-x-0 top-0 h-1', toneClasses.line)}
          aria-hidden="true"
        />
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-0">
          <div className="space-y-1.5">
            <CardDescription className="font-medium">{label}</CardDescription>
            <CardTitle
              className={cn('text-3xl tabular-nums', toneClasses.value)}
            >
              {value}
            </CardTitle>
          </div>
          <div
            className={cn(
              'flex size-11 items-center justify-center rounded-xl',
              toneClasses.icon
            )}
          >
            <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
        <CardFooter className="text-muted-foreground group-hover:text-foreground mt-auto border-t pt-3 text-xs font-medium transition-colors">
          Ver detalhes
          <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
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
      className="hover:bg-muted/50 focus-visible:ring-ring group flex items-center gap-3 rounded-xl border p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`Visualizar detalhes do veículo ${vehicle.plate}`}
    >
      <div className="bg-muted group-hover:bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors">
        <CarFront
          className="text-muted-foreground group-hover:text-primary size-5 transition-colors"
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-semibold tracking-wide uppercase">
            {vehicle.plate}
          </span>
          <Badge variant={vehicle.isActive ? 'default' : 'outline'}>
            {vehicle.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1 truncate text-xs">
          {vehicle.brand} {vehicle.model} · {vehicle.company.tradeName}
        </p>
      </div>
      <ArrowRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

function FleetStatusRow({
  label,
  value,
  dotClassName,
}: {
  label: string
  value: number
  dotClassName: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="flex items-center gap-2 text-white/70">
        <span className={cn('size-2 rounded-full', dotClassName)} />
        {label}
      </span>
      <strong className="font-mono text-base text-white tabular-nums">
        {value}
      </strong>
    </div>
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

  const typeData = Object.values(VehicleType).map((type) => {
    const vehiclesByType = filteredVehicles.filter(
      (vehicle) => vehicle.vehicleType === type
    )

    return {
      type,
      active: vehiclesByType.filter((vehicle) => vehicle.isActive).length,
      inactive: vehiclesByType.filter((vehicle) => !vehicle.isActive).length,
    }
  })

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
      <section className="bg-sidebar text-sidebar-foreground relative overflow-hidden rounded-2xl border border-white/10 shadow-sm">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        <div className="bg-primary/25 absolute -top-32 -right-20 size-80 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge className="border border-white/15 bg-white/10 text-white hover:bg-white/10">
                <Gauge aria-hidden="true" />
                Central de operações
              </Badge>

              <div>
                <p className="text-sm font-medium tracking-[0.2em] text-white/50 uppercase">
                  Motiron Technologies
                </p>
                <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Controle da frota.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                  Acompanhe disponibilidade, distribuição e registros recentes
                  da frota.
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="w-fit">
              <Link href={vehiclesHref}>
                Gerenciar frota
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-white/45 uppercase">
                  Disponibilidade
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Veículos ativos 
                </p>
              </div>
              <ShieldCheck className="text-primary size-5" aria-hidden="true" />
            </div>

            <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-6">
              <div
                className="relative flex size-28 items-center justify-center rounded-full p-2"
                style={{
                  background: `conic-gradient(var(--primary) ${fleetAvailability}%, rgba(255,255,255,.12) 0)`,
                }}
                aria-label={`${fleetAvailability}% de disponibilidade`}
              >
                <div className="bg-sidebar flex size-full flex-col items-center justify-center rounded-full border border-white/10">
                  <strong className="text-2xl text-white tabular-nums">
                    {fleetAvailability}%
                  </strong>
                  <span className="text-[10px] tracking-wider text-white/45 uppercase">
                    ativos
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <FleetStatusRow
                  label="Ativos"
                  value={activeVehicles}
                  dotClassName="bg-emerald-400"
                />
                <FleetStatusRow
                  label="Inativos"
                  value={inactiveVehicles}
                  dotClassName="bg-white/30"
                />
                <FleetStatusRow
                  label="Total"
                  value={filteredVehicles.length}
                  dotClassName="bg-sky-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Card className="gap-4 py-4">
        <CardHeader className="px-4 pb-0 sm:px-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Operação</CardTitle>
              <CardDescription>
                Todos os indicadores da frota abaixo acompanham estes filtros.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredVehicles.length}{' '}
                {filteredVehicles.length === 1 ? 'veículo' : 'veículos'}
              </Badge>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({})}
                >
                  <RotateCcw className="size-4" />
                  Limpar
                </Button>
              )}
            </div>
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
          description={`${activeCompanies} clientes ativos na base`}
          icon={Building2}
          href="/companies"
          tone="green"
        />
        <MetricCard
          label="Usuários ativos"
          value={activeUsers}
          description={`${data.users.length} usuários cadastrados`}
          icon={Users}
          href="/users"
          tone="blue"
        />
        <MetricCard
          label="Frota monitorada"
          value={filteredVehicles.length}
          description={`${activeVehicles} ativos e ${inactiveVehicles} inativos`}
          icon={CarFront}
          href={vehiclesHref}
          tone="violet"
        />
        <MetricCard
          label="Disponibilidade"
          value={`${fleetAvailability}%`}
          description="Percentual de veículos ativos"
          icon={Activity}
          href={buildVehicleHref(filters, { isActive: 'true' })}
          tone="amber"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Mapa operacional da frota</CardTitle>
              <CardDescription>
                Veículos ativos e inativos distribuídos por categoria.
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {filteredVehicles.length} no total
            </Badge>
          </CardHeader>
          <CardContent>
            {filteredVehicles.length === 0 ? (
              <div className="text-muted-foreground flex h-72 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center text-sm">
                <CarFront className="size-8" aria-hidden="true" />
                Nenhum veículo corresponde aos filtros selecionados.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[310px] w-full">
                <BarChart
                  accessibilityLayer
                  data={typeData}
                  margin={{ left: 0, right: 8, top: 10 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="type"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.35 }}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="active"
                    stackId="status"
                    fill="var(--color-active)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="inactive"
                    stackId="status"
                    fill="var(--color-inactive)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Movimentações recentes</CardTitle>
                <CardDescription>
                  Veículos atualizados mais recentemente.
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
              <div className="text-muted-foreground flex min-h-52 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center text-sm">
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
