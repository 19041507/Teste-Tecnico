'use client'

import Image from 'next/image'
import { Label } from './label'
import { FieldHelpTooltip } from '@/shared/ui/form/field-help-tooltip'

interface ImageWithCaption {
  url?: string | null
  caption?: string | null
}

interface ImageInputFieldProps {
  label?: string
  id?: string
  images?: ImageWithCaption[] | null
  className?: string
  helpTooltipText?: string
  helpTooltipLabel?: string
}

export function ImageInputField({
  images = [],
  className = '',
  label,
  id,
  helpTooltipText,
  helpTooltipLabel,
}: ImageInputFieldProps) {
  const safeImages = Array.isArray(images)
    ? images.filter(
        (img) => img && typeof img.url === 'string' && img.url.trim() !== ''
      )
    : []

  const hasImages = safeImages.length > 0

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center gap-1.5">
          <Label htmlFor={id}>{label}</Label>
          {helpTooltipText && (
            <FieldHelpTooltip
              label={helpTooltipLabel ?? label}
              text={helpTooltipText}
            />
          )}
        </div>
      )}

      <div
        className={`bg-background flex min-h-[36px] flex-wrap items-start gap-3 rounded-md border ${hasImages ? 'p-5 px-3' : 'p-0'} ${className}`}
      >
        {hasImages
          ? safeImages.map((img, index) => (
              <div
                key={index}
                className="flex w-[100px] flex-col items-center gap-2"
              >
                <div className="relative h-[80px] w-[80px] overflow-hidden">
                  <Image
                    src={img.url!}
                    alt={img.caption || `Imagem ${index + 1}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                {img.caption && (
                  <span className="text-center text-sm font-medium">
                    {img.caption}
                  </span>
                )}
              </div>
            ))
          : null}
      </div>
    </div>
  )
}
