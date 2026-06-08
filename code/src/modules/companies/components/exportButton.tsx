'use client'

import { Button } from '@/shared/ui/button'
import { exportCompanies } from '@/modules/companies/services/companyService'
import { FileDown, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function ExportCompaniesButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)

    const res = await exportCompanies()

    const blob = new Blob([res], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Clientes_${new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)

    setIsLoading(false)
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-28"
      onClick={handleDownload}
      disabled={isLoading}
    >
      <>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <>
            <FileDown className="h-4 w-4" />
            Exportar
          </>
        )}
      </>
    </Button>
  )
}
