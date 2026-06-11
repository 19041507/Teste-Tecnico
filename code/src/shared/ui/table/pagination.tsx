import { Button } from '@/shared/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  showInfo?: boolean
  className?: string
  itemLabel?: string
  itemLabelPlural?: string
  showNumbers?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  className = '',
  itemLabel = 'resultado',
  itemLabelPlural = 'resultados',
  showNumbers = true,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    const first = 1
    const last = totalPages

    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 5, 'ellipsis', last)
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        first,
        'ellipsis',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        last
      )
    } else {
      pages.push(
        first,
        'ellipsis',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'ellipsis',
        last
      )
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const label = totalItems === 1 ? itemLabel : itemLabelPlural

  return (
    <div
      className={`flex w-full items-center justify-center md:justify-between ${className}`}
    >
      {showInfo && (
        <div className="hidden items-center gap-4 md:flex">
          <p className="text-muted-foreground text-sm">
            Mostrando{' '}
            {startItem === endItem ? (
              <>
                <span className="font-medium">{endItem}</span>
                {' de '}
                <span className="font-medium">{totalItems}</span> {label}
              </>
            ) : (
              <>
                <span className="font-medium">{startItem}</span>
                {' - '}
                <span className="font-medium">{endItem}</span>
                {' de '}
                <span className="font-medium">{totalItems}</span> {label}
              </>
            )}
          </p>
        </div>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {showNumbers &&
          visiblePages.map((page, i) =>
            typeof page === 'number' ? (
              <Button
                key={page}
                variant="ghost"
                className={
                  page === currentPage
                    ? 'bg-primary/10 text-primary h-8 w-8'
                    : 'text-muted-foreground hover:text-foreground h-8 w-8'
                }
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <span
                key={`ellipsis-${i}`}
                className="text-muted-foreground inline-block w-8 text-center"
              >
                ...
              </span>
            )
          )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
