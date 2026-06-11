'use client'

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'

const STALE_TIME = 2 * 60 * 60 * 1000
const GC_TIME = 2 * 60 * 60 * 1000

export function useEntityList<TData>(
  queryKey: readonly [string, 'list'],
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, readonly [string, 'list']>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<TData, Error> {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    ...options,
  })
}
