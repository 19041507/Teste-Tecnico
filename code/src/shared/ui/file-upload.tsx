'use client'

import * as React from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Input } from './input'

interface FileUploadProps {
  onFileChange?: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  value?: File | null
  className?: string
  placeholder?: string
  allowClear?: boolean
}

export function FileUpload({
  onFileChange,
  accept = 'application/pdf',
  maxSizeMB = 10,
  value,
  className,
  placeholder = 'Selecione um arquivo',
  allowClear = false,
  ...props
}: FileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file && maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo ${maxSizeMB}MB`)
      return
    }

    onFileChange?.(file)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileChange?.(null)
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('relative flex w-full', className)} {...props}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
      />

      <Upload
        className={cn(
          'absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 cursor-pointer transition-colors',
          'text-muted-foreground hover:text-foreground'
        )}
        onClick={triggerFileSelect}
      />

      <Input
        type="text"
        value={value ? value.name : ''}
        placeholder={placeholder}
        onClick={triggerFileSelect}
        readOnly
        {...props}
        className={cn(
          'pl-10',
          allowClear && value ? 'pr-10' : '',
          'cursor-pointer',
          '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
        )}
      />

      {allowClear && value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute top-1/2 right-3 z-10 -translate-y-1/2',
            'flex h-4 w-4 items-center justify-center',
            'text-muted-foreground hover:text-destructive',
            'cursor-pointer transition-colors',
            'focus:ring-destructive focus:rounded-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
          )}
          tabIndex={-1}
          aria-label="Remover arquivo"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
