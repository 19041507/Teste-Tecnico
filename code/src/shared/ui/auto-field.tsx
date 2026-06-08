'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { FieldHelpTooltip } from '@/shared/ui/form/field-help-tooltip'

interface AutoFieldProps {
  id: string
  label?: string
  value: string
  className?: string
  disabled?: boolean
  helpTooltipText?: string
  helpTooltipLabel?: string
}

export function AutoField({
  id,
  label,
  value,
  className = '',
  disabled = false,
  helpTooltipText,
  helpTooltipLabel,
}: AutoFieldProps) {
  const readOnly = true

  const safeValue = typeof value === 'string' ? value : (value as string)?.toString?.() ?? ''

  const containerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [shouldUseTextarea, setShouldUseTextarea] = useState(false)

  useEffect(() => {
    const input = inputRef.current
    const container = containerRef.current
    if (!input || !container) return

    const computedStyle = window.getComputedStyle(input)
    const inputWidth = input.clientWidth
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0
    const availableWidth = inputWidth - paddingLeft - paddingRight

    const tempSpan = document.createElement('span')
    tempSpan.style.position = 'absolute'
    tempSpan.style.visibility = 'hidden'
    tempSpan.style.whiteSpace = 'pre-wrap'
    tempSpan.style.wordWrap = 'break-word'
    tempSpan.style.font = computedStyle.font
    tempSpan.style.width = `${availableWidth}px`
    tempSpan.textContent = safeValue

    document.body.appendChild(tempSpan)
    const textHeight = tempSpan.getBoundingClientRect().height
    const lineHeight = parseFloat(computedStyle.lineHeight) || 1
    const numLines = Math.ceil(textHeight / lineHeight)
    document.body.removeChild(tempSpan)

    setShouldUseTextarea(numLines > 1)

    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight
    textarea.style.height = `${scrollHeight}px`
  }, [safeValue, shouldUseTextarea])

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
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
      {shouldUseTextarea ? (
        <Textarea
          ref={textareaRef}
          id={id}
          value={safeValue}
          readOnly={readOnly}
          disabled={disabled}
          className={`focus-visible:border-input resize-none overflow-hidden focus:outline-none focus-visible:ring-0 ${className}`}
        />
      ) : (
        <Input
          ref={inputRef}
          id={id}
          value={safeValue}
          readOnly={readOnly}
          className={`focus-visible:border-input truncate focus:outline-none focus-visible:ring-0 ${className}`}
          disabled={disabled}
        />
      )}
    </div>
  )
}
