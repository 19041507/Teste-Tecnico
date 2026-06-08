'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/shared/ui/input'
import { Loader2, Search } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export const TABLE_SEARCH_DEBOUNCE_MS = 500

export interface TableSearchInputProps {
  /** Valor persistido nos filtros (ex.: `filterValues.search`); usado para sincronizar após limpar filtros etc. */
  committedSearchValue: string | undefined
  onSearchCommit: (value: string) => void
  isFetching?: boolean
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function TableSearchInput({
  committedSearchValue,
  onSearchCommit,
  isFetching = false,
  placeholder = 'Pesquisar',
  className,
  inputClassName,
}: TableSearchInputProps) {
  const committed = committedSearchValue ?? ''
  const [inputValue, setInputValue] = useState(committed)
  const pendingCommitRef = useRef<string | null>(null)
  const onSearchCommitRef = useRef(onSearchCommit)
  onSearchCommitRef.current = onSearchCommit

  useEffect(() => {
    if (
      pendingCommitRef.current !== null &&
      committed === pendingCommitRef.current
    ) {
      pendingCommitRef.current = null
      return
    }
    setInputValue(committed)
  }, [committed])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (inputValue === committed) return
      pendingCommitRef.current = inputValue
      onSearchCommitRef.current(inputValue)
    }, TABLE_SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [inputValue, committed])

  return (
    <div className={cn('relative w-40 lg:w-96', className)}>
      {isFetching ? (
        <Loader2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin" />
      ) : (
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      )}
      <Input
        placeholder={placeholder}
        className={cn('pl-9', isFetching && 'opacity-90', inputClassName)}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-busy={isFetching}
      />
    </div>
  )
}
