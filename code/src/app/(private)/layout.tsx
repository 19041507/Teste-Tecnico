import { PropsWithChildren } from 'react'
import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar'
import { AppSidebar } from '@/shared/ui/layout/sidebar/app-sidebar'
import { AbilityProvider } from '@/core/permissions/context/AbilityProvider'
import { QueryProvider } from '@/core/providers/QueryProvider'
import { AuthBootstrap } from '@/core/providers/AuthBootstrap'

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <QueryProvider>
        <AuthBootstrap />
        <AbilityProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-screen w-full overflow-hidden">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </AbilityProvider>
      </QueryProvider>
    </div>
  )
}
