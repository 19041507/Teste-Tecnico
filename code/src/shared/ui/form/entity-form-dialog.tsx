import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Form } from '@/shared/ui/form'
import { UseFormReturn, FieldValues } from 'react-hook-form'
import { cn } from '@/shared/utils/cn'

type DialogSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | 'full'

interface EntityFormDialogProps<T extends FieldValues> {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  submitText?: string
  children: ReactNode
  isLoading?: boolean
  size?: DialogSize
  maxHeight?: string
  className?: string
}

export function EntityFormDialog<T extends FieldValues>({
  open,
  onClose,
  title,
  description,
  form,
  onSubmit,
  submitText = 'Salvar',
  children,
  isLoading = false,
  size = 'lg',
  maxHeight,
  className,
}: EntityFormDialogProps<T>) {
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isValid = await form.trigger()
    if (isValid) {
      form.handleSubmit(onSubmit)(e)
    }
  }

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    '6xl': 'sm:max-w-6xl',
    '7xl': 'sm:max-w-7xl',
    full: 'sm:max-w-full',
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        <Form {...form}>
          <div className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>

            <div
              className="flex flex-col gap-4"
              style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
            >
              {children}
            </div>

            <div className="space-x-2">
              <Button
                type="button"
                size="sm"
                onClick={handleFormSubmit}
                disabled={isLoading}
              >
                {submitText}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
