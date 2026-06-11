'use client'

import { ReactNode, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '../button'

interface FormSectionProps {
  title?: string
  children: ReactNode
  action?: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}

export function FormSection({
  title,
  children,
  action,
  collapsible = false,
  defaultOpen = true,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="flex flex-col gap-0">
      {title && (
        <div className="flex w-full items-center gap-4">
          <span className="text-lg font-medium whitespace-nowrap">{title}</span>
          <div className="mt-1 flex-1 border-b" />

          {action && <div>{action}</div>}

          {collapsible && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <ChevronRight
                className={`size-5 transition-transform duration-200 ${
                  isOpen ? 'rotate-90' : ''
                }`}
              />
            </Button>
          )}
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-4 pt-5">{children}</div>
      </div>
    </div>
  )
}
