'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { deleteVehicle } from '@/modules/vehicles/services/vehicleService'

interface DeleteVehicleButtonProps {
  vehicleId: string
  plate?: string
  onClose: () => void
}

export default function DeleteVehicleButton({
  vehicleId,
  plate,
  onClose,
}: DeleteVehicleButtonProps) {
  const queryClient = useQueryClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const onSubmit = async () => {
    try {
      setIsDeleting(true)
      await deleteVehicle(vehicleId)
      await queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      onClose()
      toast.success('Veículo excluído com sucesso')
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Erro ao excluir veículo, tente novamente mais tarde.'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="flex flex-col p-0 sm:max-w-[460px]">
        <DialogHeader className="p-6">
          <div className="space-y-2">
            <DialogTitle>Excluir Veículo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o veículo
              {plate ? ` de placa ${plate}` : ''}? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="space-x-2 border-t p-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Excluir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
