'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, User as UserIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Form } from '@/shared/ui/form'
import { updateUserSchema } from '@/modules/users/types/User/User/update-user.dto'
import { UpdateUserDto } from '@/modules/users/types/User/User/update-user.dto'
import { User } from '@/modules/users/types/User/User/base-user.dto'
import { useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@/modules/users/services/userService'
import { toast } from 'sonner'
import { Role } from '@/shared/enums/role.enum'
import { useUserFormOptions } from '@/modules/users/hooks/useUserFormOptions'
import { UserFormContent } from './form/UserFormContent'
import { useCompanyFormOptions } from '@/modules/companies'

interface EditUserButtonProps {
  user: User
  onClose: () => void
}

export default function EditUserButton({ user, onClose }: EditUserButtonProps) {
  const queryClient = useQueryClient()

  const { isAdmin, COMPANY_OPTIONS, selectedCompanyId, setSelectedCompanyId } =
    useCompanyFormOptions(user.company?.id ?? null)

  const { ROLE_OPTIONS, isCompanyContextReady } =
    useUserFormOptions({ isAdmin, selectedCompanyId })

  const form = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user.username,
      name: user.name,
      email: user.email,
      isActive: Boolean(user.isActive),
      roles: user.roles,
      companyId: user.company?.id || undefined,
    },
  })
  const { setValue, getValues } = form

  useEffect(() => {
    if (!isCompanyContextReady) return

    const currentRoles = getValues('roles') || []
    if (!currentRoles.length) return

    const allowedRoleValues = new Set(ROLE_OPTIONS.map((opt) => opt.value))
    const validRoles = currentRoles.filter((role) =>
      allowedRoleValues.has(role)
    )

    if (validRoles.length !== currentRoles.length) {
      setValue('roles', validRoles)
    }
  }, [ROLE_OPTIONS, isCompanyContextReady, setValue, getValues])

  const handleCompanyChange = (value: string | null | undefined) => {
    const id = value || null
    form.setValue('companyId', id)
    setSelectedCompanyId(id)

    if (!value) {
      form.setValue('roles', [])
    }
  }

  const handleRolesChange = (value: string[]) => {
    form.setValue('roles', value as Role[])
  }

  const onSubmit = async (data: UpdateUserDto) => {
    try {
      await updateUser(user.id, data)

      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
      toast.success('Usuário atualizado com sucesso')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message ||
          'Erro ao atualizar usuário, tente novamente mais tarde.'
      )
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="flex h-4/5 flex-col justify-between gap-6 p-0 sm:max-w-[800px]">
        <DialogHeader className="flex flex-row items-center gap-4 border-b p-6">
          <div className="bg-background hidden h-12 w-12 items-center justify-center rounded-full border sm:flex">
            <UserIcon
              className="text-muted-foreground h-7 w-7"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-1">
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário no sistema.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
              id="update-user-form"
            >
              <UserFormContent
                form={form}
                COMPANY_OPTIONS={COMPANY_OPTIONS}
                ROLE_OPTIONS={ROLE_OPTIONS}
                onCompanyChange={handleCompanyChange}
                onRolesChange={handleRolesChange}
                showPasswordField={true}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="space-x-2 p-6 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={form.formState.isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form="update-user-form"
            disabled={form.formState.isSubmitting}
            className="min-w-[120px]"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </div>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
