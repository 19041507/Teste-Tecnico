import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface SpecialButtonProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
}

export function SpecialButton({
  href,
  icon: Icon,
  title,
  description,
  iconColor = 'text-primary',
}: SpecialButtonProps) {
  return (
    <Link href={href} className="block w-auto">
      <div className="hover:bg-accent hover:text-accent-foreground flex flex-row items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-sm sm:items-center sm:gap-4 sm:p-3">
        <div className="bg-background flex aspect-square size-10 items-center justify-center rounded-md border sm:size-9">
          <Icon
            className={cn('size-6 sm:size-5', iconColor)}
            strokeWidth={1.8}
          />
        </div>

        <div className="flex flex-col gap-0 text-left sm:text-left">
          <span className="text-foreground text-sm font-medium sm:text-base">
            {title}
          </span>
          <span className="text-muted-foreground text-xs font-normal sm:text-sm">
            {description}
          </span>
        </div>
      </div>
    </Link>
  )
}
