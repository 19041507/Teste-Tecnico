'use client'

import { useState } from 'react'
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
import { SelectCombobox } from '@/shared/ui/select-combobox'
import { MultiselectCombobox } from '@/shared/ui/multi-select-combobo'
import { Button } from '@/shared/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { Can } from '@/core/permissions/context/abilityContext'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateUserDto } from '@/modules/users/types/User/User/create-user.dto'
import type { UpdateUserDto } from '@/modules/users/types/User/User/update-user.dto'

type Option = { value: string; label: string }

export interface UserFormContentProps {
  form: UseFormReturn<CreateUserDto> | UseFormReturn<UpdateUserDto>
  COMPANY_OPTIONS: Option[]
  ROLE_OPTIONS: Option[]
  onCompanyChange: (value: string | null | undefined) => void
  onRolesChange: (value: string[]) => void
  showPasswordField?: boolean
}

export function UserFormContent({
  form,
  COMPANY_OPTIONS,
  ROLE_OPTIONS,
  onCompanyChange,
  onRolesChange,
  showPasswordField = true,
}: UserFormContentProps) {
  const [showPassword, setShowPassword] = useState(false)
  const typedForm = form as UseFormReturn<CreateUserDto>

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <div className="flex flex-col gap-6">
        <FormSection title="Identificação do Usuário">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="grid grid-cols-1 gap-4">
                <Can I="manage" a="Company">
                  <FormField
                    control={typedForm.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa</FormLabel>
                        <FormControl>
                          <SelectCombobox
                            options={COMPANY_OPTIONS}
                            value={field.value || ''}
                            onValueChange={onCompanyChange}
                            showSearch={true}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </Can>

                <FormField
                  control={typedForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={typedForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={typedForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={typedForm.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo *</FormLabel>
                  <FormControl>
                    <MultiselectCombobox
                      options={ROLE_OPTIONS}
                      value={field.value}
                      onValueChange={onRolesChange}
                      showSearch={false}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {showPasswordField && (
              <FormField
                control={typedForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          onChange={(e) => {
                            const v = e.target.value
                            field.onChange(
                              v.trim() === '' ? undefined : v
                            )
                          }}
                          value={field.value ?? ''}
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="text-foreground-muted h-4 w-4" />
                          ) : (
                            <Eye className="text-foreground-muted h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={typedForm.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="col-span-2 mt-1 flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mt-0">Ativo</FormLabel>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </FormSection>
      </div>
    </div>
  )
}
