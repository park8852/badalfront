"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { getOrdersByStore } from "@/lib/api-client"

function getTimeAgo(dateString: string) {
  const now = new Date()
  const orderTime = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60))

  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}시간 전`
  return `${Math.floor(diffInHours / 24)}일 전`
}

export function OrderList() {
  const storeId = 1 // TODO: Get from auth context
  const { data: orders, error, isLoading } = useSWR(`orders-${storeId}`, () => getOrdersByStore(storeId))

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">최근 주문</h2>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">주문 내역을 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">주문 내역을 불러오는데 실패했습니다.</p>
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">주문 내역이 없습니다.</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={order.thumbnail || "/placeholder.svg"}
                    alt={order.menu_name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">주문 #{order.id}</span>
                    <span className="text-sm text-muted-foreground">{getTimeAgo(order.created_at)}</span>
                  </div>
                  <p className="font-medium">{order.menu_name}</p>
                  <p className="text-sm text-muted-foreground">수량: {order.quantity}개</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold">{Number(order.total_price ?? 0).toLocaleString()}원</p>
                </div>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    상세보기
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
