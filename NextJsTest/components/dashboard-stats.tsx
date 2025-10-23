"use client"

import { Card } from "@/components/ui/card"
import { Package, DollarSign } from "lucide-react"
import useSWR from "swr"
import { getAuthInfo } from "@/lib/auth-utils"
import { getOrdersByStore } from "@/lib/api-client"

export function DashboardStats() {
  const storeId = getAuthInfo()?.storeId
  const { data: orders } = useSWR(storeId ? `orders-${storeId}` : null, () => getOrdersByStore(storeId as number))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders =
    orders?.filter((order) => {
      const orderDate = new Date(order.created_at)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    }) || []

  const todayOrderCount = todayOrders.length
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total_price, 0)

  const stats = [
    {
      label: "오늘 주문",
      value: todayOrderCount.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "오늘 매출",
      value: `₩${todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
