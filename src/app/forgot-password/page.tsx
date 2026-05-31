'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FileText, Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { forgotPassword } from '@/lib/api'
import { ApiError } from '@/lib/api-client'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      await forgotPassword(data)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Forgot password error:', err)
      if (err instanceof ApiError) {
        if (err.status === 404) {
          // We might not want to reveal if an email exists for security reasons,
          // but if the backend returns 404, we can handle it or show the same success message.
          setIsSubmitted(true)
        } else {
          setError(`Erro no servidor: ${err.status}`)
        }
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-[40%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4 duration-700">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EstimatePro</span>
          </div>

          {!isSubmitted ? (
            <>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Recuperar senha</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Digite seu e-mail e enviaremos um link para você redefinir sua senha.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {error}
                </div>
              )}

              <div className="mt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="voce@exemplo.com"
                        className="pl-10"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Link de Recuperação"
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center text-sm">
                  <Link href="/login" className="flex items-center justify-center font-medium text-primary hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">E-mail enviado!</h2>
              <p className="mt-4 text-muted-foreground">
                Se o e-mail estiver cadastrado em nossa base, você receberá um link de recuperação em alguns minutos.
              </p>
              <div className="mt-10">
                <Link 
                  href="/login" 
                  className={buttonVariants({ className: "w-full" })}
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} EstimatePro. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Side: Imagem SVG */}
      <div className="relative hidden flex-1 lg:flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

        <Image
          src="/login-hero.svg"
          alt="Ilustração do sistema EstimatePro"
          fill
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4 duration-700 w-full h-auto object-contain drop-shadow-xl"
          priority
        />
      </div>
    </div>
  )
}
