import React from 'react'
import { TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ErrorBadge } from './error-badge'
import { TabErrorCounts } from '@/shared/utils/form'

interface TabConfig {
  value: string
  label: string
}

interface TabsWithErrorsProps {
  tabs: TabConfig[]
  errorCounts: TabErrorCounts
  className?: string
}

export const TabsListWithErrors: React.FC<TabsWithErrorsProps> = ({
  tabs,
  errorCounts,
  className,
}) => {
  return (
    <TabsList className={className}>
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="flex items-center"
        >
          {tab.label}
          <ErrorBadge count={errorCounts[tab.value] || 0} />
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

interface TabsTriggerWithErrorsProps {
  value: string
  children: React.ReactNode
  errorCount: number
  className?: string
}

export const TabsTriggerWithErrors: React.FC<TabsTriggerWithErrorsProps> = ({
  value,
  children,
  errorCount,
  className,
}) => {
  return (
    <TabsTrigger
      value={value}
      className={`flex items-center ${className || ''}`}
    >
      {children}
      <ErrorBadge count={errorCount} />
    </TabsTrigger>
  )
}
