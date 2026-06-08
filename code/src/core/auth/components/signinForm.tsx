'use client'

import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { SigninFormData, SigninSchema } from '@/core/auth/types/signin'
import { signin } from '@/core/auth/services/authService'
import { getSafeCallbackUrl } from '@/core/auth/safe-redirect'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ForgotPasswordPopup } from './forgotPassword'

export function SigninForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = getSafeCallbackUrl(searchParams.get('callback'))
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const form = useForm<SigninFormData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: SigninFormData) => {
    try {
      await signin(data)
      router.push(callbackUrl ?? '/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || 'Ocorreu um erro. Tente novamente mais tarde.'
      )
    }
  }

  return (
    <div>
      <Form {...form}>
        <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <Eye className="text-muted-foreground h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground ml-auto h-auto p-0 text-xs font-normal"
                onClick={(e) => {
                  e.preventDefault()
                  setShowForgotPassword(true)
                }}
              >
                Esqueceu sua senha?
              </Button>
            </div>
            <Button
              type="submit"
              form="signin-form"
              size="lg"
              className="mt-2 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>Entrar</>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {showForgotPassword && (
        <ForgotPasswordPopup onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  )
}
