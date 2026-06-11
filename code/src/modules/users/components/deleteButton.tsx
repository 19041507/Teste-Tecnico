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
import { deleteUser } from '@/modules/users/services/userService'
import { toast } from 'sonner'

interface DeleteUserButtonProps {
  userId: string
  onClose: () => void
}

export default function DeleteUserButton({
  userId,
  onClose,
}: DeleteUserButtonProps) {
  const queryClient = useQueryClient()

  const onSubmit = async (userId: string) => {
    try {
      await deleteUser(userId)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
      toast.success('Usuário excluído com sucesso')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || 'Erro ao excluir usuário, tente novamente mais tarde.'
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
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription className="overflow-x-clip">
              Tem certeza que deseja excluir o usuário? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="space-x-2 border-t p-6">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onSubmit(userId)}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
