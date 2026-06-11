'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CarFront, Loader2 } from 'lucide-react'
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
import { Form } from '@/shared/ui/form'
import { Vehicle } from '@/modules/vehicles/types/Vehicle/base-vehicle.dto'
import {
  UpdateVehicleDto,
  updateVehicleSchema,
} from '@/modules/vehicles/types/Vehicle/update-vehicle.dto'
import { updateVehicle } from '@/modules/vehicles/services/vehicleService'
import { useVehicleFormOptions } from '@/modules/vehicles/hooks/useVehicleFormOptions'
import { VehicleFormContent } from './form/VehicleFormContent'

interface UpdateVehicleButtonProps {
  vehicle: Vehicle
  onClose: () => void
}

export default function UpdateVehicleButton({
  vehicle,
  onClose,
}: UpdateVehicleButtonProps) {
  const queryClient = useQueryClient()
  const { COMPANY_OPTIONS, VEHICLE_TYPE_OPTIONS, setSelectedCompanyId } =
    useVehicleFormOptions(vehicle.companyId)

  const form = useForm<UpdateVehicleDto>({
    resolver: zodResolver(updateVehicleSchema),
    defaultValues: {
      companyId: vehicle.companyId,
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      vehicleType: vehicle.vehicleType,
      isActive: vehicle.isActive,
      description: vehicle.description,
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

  const onSubmit = async (data: UpdateVehicleDto) => {
    if (!data.companyId) {
      form.setError('companyId', {
        type: 'required',
        message: 'Empresa é obrigatória',
      })
      return
    }

    try {
      await updateVehicle(vehicle.id, data)
      await queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      onClose()
      toast.success('Veículo atualizado com sucesso')
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Erro ao atualizar veículo, tente novamente mais tarde.'
      toast.error(message)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="flex h-4/5 flex-col justify-between gap-6 p-0 sm:max-w-[900px]">
        <DialogHeader className="flex flex-row items-center gap-4 border-b p-6">
          <div className="bg-background hidden h-12 w-12 items-center justify-center rounded-full border sm:flex">
            <CarFront
              className="text-muted-foreground h-7 w-7"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-1">
            <DialogTitle>Editar Veículo</DialogTitle>
            <DialogDescription>
              Atualize as informações do veículo {vehicle.plate}.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 px-6">
          <Form {...form}>
            <form
              id="update-vehicle-form"
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
            onClick={handleClose}
            disabled={form.formState.isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="update-vehicle-form"
            disabled={form.formState.isSubmitting}
            className="min-w-[150px]"
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
