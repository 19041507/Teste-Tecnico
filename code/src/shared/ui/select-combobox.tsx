'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Input } from '@/shared/ui/input'

type SelectComboboxProps = {
  options: readonly { label: string; value: string }[]
  value?: string
  onValueChange: (value: string | undefined | null) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  showSearch?: boolean
  sortSelectedToTop?: boolean
} & React.ComponentProps<'button'>

export function SelectCombobox({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione uma opção',
  searchPlaceholder = 'Buscar...',
  disabled = false,
  className,
  showSearch = false,
  sortSelectedToTop = false,
  ...props
}: SelectComboboxProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [initialSort, setInitialSort] = useState(true)

  const filteredOptions = options.filter((option) => {
    if (!showSearch) return true
    const search = searchQuery.toLowerCase()
    const label = option.label.toLowerCase()
    return label.includes(search)
  })

  const sortedOptions =
    sortSelectedToTop && initialSort
      ? [...filteredOptions].sort((a, b) => {
          const aSelected = a.value === value
          const bSelected = b.value === value
          if (aSelected && !bSelected) return -1
          if (!aSelected && bSelected) return 1
          return 0
        })
      : filteredOptions

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setInitialSort(true)
      setSearchQuery('')
    }
  }

  const handleSelect = (selectedValue: string) => {
    setInitialSort(false)
    if (selectedValue === value) {
      onValueChange(null)
    } else {
      onValueChange(selectedValue)
    }
    setIsOpen(false)
  }

  return (
    <div className={cn('flex w-full flex-col overflow-hidden', className)}>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            {...props}
            className={cn(
              'hover:bg-background w-full justify-between font-normal',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            )}
          >
            {value ? (
              <span className="truncate text-sm">
                {options.find((option) => option.value === value)?.label}
              </span>
            ) : (
              <span className="text-muted-foreground truncate text-sm">
                {placeholder}
              </span>
            )}
            <ChevronDown className="text-muted-foreground size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) p-0"
          align="start"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col">
            {showSearch && (
              <div className="border-b">
                <Input
                  placeholder={searchPlaceholder}
                  className="h-9 border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto p-1">
              {sortedOptions.length === 0 ? (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  Nenhuma opção encontrada.
                </div>
              ) : (
                sortedOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'size-4',
                        option.value === value
                          ? 'text-primary opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
