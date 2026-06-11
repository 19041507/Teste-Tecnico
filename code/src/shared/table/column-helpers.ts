import { ColumnDef } from '@tanstack/react-table'
import {
  booleanCell,
  dateCell,
  enumMapCell,
  relationCell,
  textCell,
} from './cell-helpers'
import { arrayCountCell } from './array-count-cell'
import { relationArrayColumn } from './relation-array-column'
import { badgeColumn } from './badge-column'

export function estimateMinSizeFromHeader(
  header: string,
  options?: {
    charWidth?: number
    min?: number
    max?: number
    extra?: number
  }
) {
  const {
    charWidth = 9, // média realista
    min = 100,
    max = 400,
    extra = 40, // padding + ícones
  } = options ?? {}

  const estimated = header.length * charWidth + extra

  return Math.min(Math.max(estimated, min), max)
}

/**
 * Opções base para todos os helpers de coluna.
 *
 * Visibilidade — dois controles independentes:
 * - `visible: true`  → coluna começa visível no estado inicial (padrão: false = oculta)
 * - `enableHiding: false` → coluna não aparece no toggle e nunca pode ser ocultada pelo usuário
 *
 * Combinações comuns:
 * - `visible: true`                        → visível por padrão, pode ser ocultada
 * - `visible: true, enableHiding: false`   → sempre visível, não aparece no toggle
 * - (omitido)                              → oculta por padrão, pode ser mostrada
 */
export interface BaseColumnOptions<TData, TValue>
  extends Omit<ColumnDef<TData, TValue>, 'accessorKey' | 'cell'> {
  id?: string
  header: string
  minSize?: number
  visible?: boolean
}

export function baseColumn<TData, TValue>(
  accessor: keyof TData,
  cell: ColumnDef<TData, TValue>['cell'],
  options: BaseColumnOptions<TData, TValue>
): ColumnDef<TData, TValue> {
  const { header, minSize, ...rest } = options

  return {
    accessorKey: accessor as string,
    id: options.id ?? (accessor as string),
    header,
    minSize:
      minSize ??
      estimateMinSizeFromHeader(typeof header === 'string' ? header : ''),
    meta: {
      visible: options.visible ?? false,
    },
    cell,
    ...rest,
  }
}

export function textColumn<T>(
  accessor: keyof T,
  options: {
    formatter?: (value: unknown) => string
  } & BaseColumnOptions<T, unknown>
) {
  const { formatter, ...rest } = options
  return baseColumn<T, unknown>(accessor, textCell(formatter), {
    ...rest,
  })
}

export function dateColumn<T>(
  accessor: keyof T,
  options: {
    formatStr?: string
    fallback?: string
  } & BaseColumnOptions<T, Date | string | null>
) {
  const { formatStr, fallback, ...rest } = options
  return baseColumn<T, Date | string | null>(
    accessor,
    dateCell(formatStr, fallback),
    {
      ...rest,
    }
  )
}

export function booleanColumn<T>(
  accessor: keyof T,
  options: {
    trueLabel?: string
    falseLabel?: string
  } & BaseColumnOptions<T, boolean>
) {
  return baseColumn<T, boolean>(
    accessor,
    booleanCell(options.trueLabel, options.falseLabel),
    {
      ...options,
    }
  )
}

export function arrayCountColumn<T>(
  accessor: keyof T,
  options: {
    singular: string
    plural?: string
    empty: string
  } & BaseColumnOptions<T, unknown[]>
) {
  return baseColumn<T, unknown[]>(
    accessor,
    arrayCountCell({
      singular: options.singular,
      plural: options.plural,
      empty: options.empty,
    }),
    {
      ...options,
    }
  )
}

export function relationColumn<T, R>(
  accessor: keyof T,
  options: {
    valueAccessor: (value: R) => string | undefined
  } & BaseColumnOptions<T, R>
) {
  return baseColumn<T, R>(accessor, relationCell(options.valueAccessor), {
    ...options,
  })
}

export function enumMapColumn<T, TValue extends string>(
  accessor: keyof T,
  options: {
    map: Record<TValue, string>
    fallback?: string
  } & BaseColumnOptions<T, TValue>
) {
  return baseColumn<T, TValue>(
    accessor,
    enumMapCell(options.map, options.fallback),
    { ...options }
  )
}

/**
 * Cria helpers de coluna tipados para um tipo específico, evitando repetir o tipo genérico
 * em cada chamada de coluna.
 *
 * @example
 * const col = createColumnHelpers<Chemical>()
 * col.text('name', { header: 'Nome' })
 * col.date('createdAt', { header: 'Data' })
 * col.badge('status', { header: 'Status', map: {...} })
 * col.display({ id: 'actions', header: 'Ações', cell: () => <ActionsMenu /> })
 */
export function createColumnHelpers<T>() {
  return {
    text: textColumn<T>,
    date: dateColumn<T>,
    boolean: booleanColumn<T>,
    arrayCount: arrayCountColumn<T>,
    relation: function <R>(
      accessor: keyof T,
      options: Parameters<typeof relationColumn<T, R>>[1]
    ) {
      return relationColumn<T, R>(accessor, options)
    },
    enumMap: function <TValue extends string>(
      accessor: keyof T,
      options: Parameters<typeof enumMapColumn<T, TValue>>[1]
    ) {
      return enumMapColumn<T, TValue>(accessor, options)
    },
    badge: function <TValue extends string | number | boolean>(
      accessor: keyof T,
      options: Parameters<typeof badgeColumn<T, TValue>>[1]
    ) {
      return badgeColumn<T, TValue>(accessor, options)
    },
    relationArray: function <R extends Record<string, unknown>>(
      accessor: keyof T,
      options: Parameters<typeof relationArrayColumn<T, R>>[1]
    ) {
      return relationArrayColumn<T, R>(accessor, options)
    },
    /**
     * Escape hatch para colunas totalmente customizadas (ex: coluna de ações).
     * Aceita um ColumnDef completo sem accessorKey, eliminando a necessidade de
     * importar createColumnHelper do TanStack diretamente.
     */
    display: function (def: Omit<ColumnDef<T, unknown>, 'accessorKey' | 'accessorFn'>): ColumnDef<T, unknown> {
      return def as ColumnDef<T, unknown>
    },
  }
}

/**
 * Gera o estado inicial de visibilidade das colunas
 * Todas começam false, exceto as marcadas com visible: true
 */
export function getInitialVisibility<T>(columns: ColumnDef<T, unknown>[]) {
  return columns.reduce<Record<string, boolean>>((acc, col) => {
    if (!col.id) return acc
    acc[col.id] = col.meta?.visible === true
    return acc
  }, {})
}
