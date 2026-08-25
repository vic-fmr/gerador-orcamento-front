'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FileText, Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { resetPassword } from '@/lib/api'
import { ApiError, getErrorMessage } from '@/lib/api-client'

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "A confirmação deve ter pelo menos 6 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError('Token de recuperação inválido ou ausente.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await resetPassword({ token, password: data.password })
      setIsSubmitted(true)
    } catch (err) {
      console.error('Reset password error:', err)
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setError('O link de recuperação expirou ou é inválido.')
        } else {
          setError(err.message || 'Erro ao redefinir senha.')
        }
      } else {
        setError(getErrorMessage(err, 'Ocorreu um erro inesperado. Tente novamente.'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!token && !isSubmitted) {
    return (
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-10 w-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Token Inválido</h2>
        <p className="mt-4 text-muted-foreground">
          O link de recuperação que você utilizou é inválido ou está incompleto.
        </p>
        <div className="mt-10">
          <Link 
            href="/forgot-password" 
            className={buttonVariants({ variant: "outline", className: "w-full" })}
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-sm lg:w-96 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4 duration-700">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <FileText className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight">EstimatePro</span>
      </div>

      {!isSubmitted ? (
        <>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Nova senha</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Crie uma nova senha segura para sua conta.
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
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  "Redefinir Senha"
                )}
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Senha alterada!</h2>
          <p className="mt-4 text-muted-foreground">
            Sua senha foi redefinida com sucesso. Você já pode entrar com sua nova senha.
          </p>
          <div className="mt-10">
            <Link 
              href="/login" 
              className={buttonVariants({ className: "w-full" })}
            >
              Ir para o login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-[40%] lg:px-20 xl:px-24">
        <Suspense fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

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
