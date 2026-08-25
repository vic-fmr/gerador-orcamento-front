'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FileText, Loader2, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

import { useAuthStore } from '@/store/useAuthStore'
import { register as apiRegister } from '@/lib/api'
import { ApiError, getErrorMessage } from '@/lib/api-client'

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const token = await apiRegister({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      })

      if (!token) {
        throw new Error('Token não recebido do servidor')
      }

      login({
        id: 'user-id', // Generic ID as fallback
        name: data.name,
        email: data.email,
        phone: data.phone,
      }, token)

      router.push('/')
    } catch (err) {
      console.error('Registration error:', err)
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError('Este e-mail já está em uso.')
        } else {
          setError(err.message || 'Erro ao criar conta.')
        }
      } else {
        setError(getErrorMessage(err, 'Ocorreu um erro inesperado. Tente novamente.'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Register Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-[40%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4 duration-700">
          <div className="mb-10 flex items-center gap-3">
            <Link href="/login" className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary ml-auto lg:ml-0">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EstimatePro</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">Crie sua conta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece a gerenciar seus orçamentos de forma profissional.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
              {error}
            </div>
          )}

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="João Silva"
                    className="pl-10"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
                )}
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-medium text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
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
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="pl-10"
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="font-medium text-primary hover:underline">
                Faça login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} EstimatePro. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Side: Imagem SVG */}
      <div className="relative hidden flex-1 lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

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
