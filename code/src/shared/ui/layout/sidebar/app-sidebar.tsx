'use client'

import * as React from 'react'
import { Home, Building, Users, Gauge, CarFront } from 'lucide-react'
import { NavMain } from '@/shared/ui/layout/sidebar/nav-main'
import { NavUser } from '@/shared/ui/layout/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'
import Link from 'next/link'
import { useAbility } from '@/core/permissions/context/AbilityProvider'

const data = {
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
  ],
  navManagement: [
    {
      title: 'Clientes',
      url: '/companies',
      icon: Building,
      ability: {
        I: 'read',
        a: 'Company',
      },
    },
    {
      title: 'Usuários',
      url: '/users',
      icon: Users,
      ability: {
        I: 'read',
        a: 'User',
      },
    },
    {
      title: 'Veículos',
      url: '/vehicles',
      icon: CarFront,
      ability: {
        I: 'read',
        a: 'Vehicle',
      },
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const ability = useAbility()

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader className="pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="ring-primary/40 bg-primary text-primary-foreground flex aspect-square size-10 items-center justify-center rounded-full ring-2">
                  <Gauge className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-semibold tracking-tight">
                    Motiron
                  </span>
                  <span className="truncate text-xs opacity-60">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1 pt-2">
        <NavMain title="Principal" items={data.navMain} />

        {(ability.can('read', 'User') ||
          ability.can('read', 'Company') ||
          ability.can('read', 'Vehicle')) && (
          <NavMain title="Gestão" items={data.navManagement} />
        )}
      </SidebarContent>

      <SidebarFooter className="pt-1">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
