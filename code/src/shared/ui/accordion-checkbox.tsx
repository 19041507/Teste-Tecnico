'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion'
import { ChevronsUpDown } from 'lucide-react'
import { Checkbox } from '@/shared/ui/checkbox'
import Image from 'next/image'
import { Badge } from '@/shared/ui/badge'

type Option = {
  code: string
  description: string
  imageUrl?: string
}

interface AccordionCheckboxProps {
  title: string
  placeholder?: string
  value?: string[]
  onValueChange: (value: string[]) => void
  options: Option[]
  disabled?: boolean
}

export function AccordionCheckbox({
  title,
  placeholder = 'Selecione uma ou mais opções',
  value = [],
  onValueChange,
  options,
  disabled = false,
}: AccordionCheckboxProps) {
  const handleChange = (checked: boolean | 'indeterminate', code: string) => {
    if (checked) {
      onValueChange([...value, code])
    } else {
      onValueChange(value.filter((c) => c !== code))
    }
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-md border px-3 shadow-xs"
    >
      <AccordionItem value={title}>
        <AccordionTrigger
          haveIcon={false}
          className="[&[data-state=open]>svg]:text-muted-foreground/50 [&[data-state=closed]>svg]:text-muted-foreground/50 flex h-9 items-center py-2 hover:no-underline"
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.map((code) => {
                const opt = options.find((o) => o.code === code)
                return (
                  <Badge
                    key={code}
                    variant="outline"
                    className="bg-gray-50 px-2 py-0.5 text-xs"
                  >
                    {opt?.description ?? code}
                  </Badge>
                )
              })}
            </div>
          ) : (
            <span className="text-muted-foreground truncate text-sm font-normal">
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="text-muted-foreground pointer-events-none size-4 shrink-0" />
        </AccordionTrigger>

        <AccordionContent>
          <div className={`grid gap-7 border-t py-10 grid-cols-4 `}>
            {options.map((option) => {
              const isChecked = value.includes(option.code)

              return (
                <label
                  key={option.code}
                  htmlFor={option.code}
                  className="flex cursor-pointer flex-col items-center space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={option.code}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleChange(checked, option.code)
                      }
                      disabled={disabled}
                    />
                    <span className="text-sm font-medium">
                      {option.description}
                    </span>
                  </div>
                  {option.imageUrl && (
                    <Image
                      src={option.imageUrl}
                      alt={option.description}
                      width={120}
                      height={120}
                      className="pointer-events-none object-contain"
                      unoptimized
                    />
                  )}
                </label>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
