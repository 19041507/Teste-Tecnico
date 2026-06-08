'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CarFront, Loader2, Plus } from 'lucide-react'
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
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Form } from '@/shared/ui/form'
import {
  CreateVehicleDto,
  createVehicleSchema,
} from '@/modules/vehicles/types/Vehicle/create-vehicle.dto'
import { createVehicle } from '@/modules/vehicles/services/vehicleService'
import { useVehicleFormOptions } from '@/modules/vehicles/hooks/useVehicleFormOptions'
import { VehicleFormContent } from './form/VehicleFormContent'

export default function CreateVehicleButton() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { COMPANY_OPTIONS, VEHICLE_TYPE_OPTIONS, setSelectedCompanyId } =
    useVehicleFormOptions()

  const form = useForm<CreateVehicleDto>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      companyId: null,
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      isActive: true,
      description: null,
    },
  })

  const handleCompanyChange = (value: string | null | undefined) => {
    const companyId = value || null
    form.setValue('companyId', companyId, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setSelectedCompanyId(companyId)
  }

  const onSubmit = async (data: CreateVehicleDto) => {
    if (!data.companyId) {
      form.setError('companyId', {
        type: 'required',
        message: 'Empresa é obrigatória',
      })
      return
    }

    try {
      await createVehicle(data)
      await queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      form.reset()
      setOpen(false)
      toast.success('Veículo criado com sucesso')
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Erro ao criar veículo, tente novamente mais tarde.'
      toast.error(message)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)

    if (!isOpen) {
      form.reset()
      setSelectedCompanyId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Criar Veículo
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-4/5 flex-col justify-between gap-6 p-0 sm:max-w-[900px]">
        <DialogHeader className="flex flex-row items-center gap-4 border-b p-6">
          <div className="bg-background hidden h-12 w-12 items-center justify-center rounded-full border sm:flex">
            <CarFront
              className="text-muted-foreground h-7 w-7"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-1">
            <DialogTitle>Criar Veículo</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para cadastrar um novo veículo.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 px-6">
          <Form {...form}>
            <form
              id="create-vehicle-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
            >
              <VehicleFormContent
                form={form}
                companyOptions={COMPANY_OPTIONS}
                vehicleTypeOptions={VEHICLE_TYPE_OPTIONS}
                onCompanyChange={handleCompanyChange}
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
            form="create-vehicle-form"
            disabled={form.formState.isSubmitting}
            className="min-w-[130px]"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Criar Veículo'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
