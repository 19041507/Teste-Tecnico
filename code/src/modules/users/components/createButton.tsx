'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Plus, User as UserIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Form } from '@/shared/ui/form'
import { createUserSchema } from '@/modules/users/types/User/User/create-user.dto'
import { CreateUserDto } from '@/modules/users/types/User/User/create-user.dto'
import { useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/modules/users/services/userService'
import { toast } from 'sonner'
import { Role } from '@/shared/enums/role.enum'
import { useUserFormOptions } from '@/modules/users/hooks/useUserFormOptions'
import { UserFormContent } from './form/UserFormContent'
import { useCompanyFormOptions } from '@/modules/companies'

export default function CreateUserButton() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { isAdmin, COMPANY_OPTIONS, setSelectedCompanyId } =
    useCompanyFormOptions()

  const form = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      isActive: true,
      roles: [],
    },
  })
  const { setValue, getValues } = form
  const selectedCompanyId = form.watch('companyId') ?? null

  const { ROLE_OPTIONS, isCompanyContextReady } = useUserFormOptions({
    isAdmin,
    selectedCompanyId,
  })

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

  const onSubmit = async (data: CreateUserDto) => {
    try {
      await createUser(data)

      form.reset()
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setOpen(false)
      toast.success('Usuário criado com sucesso')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || 'Erro ao criar usuário, tente novamente mais tarde.'
      )
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Criar Usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-4/5 flex-col justify-between gap-6 p-0 sm:max-w-[800px]">
        <DialogHeader className="flex flex-row items-center gap-4 border-b p-6">
          <div className="bg-background hidden h-12 w-12 items-center justify-center rounded-full border sm:flex">
            <UserIcon
              className="text-muted-foreground h-7 w-7"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-1">
            <DialogTitle>Criar Usuário</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar um novo usuário no sistema.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
              id="create-user-form"
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
            onClick={() => handleOpenChange(false)}
            disabled={form.formState.isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form="create-user-form"
            disabled={form.formState.isSubmitting}
            className="min-w-1/5"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>Criar Usuário</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
