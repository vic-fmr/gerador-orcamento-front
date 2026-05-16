import Link from 'next/link'
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  CreditCard,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const stats = [
  { 
    name: 'Pending', 
    value: '$12,450', 
    count: 5, 
    icon: Clock, 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-500/10' 
  },
  { 
    name: 'Approved', 
    value: '$45,200', 
    count: 12, 
    icon: CheckCircle2, 
    color: 'text-green-500', 
    bg: 'bg-green-500/10' 
  },
  { 
    name: 'Paid', 
    value: '$32,100', 
    count: 8, 
    icon: CreditCard, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10' 
  },
]

export default function Home() {
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
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Estimate #100{i} - Kitchen Renovation</p>
                        <p className="text-xs text-muted-foreground">Client: Global Tech Inc.</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-semibold">$5,200.00</p>
                       <p className="text-[10px] text-yellow-600 font-medium bg-yellow-100 px-1.5 py-0.5 rounded-full inline-block">Pending</p>
                    </div>
                  </div>
                ))}
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

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  )
}
