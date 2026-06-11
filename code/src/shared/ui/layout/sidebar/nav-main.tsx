'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/ui/sidebar'
import { cn } from '@/shared/utils/cn'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Can } from '@/core/permissions/context/abilityContext'

type Ability = {
  I: string
  a: string
}

type SubItem = {
  title: string
  url: string
  ability?: Ability
}

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  items?: SubItem[]
  ability?: Ability
}

export function NavMain({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname()

  const { isActiveRoute, isActiveRouteRoot } = useMemo(
    () => ({
      isActiveRoute: (href: string) => pathname === href,
      isActiveRouteRoot: (href: string) =>
        pathname.split('/')[1] === href.slice(1),
    }),
    [pathname]
  )

  const hasAbility = (ability?: Ability) => ability?.I && ability?.a

  const renderSubItem = (subItem: SubItem) => {
    const subContent = (
      <SidebarMenuSubItem key={subItem.title}>
        <SidebarMenuSubButton
          asChild
          className={cn(isActiveRoute(subItem.url) && 'text-primary')}
        >
          <Link href={subItem.url}>
            <span>{subItem.title}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )

    return subItem.ability ? (
      // @ts-expect-error: subItem.ability pode estar undefined
      <Can key={subItem.title} I={subItem.ability.I} a={subItem.ability.a}>
        {subContent}
      </Can>
    ) : (
      subContent
    )
  }

  const renderMenuItem = (item: NavItem) => {
    const isActive = isActiveRouteRoot(item.url)
    const iconClass = cn(isActive ? 'text-primary' : 'text-sidebar-foreground/60')
    const buttonClass = cn(
      'relative rounded-md transition-all',
      isActive && 'border-primary/70 bg-sidebar-accent border-l-2 pl-3 font-medium'
    )

    const content = (
      <Collapsible asChild className="group/collapsible">
        {item.items ? (
          <SidebarMenuItem>
            <CollapsibleTrigger asChild className="cursor-pointer">
              <SidebarMenuButton tooltip={item.title} className={buttonClass}>
                {item.icon && <item.icon className={iconClass} />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items
                  .filter(
                    (subItem) => !subItem.ability || hasAbility(subItem.ability)
                  )
                  .map(renderSubItem)}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link href={item.url} className={buttonClass}>
                {item.icon && <item.icon className={iconClass} />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </Collapsible>
    )

    return hasAbility(item.ability) ? (
      // @ts-expect-error: item.ability pode estar undefined
      <Can key={item.title} I={item.ability!.I} a={item.ability!.a}>
        {content}
      </Can>
    ) : (
      <div key={item.title}>{content}</div>
    )
  }

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupLabel className="transition-all duration-200 group-data-[collapsible=icon]:hidden">
        {title}
      </SidebarGroupLabel>

      <SidebarMenu className="gap-2">{items.map(renderMenuItem)}</SidebarMenu>
    </SidebarGroup>
  )
}
