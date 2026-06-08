'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Input } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'

type MultiselectComboboxProps = {
  options: { label: string; value: string }[]
  value?: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  maxSelected?: number
  minSelected?: number
  sortSelectedToTop?: boolean
  showSearch?: boolean
} & React.ComponentProps<'button'>

export function MultiselectCombobox({
  options,
  value = [],
  onValueChange,
  placeholder = 'Selecione uma ou mais opções',
  searchPlaceholder = 'Buscar...',
  disabled = false,
  className,
  maxSelected,
  minSelected,
  sortSelectedToTop = false,
  showSearch = true,
  ...props
}: MultiselectComboboxProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [initialSort, setInitialSort] = useState(true)
  const [visibleCount, setVisibleCount] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([])

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  )

  const filteredOptions = options.filter((option) => {
    const search = searchQuery.toLowerCase()
    const label = option.label.toLowerCase()
    return label.includes(search)
  })

  const sortedOptions =
    sortSelectedToTop && initialSort
      ? [...filteredOptions].sort((a, b) => {
          const aSelected = value.includes(a.value)
          const bSelected = value.includes(b.value)
          if (aSelected && !bSelected) return -1
          if (!aSelected && bSelected) return 1
          return 0
        })
      : filteredOptions

  useEffect(() => {
    if (!containerRef.current || selectedOptions.length === 0) {
      setVisibleCount(selectedOptions.length)
      return
    }

    const containerWidth = containerRef.current.offsetWidth
    const countBadgeWidth = 50
    const gap = 8
    let totalWidth = 0
    let count = 0

    for (let i = 0; i < badgeRefs.current.length; i++) {
      const badge = badgeRefs.current[i]
      if (!badge) continue

      const badgeWidth = badge.offsetWidth
      const widthWithGap = badgeWidth + (i > 0 ? gap : 0)

      if (
        totalWidth + widthWithGap + countBadgeWidth > containerWidth &&
        i < selectedOptions.length - 1
      ) {
        break
      }

      totalWidth += widthWithGap
      count++
    }

    setVisibleCount(Math.max(1, count))
  }, [selectedOptions, value])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setInitialSort(true)
      setSearchQuery('')
    }
  }

  const handleSelect = (selectedValue: string) => {
    setInitialSort(false)
    if (value.includes(selectedValue)) {
      if (minSelected && value.length <= minSelected) {
        return
      }
      onValueChange(value.filter((item) => item !== selectedValue))
    } else {
      if (!maxSelected || value.length < maxSelected) {
        onValueChange([...value, selectedValue])
      }
    }
  }

  const remainingCount = selectedOptions.length - visibleCount
  const visibleOptions = selectedOptions.slice(0, visibleCount)

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
            <div
              ref={containerRef}
              className="mr-2 flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-xs"
            >
              {selectedOptions.length > 0 ? (
                <div className="flex min-w-0 items-center gap-2">
                  <div className="pointer-events-none absolute flex gap-2 opacity-0">
                    {selectedOptions.map((option, index) => (
                      <div
                        key={option.value}
                        ref={(el) => {
                          if (el) {
                            badgeRefs.current[index] = el
                          }
                        }}
                      >
                        <Badge
                          variant="outline"
                          className="px-2 py-0.5 text-xs whitespace-nowrap"
                        >
                          {option.label}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {visibleOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant="outline"
                      className="px-2 py-0.5 text-xs whitespace-nowrap"
                    >
                      {option.label}
                    </Badge>
                  ))}

                  {remainingCount > 0 && (
                    <Badge
                      variant="outline"
                      className="px-2 py-0.5 text-xs whitespace-nowrap"
                    >
                      +{remainingCount}
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground truncate text-sm">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) p-0"
          align="start"
          sideOffset={4}
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
                sortedOptions.map((option) => {
                  const isSelected = value.includes(option.value)
                  const isAtMinimum =
                    minSelected && value.length <= minSelected && isSelected
                  const isAtMaximum =
                    !isSelected && maxSelected && value.length >= maxSelected
                  const isDisabled = isAtMinimum || isAtMaximum

                  return (
                    <div
                      key={option.value}
                      onClick={() => !isDisabled && handleSelect(option.value)}
                      className={cn(
                        'hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none',
                        isDisabled && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <Check
                        className={cn(
                          'size-4',
                          isSelected ? 'text-primary opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="ml-2">{option.label}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
