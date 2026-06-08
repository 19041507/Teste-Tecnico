import React from 'react'
import { Badge } from '../badge'

interface ErrorBadgeProps {
  count: number
  maxDisplay?: number
}

export const ErrorBadge: React.FC<ErrorBadgeProps> = ({
  count,
  maxDisplay = 9,
}) => {
  if (count === 0) return null

  return (
    <Badge className="py-0.3 bg-destructive inline-flex rounded-full">
      {count > maxDisplay ? `${maxDisplay}+` : count}
    </Badge>
  )
}
