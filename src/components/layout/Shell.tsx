'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Menu,
  Bell,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Estimates', href: '/estimates', icon: FileText },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out z-20",
          isSidebarOpen ? "w-64" : "w-20"
        )}
        role="navigation"
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  pathname === item.href 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={cn(
                  "ml-3 transition-opacity duration-300 overflow-hidden whitespace-nowrap",
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* User Section / Bottom */}
          <div className="p-4 border-t border-sidebar-border">
             <div className="flex items-center">
                <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className={cn(
                  "ml-3 overflow-hidden transition-opacity duration-300",
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}>
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs text-sidebar-foreground/60 mt-1">Professional</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar / Navbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 z-10" role="banner">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">
              {navItems.find(item => item.href === pathname)?.name || 'App'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}