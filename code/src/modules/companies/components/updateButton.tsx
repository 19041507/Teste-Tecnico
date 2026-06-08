'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Building } from 'lucide-react'
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
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateCompany } from '@/modules/companies/services/companyService'
import { formatCNPJ, formatPhone } from '@/shared/utils/formatters'
import {
  UpdateCompanyDto,
  updateCompanySchema,
} from '@/modules/companies/types/Company/Company/update-company.dto'
import { Company } from '@/modules/companies/types/Company/Company/base-company.dto'
import { CompanyFormTabs } from './form/CompanyFormTabs'

export default function UpdateCompanyButton({
  company,
  onClose,
}: {
  company: Company
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('company')

  const form = useForm<UpdateCompanyDto>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      companyFields: {
        registrationNumber: formatCNPJ(company.registrationNumber),
        legalName: company.legalName,
        tradeName: company.tradeName,
        phone: formatPhone(company.phone),
        address: company.address,
        isActive: company.isActive,
        legalResponsibleName: company.legalResponsibleName,
        legalResponsibleEmail: company.legalResponsibleEmail,
        legalResponsiblePhone: company.legalResponsiblePhone
          ? formatPhone(company.legalResponsiblePhone)
          : null,
        technicalResponsibleName: company.technicalResponsibleName,
        technicalResponsibleEmail: company.technicalResponsibleEmail,
        technicalResponsiblePhone: company.technicalResponsiblePhone
          ? formatPhone(company.technicalResponsiblePhone)
          : null,
      },
    },
  })

  const onSubmit = async (data: UpdateCompanyDto) => {
    try {
      await updateCompany(company.id, data)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      onClose()
      toast.success('Empresa atualizada com sucesso')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message ||
          'Erro ao atualizar empresa, tente novamente mais tarde.'
      )
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="flex h-4/5 flex-col justify-between gap-6 p-0 sm:max-w-[1200px]">
        <DialogHeader className="flex flex-row items-center gap-4 border-b p-6">
          <div className="bg-background hidden h-12 w-12 items-center justify-center rounded-full border sm:flex">
            <Building
              className="text-muted-foreground h-7 w-7"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-1">
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize as informações da empresa no sistema.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
              id="update-company-form"
            >
              <CompanyFormTabs
                form={form}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                mode="update"
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
            form="update-company-form"
            disabled={form.formState.isSubmitting}
            className="min-w-1/5"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>Salvar Alterações</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
