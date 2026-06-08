'use client'

import type { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { FormSection } from '@/shared/ui/form/form-section'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Switch } from '@/shared/ui/switch'
import { SelectCombobox } from '@/shared/ui/select-combobox'
import { Can } from '@/core/permissions/context/abilityContext'
import type { CreateVehicleDto } from '@/modules/vehicles/types/Vehicle/create-vehicle.dto'
import type { UpdateVehicleDto } from '@/modules/vehicles/types/Vehicle/update-vehicle.dto'

interface Option {
  value: string
  label: string
}

interface VehicleFormContentProps {
  form: UseFormReturn<CreateVehicleDto> | UseFormReturn<UpdateVehicleDto>
  companyOptions: Option[]
  vehicleTypeOptions: Option[]
  onCompanyChange: (value: string | null | undefined) => void
}

export function VehicleFormContent({
  form,
  companyOptions,
  vehicleTypeOptions,
  onCompanyChange,
}: VehicleFormContentProps) {
  const typedForm = form as UseFormReturn<CreateVehicleDto>

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <div className="flex flex-col gap-6 pb-2">
        <FormSection title="Identificação do Veículo">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Can I="manage" a="Company">
              <FormField
                control={typedForm.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Empresa *</FormLabel>
                    <FormControl>
                      <SelectCombobox
                        options={companyOptions}
                        value={field.value || ''}
                        onValueChange={onCompanyChange}
                        placeholder="Selecione a empresa responsável"
                        searchPlaceholder="Buscar empresa..."
                        showSearch
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </Can>

            <FormField
              control={typedForm.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={10}
                      placeholder="ABC-1234"
                      className="uppercase"
                      onChange={(event) =>
                        field.onChange(event.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={typedForm.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Veículo *</FormLabel>
                  <FormControl>
                    <SelectCombobox
                      options={vehicleTypeOptions}
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      placeholder="Selecione o tipo"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={typedForm.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex.: Volkswagen" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={typedForm.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex.: Gol" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={typedForm.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1900}
                      max={new Date().getFullYear() + 1}
                      value={field.value ?? ''}
                      onChange={(event) => {
                        const value = event.target.value
                        field.onChange(value === '' ? undefined : Number(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={typedForm.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-end pb-2">
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel className="mt-0">Veículo ativo</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        Define se o veículo está disponível para operação.
                      </p>
                    </div>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Informações Complementares">
          <FormField
            control={typedForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                    rows={5}
                    maxLength={500}
                    placeholder="Adicione observações sobre uso, condição ou finalidade do veículo."
                    className="resize-none"
                  />
                </FormControl>
                <div className="flex items-center justify-between gap-2">
                  <FormMessage className="text-xs" />
                  <span className="text-muted-foreground ml-auto text-xs">
                    {(field.value ?? '').length}/500
                  </span>
                </div>
              </FormItem>
            )}
          />
        </FormSection>
      </div>
    </div>
  )
}
