import { Sidebar } from "@/components/sidebar"
import { OrderList } from "@/components/order-list"
import { DashboardStats } from "@/components/dashboard-stats"

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:ml-64 p-6 lg:p-8 transition-all duration-300" id="main-content">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">주문 관리</h1>
            <p className="mt-2 text-muted-foreground">실시간으로 들어오는 주문을 확인하고 관리하세요</p>
          </div>

          <DashboardStats />
          <OrderList />
        </div>
      </main>
    </div>
  )
}
