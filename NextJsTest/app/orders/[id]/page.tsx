"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Package } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { getOrderDetail } from "@/lib/api-client"
import { use } from "react"
import { Sidebar } from "@/components/sidebar"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const orderId = Number.parseInt(id)

  const { data: orderDetails, error, isLoading } = useSWR(`order-${orderId}`, () => getOrderDetail(orderId))

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">주문 상세</h1>
              <p className="mt-1 text-muted-foreground">주문번호: #{orderId}</p>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">주문 상세를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <p className="text-destructive">주문 상세를 불러오는데 실패했습니다.</p>
            </div>
          )}

          {orderDetails && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">주문 정보</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">주문 시간</p>
                      <p className="font-medium">{new Date(orderDetails.created_at).toLocaleString("ko-KR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">수량</p>
                      <p className="font-medium">{orderDetails.quantity}개</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">메뉴 정보</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded-md bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={orderDetails.menu.thumbnail || "/placeholder.svg"}
                        alt={orderDetails.menu.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{orderDetails.menu.name}</p>
                      <p className="font-medium mt-2">{orderDetails.menu.price.toLocaleString()}원</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">단가</span>
                      <span>{orderDetails.menu.price.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">수량</span>
                      <span>{orderDetails.quantity}개</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>총 금액</span>
                      <span>{orderDetails.total_price.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
