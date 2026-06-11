'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { CircleHelp } from 'lucide-react'

import { TooltipContent } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils/cn'

export interface FieldHelpTooltipProps {
  text: string
  label: string
  className?: string
  side?: React.ComponentProps<typeof TooltipPrimitive.Content>['side']
}

export function FieldHelpTooltip({
  text,
  label,
  className,
  side,
}: FieldHelpTooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground inline-flex shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Ajuda: ${label}`}
        >
          <CircleHelp className="size-3.5" aria-hidden />
        </button>
      </TooltipPrimitive.Trigger>
      <TooltipContent side={side} className={cn('max-w-xs', className)}>
        {text}
      </TooltipContent>
    </TooltipPrimitive.Root>
  )
}
