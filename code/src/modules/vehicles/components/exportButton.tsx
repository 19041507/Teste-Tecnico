'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { exportVehicles } from '@/modules/vehicles/services/vehicleService'

export default function ExportVehiclesButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      const response = await exportVehicles()
      const blob = new Blob([response], {
        type: 'text/csv;charset=utf-8',
      })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `Veiculos_${new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}.csv`
      anchor.click()
      window.URL.revokeObjectURL(url)
      toast.success('Relatório de veículos exportado com sucesso')
    } catch {
      toast.error('Não foi possível exportar os veículos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-28"
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Exportar
        </>
      )}
    </Button>
  )
}
