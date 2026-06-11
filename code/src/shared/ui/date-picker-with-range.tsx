'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/shared/utils/cn'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover'

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial date range */
  initialDateRange?: DateRange
  /** Callback when date range changes */
  onDateRangeChange?: (dateRange: DateRange | undefined) => void
  /** Callback with start and end dates as separate values */
  onStartEndChange?: (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => void
  /** Width of the date picker button */
  buttonWidth?: string
  /** Number of months to display in the calendar */
  numberOfMonths?: number
  /** Placeholder text when no date is selected */
  placeholder?: string
  /** Format for displaying the date */
  dateFormat?: string
  /** Set end date to end of day (23:59:59.999) */
  endDateToEndOfDay?: boolean
}

export function DatePickerWithRange({
  className,
  initialDateRange,
  onDateRangeChange,
  onStartEndChange,
  buttonWidth = 'w-[300px]',
  numberOfMonths = 2,
  placeholder = 'Selecione uma data',
  dateFormat = 'LLL dd, y',
  endDateToEndOfDay = true,
  ...props
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDateRange || undefined
  )

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)

    if (onDateRangeChange) {
      onDateRangeChange(newDate)
    }

    if (onStartEndChange) {
      const startDate = newDate?.from
      let endDate = newDate?.to

      if (endDateToEndOfDay && endDate) {
        const adjustedEndDate = new Date(endDate)
        adjustedEndDate.setHours(23, 59, 59, 999)
        endDate = adjustedEndDate
      }

      onStartEndChange(startDate, endDate)
    }
  }

  return (
    <div className={cn('grid gap-2', className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              `${buttonWidth} justify-start text-left font-normal`,
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, dateFormat)} -{' '}
                  {format(date.to, dateFormat)}
                </>
              ) : (
                format(date.from, dateFormat)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            captionLayout="dropdown"
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
