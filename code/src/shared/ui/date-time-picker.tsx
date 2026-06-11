'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Calendar } from '@/shared/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover'
import { Input } from './input'

interface DateTimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial date */
  initialDate?: Date
  /** Callback when date changes */
  onDateChange?: (date: Date | undefined) => void
  /** Placeholder text when no date is selected */
  placeholder?: string
  /** Set date to end of day (23:59:59.999) */
  endOfDay?: boolean
}

export function DateTimePicker({
  className,
  initialDate,
  onDateChange,
  placeholder = 'Selecione uma data',
  endOfDay = false,
  ...props
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate)
  const [time, setTime] = React.useState<string>(
    initialDate ? format(initialDate, 'HH:mm') : '00:00'
  )
  const [dateInputValue, setDateInputValue] = React.useState<string>(
    initialDate ? format(initialDate, 'yyyy-MM-dd') : ''
  )

  const dateInputRef = React.useRef<HTMLInputElement>(null)
  const timeInputRef = React.useRef<HTMLInputElement>(null)

  const handleDateInputChange = (value: string) => {
    setDateInputValue(value)

    if (value === '') {
      setDate(undefined)
      onDateChange?.(undefined)
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
        const [hours, minutes] = time.split(':')
        combinedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
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
          const [hours, minutes] = time.split(':')
          combinedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
          onDateChange(combinedDateTime)
        }
      }
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (date && onDateChange) {
      const combinedDateTime = new Date(date)
      const [hours, minutes] = newTime.split(':')
      combinedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      onDateChange(combinedDateTime)
    }
  }

  const handleTimeIconClick = () => {
    if (timeInputRef.current) {
      timeInputRef.current.focus()
      if (timeInputRef.current.showPicker) {
        timeInputRef.current.showPicker()
      }
    }
  }

  return (
    <div className={cn('flex w-full', className)} {...props}>
      {/* Date Input */}
      <div className="relative w-1/2">
        <Popover>
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
              onSelect={handleCalendarSelect}
              captionLayout="dropdown"
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>

        <Input
          ref={dateInputRef}
          type="date"
          value={dateInputValue}
          onChange={(e) => handleDateInputChange(e.target.value)}
          placeholder={placeholder}
          {...props}
          className="aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-r-none border-r-0 pl-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
        />
      </div>

      {/* Time Input */}
      <div className="relative w-1/2">
        <Clock
          className="text-muted-foreground hover:text-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 cursor-pointer transition-colors"
          onClick={handleTimeIconClick}
        />
        <Input
          ref={timeInputRef}
          type="time"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          {...props}
          className="aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-l-none pl-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
        />
      </div>
    </div>
  )
}
