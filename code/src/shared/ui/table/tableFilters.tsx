'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'
import { Filter } from 'lucide-react'
import { DatePicker } from '@/shared/ui/date-picker'
import { SelectCombobox } from '@/shared/ui/select-combobox'
import { MultiselectCombobox } from '@/shared/ui/multi-select-combobo'

export interface FilterField {
  key: string
  type:
    | 'text'
    | 'select'
    | 'multi-select'
    | 'multi-select-without-search'
    | 'date'
  label: string
  options?: { label: string; value: string }[]
  placeholder?: string
  formatter?: (value: string) => string
  renderCustom?: (props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void
  }) => React.ReactNode
  hidden?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableFiltersProps<T extends Record<string, any>> {
  filterValues: Partial<T>
  filterFields: FilterField[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (key: keyof T, value: any) => void
  onApplyFilters: (filters: Partial<T>) => void
  onClearFilters: () => void
  size?: 'sm' | 'lg' | 'default'
  title?: string
  description?: string
  hiddenKeys?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TableFilters<T extends Record<string, any>>({
  size = 'default',
  filterValues,
  filterFields,
  onApplyFilters,
  onClearFilters,
  hiddenKeys = [],
  title = 'Filtros',
  description = 'Refine sua busca utilizando os filtros abaixo',
}: TableFiltersProps<T>) {
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filterValues)

  useEffect(() => {
    setLocalFilters(filterValues)
  }, [filterValues])

  const activeFiltersCount = Object.entries(filterValues).filter(
    ([key, value]) =>
      !hiddenKeys.includes(key) &&
      key !== 'search' &&
      value !== undefined &&
      value !== 'all' &&
      value !== '' &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : true)
  ).length

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLocalFilterChange = (key: string, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    onApplyFilters(localFilters)
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    const search = localFilters.search
    onClearFilters()
    setLocalFilters({ search } as unknown as Partial<T>)
  }

  const renderFilterField = (field: FilterField) => {
    if (field.hidden) return null

    const value = localFilters[field.key as keyof T]

    if (field.renderCustom) {
      return (
        <div className="grid gap-2" key={field.key}>
          <Label>{field.label}</Label>
          {field.renderCustom({
            value,
            onChange: (v) => handleLocalFilterChange(field.key, v),
          })}
        </div>
      )
    }

    if (field.type === 'text') {
      return (
        <div className="grid gap-2" key={field.key}>
          <Label>{field.label}</Label>
          <Input
            value={(value as string) || ''}
            onChange={(e) => {
              const newValue = field.formatter
                ? field.formatter(e.target.value)
                : e.target.value
              handleLocalFilterChange(field.key, newValue)
            }}
            placeholder={field.placeholder}
            className="h-9"
          />
        </div>
      )
    }

    if (field.type === 'select') {
      return (
        <div className="grid gap-2" key={field.key}>
          <Label>{field.label}</Label>
          <SelectCombobox
            options={field.options || []}
            placeholder={field.placeholder}
            value={value as string}
            onValueChange={(v) => handleLocalFilterChange(field.key, v)}
          />
        </div>
      )
    }

    if (field.type === 'multi-select') {
      return (
        <div className="grid gap-2" key={field.key}>
          <Label>{field.label}</Label>
          <MultiselectCombobox
            options={field.options || []}
            value={value as string[]}
            onValueChange={(v) => handleLocalFilterChange(field.key, v)}
            placeholder={field.placeholder}
            sortSelectedToTop={true}
          />
        </div>
      )
    }

    if (field.type === 'multi-select-without-search') {
      return (
        <div className="grid gap-2" key={field.key}>
          <Label>{field.label}</Label>
          <MultiselectCombobox
            options={field.options || []}
            value={value as string[]}
            onValueChange={(v) => handleLocalFilterChange(field.key, v)}
            placeholder={field.placeholder}
            showSearch={false}
          />
        </div>
      )
    }

    if (field.type === 'date') {
      return (
        <div className="grid gap-2" key={field.key}>
          <Label>{field.label}</Label>
          <DatePicker
            onDateChange={(date) => {
              handleLocalFilterChange(
                field.key,
                date ? date.toISOString() : null
              )
            }}
            allowClear
          />
        </div>
      )
    }

    return null
  }

  return (
    <Sheet open={showFilters} onOpenChange={setShowFilters}>
      <SheetTrigger asChild>
        <Button variant="outline" size={size as 'sm' | 'lg' | 'default'}>
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="default"
              className="py-0.3 w-6 rounded-full text-center"
            >
              {activeFiltersCount > 9 ? '+9' : activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="gap-0 sm:max-w-md">
        <SheetHeader className="gap-1 border-b p-6">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="w-full space-y-6 overflow-y-auto p-6">
          {filterFields.map(renderFilterField)}
        </div>

        <SheetFooter className="mt-auto flex justify-between border-t p-6">
          <Button variant="outline" onClick={handleClearFilters}>
            Limpar Filtros
          </Button>
          <Button onClick={handleApplyFilters}>Aplicar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
