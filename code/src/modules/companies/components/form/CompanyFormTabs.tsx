'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { FormSection } from '@/shared/ui/form/form-section'
import { Input } from '@/shared/ui/input'
import { Switch } from '@/shared/ui/switch'
import { formatCNPJ, formatPhone } from '@/shared/utils/formatters'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateCompanyDto } from '@/modules/companies/types/Company/Company/create-company.dto'
import type { UpdateCompanyDto } from '@/modules/companies/types/Company/Company/update-company.dto'

export interface CompanyFormTabsProps {
  form: UseFormReturn<CreateCompanyDto> | UseFormReturn<UpdateCompanyDto>
  activeTab: string
  onTabChange: (value: string) => void
  mode: 'create' | 'update'
}

export function CompanyFormTabs({
  form,
  activeTab,
  onTabChange,
}: CompanyFormTabsProps) {
  const typedForm = form as UseFormReturn<CreateCompanyDto>

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="flex min-h-0 flex-1 flex-col"
    >
      <TabsList className="w-full overflow-x-auto">
        <TabsTrigger value="company">Empresa</TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-y-auto pr-2">
        <TabsContent value="company">
          <div className="mt-4 flex flex-col gap-10">
            <FormSection title="Informações da Empresa">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={typedForm.control}
                  name="companyFields.registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(formatCNPJ(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={typedForm.control}
                  name="companyFields.legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={typedForm.control}
                  name="companyFields.tradeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Fantasia *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={typedForm.control}
                  name="companyFields.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(formatPhone(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={typedForm.control}
                name="companyFields.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={typedForm.control}
                name="companyFields.isActive"
                render={({ field }) => (
                  <FormItem className="mt-1 flex items-center space-x-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormLabel>Ativa</FormLabel>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Responsável Legal">
              <FormField
                control={typedForm.control}
                name="companyFields.legalResponsibleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável Legal</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value.trim() === '' ? null : e.target.value
                          )
                        }}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={typedForm.control}
                  name="companyFields.legalResponsibleEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail do Responsável Legal</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          onChange={(e) => {
                            field.onChange(
                              e.target.value.trim() === ''
                                ? null
                                : e.target.value
                            )
                          }}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={typedForm.control}
                  name="companyFields.legalResponsiblePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone do Responsável Legal</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            const v = formatPhone(e.target.value)
                            field.onChange(v.trim() === '' ? null : v)
                          }}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection title="Responsável Técnico">
              <FormField
                control={typedForm.control}
                name="companyFields.technicalResponsibleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável Técnico</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value.trim() === '' ? null : e.target.value
                          )
                        }}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={typedForm.control}
                  name="companyFields.technicalResponsibleEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail do Responsável Técnico</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          onChange={(e) => {
                            field.onChange(
                              e.target.value.trim() === ''
                                ? null
                                : e.target.value
                            )
                          }}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={typedForm.control}
                  name="companyFields.technicalResponsiblePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone do Responsável Técnico</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            const v = formatPhone(e.target.value)
                            field.onChange(v.trim() === '' ? null : v)
                          }}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
