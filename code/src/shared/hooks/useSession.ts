import { getSession } from '@/core/auth/services/authService'
import { useQuery } from '@tanstack/react-query'

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 10 * 60 * 1000

export const useSession = () => {
  return useQuery({
    queryKey: ['session'] as const,
    queryFn: getSession,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 1,
    refetchOnWindowFocus: true,
  })
}
