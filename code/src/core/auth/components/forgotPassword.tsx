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
import { Input } from '@/shared/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { requestPasswordReset } from '@/core/auth/services/passwordResetService'
import {
  RequestPasswordResetDto,
  requestPasswordResetSchema,
} from '@/core/auth/types/password-reset'

export function ForgotPasswordPopup({ onClose }: { onClose: () => void }) {
  const form = useForm<RequestPasswordResetDto>({
    resolver: zodResolver(requestPasswordResetSchema),
  })

  const onSubmit = async (data: RequestPasswordResetDto) => {
    try {
      await requestPasswordReset(data)

      toast.success('E-mail de redefinição de senha enviado com sucesso.')
      onClose()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || 'Ocorreu um erro. Tente novamente mais tarde.'
      )
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="flex flex-col justify-between gap-6 p-0 sm:max-w-[450px]">
        <DialogHeader className="flex flex-row items-center gap-4 border-b p-6">
          <div className="w-full space-y-1">
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              Forneça o e-mail associado à sua conta.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
              id="request-password-reset-form"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="space-x-2 p-6 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={form.formState.isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form="request-password-reset-form"
            disabled={form.formState.isSubmitting}
            className="min-w-2/5"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>Redefinir senha</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
