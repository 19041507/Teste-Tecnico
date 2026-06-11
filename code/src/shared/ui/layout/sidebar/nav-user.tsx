'use client'

import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar'
import { useSession } from '@/shared/hooks/useSession'
import { logout } from '@/core/auth/services/authService'

export function NavUser() {
  const { data: user } = useSession()
  const { isMobile } = useSidebar()

  const nameParts = user?.name?.trim().split(/\s+/) ?? []
  const initials =
    nameParts.length > 0
      ? `${nameParts[0]?.charAt(0) ?? ''}${nameParts[1]?.charAt(0) ?? ''}`.toUpperCase()
      : '?'

  const handleLogout = () => logout()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarFallback className="text-primary-foreground rounded-full bg-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name ?? ''}</span>
                <span className="truncate text-xs opacity-60">{user?.username ?? ''}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="text-foreground" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
