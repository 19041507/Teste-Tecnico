'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2,
  Download,
  Loader2,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAbility } from '@/core/permissions/context/AbilityProvider'
import {
  bulkDeleteVehicles,
  bulkUpdateVehicleStatus,
  exportSelectedVehicles,
} from '@/modules/vehicles/services/vehicleService'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'

interface VehicleBulkActionsProps {
  selectedIds: string[]
  onClearSelection: () => void
}

type PendingAction = 'activate' | 'deactivate' | 'delete' | 'export' | null

function downloadCsv(buffer: ArrayBuffer) {
  const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `Veiculos_selecionados_${new Date().toLocaleDateString(
    'pt-BR',
    { day: '2-digit', month: '2-digit', year: 'numeric' }
  )}.csv`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(url)
}

export function VehicleBulkActions({
  selectedIds,
  onClearSelection,
}: VehicleBulkActionsProps) {
  const ability = useAbility()
  const queryClient = useQueryClient()
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (selectedIds.length === 0) return null

  const refreshData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ])
  }

  const handleStatusChange = async (isActive: boolean) => {
    const action: PendingAction = isActive ? 'activate' : 'deactivate'

    try {
      setPendingAction(action)
      const result = await bulkUpdateVehicleStatus(selectedIds, isActive)
      await refreshData()
      onClearSelection()
      toast.success(
        `${result.updated} ${result.updated === 1 ? 'veículo atualizado' : 'veículos atualizados'} com sucesso`
      )
    } catch {
      toast.error('Não foi possível atualizar os veículos selecionados.')
    } finally {
      setPendingAction(null)
    }
  }

  const handleExport = async () => {
    try {
      setPendingAction('export')
      const response = await exportSelectedVehicles(selectedIds)
      downloadCsv(response)
      toast.success('Veículos selecionados exportados com sucesso')
    } catch {
      toast.error('Não foi possível exportar os veículos selecionados.')
    } finally {
      setPendingAction(null)
    }
  }

  const handleDelete = async () => {
    try {
      setPendingAction('delete')
      const result = await bulkDeleteVehicles(selectedIds)
      await refreshData()
      onClearSelection()
      setDeleteDialogOpen(false)
      toast.success(
        `${result.deleted} ${result.deleted === 1 ? 'veículo excluído' : 'veículos excluídos'} com sucesso`
      )
    } catch {
      toast.error('Não foi possível excluir os veículos selecionados.')
    } finally {
      setPendingAction(null)
    }
  }

  const isBusy = pendingAction !== null
  const selectedLabel =
    selectedIds.length === 1
      ? '1 veículo selecionado'
      : `${selectedIds.length} veículos selecionados`

  return (
    <div
      className="bg-muted/50 flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:px-5"
      role="region"
      aria-label="Ações em lote"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-sm font-medium">{selectedLabel}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onClearSelection}
          disabled={isBusy}
          aria-label="Limpar seleção"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isBusy}
        >
          {pendingAction === 'export' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Exportar
        </Button>

        {ability.can('update', 'Vehicle') && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(true)}
              disabled={isBusy}
            >
              {pendingAction === 'activate' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              Ativar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(false)}
              disabled={isBusy}
            >
              {pendingAction === 'deactivate' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <XCircle className="size-4" />
              )}
              Inativar
            </Button>
          </>
        )}

        {ability.can('delete', 'Vehicle') && (
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isBusy}
            >
              {pendingAction === 'delete' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Excluir
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Excluir veículos selecionados?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedIds.length === 1
                    ? 'O veículo selecionado será removido da sessão atual.'
                    : `Os ${selectedIds.length} veículos selecionados serão removidos da sessão atual.`}{' '}
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={pendingAction === 'delete'}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault()
                    void handleDelete()
                  }}
                  disabled={pendingAction === 'delete'}
                  className="bg-destructive hover:bg-destructive/90 text-white"
                >
                  {pendingAction === 'delete' && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}
