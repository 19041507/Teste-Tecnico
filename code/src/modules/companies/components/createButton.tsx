'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Plus, Building } from 'lucide-react'
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
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  CreateCompanyDto,
  createCompanySchema,
} from '@/modules/companies/types/Company/Company/create-company.dto'
import { createCompany } from '@/modules/companies/services/companyService'
import { CompanyFormTabs } from './form/CompanyFormTabs'

export default function CreateCompanyButton() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('company')

  const form = useForm<CreateCompanyDto>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      companyFields: {
        registrationNumber: '',
        legalName: '',
        tradeName: '',
        address: '',
        isActive: true,
      },
    },
  })

  const onSubmit = async (data: CreateCompanyDto) => {
    try {
      await createCompany(data)

      form.reset()
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      setOpen(false)
      toast.success('Empresa criada com sucesso')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || 'Erro ao criar empresa, tente novamente mais tarde.'
      )
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setActiveTab('company')
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
          Criar Empresa
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-4/5 flex-col justify-between gap-6 p-0 sm:max-w-[1200px]">
        <DialogHeader className="flex flex-row items-center gap-4 border-b p-6">
          <div className="bg-background hidden h-12 w-12 items-center justify-center rounded-full border sm:flex">
            <Building
              className="text-muted-foreground h-7 w-7"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-1">
            <DialogTitle>Criar Empresa</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar uma nova empresa no sistema.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
              id="create-company-form"
            >
              <CompanyFormTabs
                form={form}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                mode="create"
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
            form="create-company-form"
            disabled={form.formState.isSubmitting}
            className="min-w-1/5"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>Criar Empresa</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
