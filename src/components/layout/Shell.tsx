'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import {
  LayoutDashboard,
  FileText,
  Users,
  Wrench,
  Settings,
  Menu,
  Bell,
  User,
  Moon,
  Sun,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const navItems = [
  { name: 'Painel', href: '/', icon: LayoutDashboard },
  { name: 'Orçamentos', href: '/quotes', icon: FileText },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Serviços', href: '/services', icon: Wrench },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = React.useRef(require('next/navigation').useRouter()).current
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false)
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    // Basic auth check
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login')
    }
  }, [isAuthenticated, pathname, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  React.useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem('theme')
      const initialTheme = storedTheme === 'dark' ? 'dark' : 'light'

      setTheme(initialTheme)
      document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    } catch {
      setTheme('light')
    }
  }, [])

  React.useEffect(() => {
    try {
      window.localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    } catch {
      // Ignore storage errors.
    }
  }, [theme])

  const navLinkClass = (href: string) => cn(
    "flex items-center px-3 py-2 rounded-md transition-colors",
    pathname === href
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
  )

  const navContent = (mobile = false) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={mobile ? () => setIsMobileNavOpen(false) : undefined}
          className={mobile ? navLinkClass(item.href) : cn(
            "flex items-center px-3 py-2 rounded-md transition-colors",
            pathname === item.href
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
          )}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span className={cn(
            "ml-3 transition-opacity duration-300 overflow-hidden whitespace-nowrap",
            mobile ? "opacity-100" : isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
          )}>
            {item.name}
          </span>
        </Link>
      ))}
    </>
  )

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "hidden md:flex bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out z-20 p-2",
          isSidebarOpen ? "w-64" : "w-20"
        )}
        role="navigation"
        aria-label="Barra Lateral"
      >
        <div className="flex flex-col h-full bg-sidebar-card rounded-xl overflow-hidden border border-sidebar-border shadow-sm">
          {/* Logo / Brand */}
          <div className="h-16 flex items-center px-6 border-b border-sidebar-border overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center shrink-0">
              <FileText className="text-sidebar-primary-foreground w-5 h-5" />
            </div>
            <span className={cn(
              "ml-3 font-bold text-lg transition-opacity duration-300",
              isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
            )}>
              EstimatePro
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navContent()}
          </nav>

          {/* User Section / Bottom */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className={cn(
                  "ml-3 overflow-hidden transition-opacity duration-300",
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}>
                  <p className="text-sm font-medium leading-none truncate">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-sidebar-foreground/60 mt-1 truncate">{user?.email}</p>
                </div>
              </div>
              {isSidebarOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="shrink-0 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>

      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent side="left" className="w-[82vw] max-w-xs p-0 border-r-0">
          <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
            <SheetHeader className="h-16 flex items-center px-5 border-b border-sidebar-border">
              <SheetTitle className="flex items-center gap-3 text-sidebar-foreground">
                <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center shrink-0">
                  <FileText className="text-sidebar-primary-foreground w-5 h-5" />
                </div>
                EstimatePro
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navContent(true)}
            </nav>

            <div className="p-4 border-t border-sidebar-border space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-sidebar-foreground/60 mt-1 truncate">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da conta
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar / Navbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 z-10" role="banner">
          <div className="flex items-center min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setIsMobileNavOpen(true)
                } else {
                  setIsSidebarOpen(!isSidebarOpen)
                }
              }}
              className="mr-2 md:mr-4"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-foreground truncate">
              {navItems.find(item => item.href === pathname)?.name || 'Aplicativo'}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label="Alternar tema"
              title="Alternar tema"
              onClick={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="w-5 h-5 transition-all dark:hidden" />
              <Moon className="hidden w-5 h-5 transition-all dark:block" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div
            key={pathname}
            className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-200"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}