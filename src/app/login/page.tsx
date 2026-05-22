'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FileText, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { useAuthStore } from '@/store/useAuthStore'
import { login as apiLogin } from '@/lib/api'
import { ApiError } from '@/lib/api-client'

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = await apiLogin(data)
      
      if (!token) {
        throw new Error('Token não recebido do servidor')
      }

      // Extract name from email as a fallback since we don't have a user endpoint
      const name = data.email.split('@')[0]
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')

      login({
        id: 'user-id', // Generic ID as fallback
        name,
        email: data.email,
      }, token)
      
      router.push('/')
    } catch (err) {
      console.error('Login error:', err)
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('E-mail ou senha incorretos.')
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
      {/* Left Side: Login Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-[40%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EstimatePro</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre com suas credenciais para gerenciar seus orçamentos.
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
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-background px-4 text-muted-foreground">
                    Novo por aqui?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full" type="button">
                  Solicitar Acesso
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} EstimatePro. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Side: Art/Image */}
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary via-primary/80 to-secondary overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-xl space-y-6 text-center">
              <h1 className="text-5xl font-black tracking-tighter sm:text-6xl">
                Crie Orçamentos <br /> Irresistíveis.
              </h1>
              <p className="text-xl font-medium text-white/80">
                A ferramenta definitiva para profissionais que buscam excelência, agilidade e fechamento de negócios.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-12">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20 shadow-xl">
                  <p className="text-3xl font-bold">10x</p>
                  <p className="text-sm font-medium text-white/60">Mais Rápido</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20 shadow-xl">
                  <p className="text-3xl font-bold">35%</p>
                  <p className="text-sm font-medium text-white/60">Mais Conversão</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Abstract Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
              backgroundSize: '40px 40px' 
            }} 
          />
        </div>
      </div>
    </div>
  )
}
