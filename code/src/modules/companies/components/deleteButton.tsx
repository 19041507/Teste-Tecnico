'use client'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteCompany } from '@/modules/companies/services/companyService'

interface DeleteCompanyButtonProps {
  companyId: string
  onClose: () => void
}

export default function DeleteCompanyButton({
  companyId,
  onClose,
}: DeleteCompanyButtonProps) {
  const queryClient = useQueryClient()

  const onSubmit = async (companyId: string) => {
    try {
      await deleteCompany(companyId)
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['specialFields'] })
      queryClient.invalidateQueries({ queryKey: ['approvalFlows'] })
      onClose()
      toast.success('Empresa excluída com sucesso')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || 'Erro ao excluir empresa, tente novamente mais tarde.'
      )
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="flex flex-col p-0 sm:max-w-[450px]">
        <DialogHeader className="p-6">
          <div className="space-y-2">
            <DialogTitle>Excluir Empresa</DialogTitle>
            <DialogDescription className="overflow-x-clip">
              Tem certeza que deseja excluir a empresa? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="space-x-2 border-t p-6">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onSubmit(companyId)}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
