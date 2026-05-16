'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  FileText as LucideFileText
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEstimateStore } from '@/store/useEstimateStore'

export default function Home() {
  const { estimates, getStats } = useEstimateStore()
  const statsData = getStats()

  const stats = [
    { 
      name: 'Pending', 
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(statsData.pending.value), 
      count: statsData.pending.count, 
      icon: Clock, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-500/10' 
    },
    { 
      name: 'Approved', 
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(statsData.approved.value), 
      count: statsData.approved.count, 
      icon: CheckCircle2, 
      color: 'text-green-500', 
      bg: 'bg-green-500/10' 
    },
    { 
      name: 'Paid', 
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(statsData.paid.value), 
      count: statsData.paid.count, 
      icon: CreditCard, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your estimates.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/estimates/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Estimate
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-full`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.count} estimates total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid for recent activity or charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-none bg-secondary/5">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest estimates and their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {estimates.slice(0, 5).map((estimate) => (
                  <div key={estimate.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <LucideFileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{estimate.title}</p>
                        <p className="text-xs text-muted-foreground">Client: {estimate.client}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-semibold">
                         {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(estimate.amount)}
                       </p>
                       <p className={cn(
                         "text-[10px] font-medium px-1.5 py-0.5 rounded-full inline-block capitalize",
                         estimate.status === 'pending' && "text-yellow-600 bg-yellow-100",
                         estimate.status === 'approved' && "text-green-600 bg-green-100",
                         estimate.status === 'paid' && "text-blue-600 bg-blue-100"
                       )}>
                         {estimate.status}
                       </p>
                    </div>
                  </div>
                ))}
                {estimates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No estimates found. Create your first one!
                  </div>
                )}
             </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-none bg-primary text-primary-foreground">
           <CardHeader>
             <CardTitle className="flex items-center justify-between">
               Revenue Growth
               <TrendingUp className="h-5 w-5" />
             </CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-4xl font-bold mb-2">+12.5%</div>
              <p className="text-primary-foreground/80 text-sm mb-6">
                Your revenue has increased by 12.5% compared to last month.
              </p>
              <Button variant="secondary" className="w-full font-semibold group">
                View Reports
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}

