'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Calendar } from '@/shared/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover'
import { Input } from './input'
import { Button } from '@/shared/ui/button'

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial date */
  initialDate?: Date
  /** Callback when date changes */
  onDateChange?: (date: Date | null) => void
  /** Set date to end of day (23:59:59.999) */
  endOfDay?: boolean
  /** Allow clearing the date */
  allowClear?: boolean
}

export function DatePicker({
  className,
  initialDate,
  onDateChange,
  endOfDay = false,
  allowClear = false,
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate)
  const [open, setOpen] = React.useState(false)
  const [dateInputValue, setDateInputValue] = React.useState<string>(
    initialDate ? format(initialDate, 'yyyy-MM-dd') : ''
  )

  const dateInputRef = React.useRef<HTMLInputElement>(null)

  const handleDateInputChange = (value: string) => {
    setDateInputValue(value)

    if (value === '') {
      setDate(undefined)
      onDateChange?.(null)
      return
    }

    // Cria a data no fuso horário local para evitar problemas de UTC
    const [year, month, day] = value.split('-')
    const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    setDate(newDate)

    if (onDateChange) {
      if (endOfDay) {
        const adjustedDate = new Date(newDate)
        adjustedDate.setHours(23, 59, 59, 999)
        onDateChange(adjustedDate)
      } else {
        const combinedDateTime = new Date(newDate)
        onDateChange(combinedDateTime)
      }
    }
  }

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      setDateInputValue(format(selectedDate, 'yyyy-MM-dd'))

      if (onDateChange) {
        if (endOfDay) {
          const adjustedDate = new Date(selectedDate)
          adjustedDate.setHours(23, 59, 59, 999)
          onDateChange(adjustedDate)
        } else {
          const combinedDateTime = new Date(selectedDate)
          onDateChange(combinedDateTime)
        }
      }
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDate(undefined)
    setDateInputValue('')
    onDateChange?.(null)
    dateInputRef.current?.focus()
  }

  return (
    <div className={cn('relative flex w-full', className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <CalendarIcon
            className={cn(
              'absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 cursor-pointer transition-colors',
              'text-muted-foreground hover:text-foreground'
            )}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            hidden={{
              before: new Date(1000, 0, 1),
              after: new Date(),
            }}
            onSelect={(selectedDate) => {
              handleCalendarSelect(selectedDate)
              setOpen(false)
            }}
            captionLayout="dropdown"
            defaultMonth={date}
          />
          {allowClear && date && (
            <div className="border-t p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDate(undefined)
                  setDateInputValue('')
                  onDateChange?.(null)
                  setOpen(false)
                }}
                className="w-full"
              >
                Limpar data
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <Input
        ref={dateInputRef}
        type="date"
        value={dateInputValue}
        onChange={(e) => handleDateInputChange(e.target.value)}
        min="1000-01-01"
        max="9999-12-31"
        {...props}
        className={cn(
          'pl-10',
          allowClear && date ? 'pr-10' : '',
          '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
        )}
      />

      {allowClear && date && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute top-1/2 right-3 z-10 -translate-y-1/2',
            'flex h-4 w-4 items-center justify-center',
            'text-muted-foreground hover:text-destructive',
            'cursor-pointer transition-colors',
            'focus:ring-destructive focus:rounded-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
          )}
          tabIndex={-1}
          aria-label="Limpar data"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
