'use client'

import * as React from 'react'
import { Upload, X, File } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface FileDropzoneProps {
  onFileChange?: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  value?: File | null
  className?: string
  placeholder?: string
  allowClear?: boolean
  error?: boolean
}

export function FileDropzone({
  onFileChange,
  accept = 'application/pdf',
  maxSizeMB = 10,
  value,
  className,
  placeholder = 'Arraste o arquivo aqui ou clique para selecionar',
  allowClear = true,
  error = false,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const validateAndSetFile = (file: File | null) => {
    if (!file) return

    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo ${maxSizeMB}MB`)
      return
    }

    onFileChange?.(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    validateAndSetFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] || null
    validateAndSetFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const triggerFileSelect = () => {
    inputRef.current?.click()
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inputRef.current) inputRef.current.value = ''
    onFileChange?.(null)
  }

  return (
    <div
      onClick={triggerFileSelect}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-invalid={error ? 'true' : undefined}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'h-full w-full rounded-md border border-dashed',
        'p-6 text-sm transition-colors',
        'cursor-pointer',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/30 hover:border-muted-foreground',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
      />

      {!value ? (
        <>
          <Upload className="text-muted-foreground mb-2 h-5 w-5" />
          <p className="text-muted-foreground text-center">{placeholder}</p>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <File className="text-muted-foreground h-5 w-5" />
          <span className="max-w-[240px] truncate text-sm">{value.name}</span>

          {allowClear && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remover arquivo"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
