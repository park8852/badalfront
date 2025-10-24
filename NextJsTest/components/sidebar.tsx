"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ShoppingCart, Store, UtensilsCrossed, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearAuthInfo } from "@/lib/auth-utils"

const navigation = [
  { name: "주문 관리", href: "/dashboard", icon: ShoppingCart },
  { name: "가게 관리", href: "/store", icon: Store },
  { name: "메뉴 관리", href: "/menu", icon: UtensilsCrossed },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    clearAuthInfo()
    router.push("/login")
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <aside
      className={cn(
        "hidden border-r bg-sidebar transition-all duration-300 lg:block",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* 헤더 */}
        <div className="border-b p-6">
          <div className="flex items-center justify-center">
            {!isCollapsed && (
              <div className="flex-1">
                <h1 className="text-xl font-bold text-sidebar-foreground">배달 관리</h1>
                <p className="mt-1 text-sm text-sidebar-foreground/70">사장님 대시보드</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 hover:bg-sidebar-accent/50"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                {/* 아이콘 컨테이너 고정 */}
                <span className="inline-flex h-5 w-5 items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                {/* 텍스트는 접힘 시 숨김 */}
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* 로그아웃 버튼 */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className={cn(
              "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full",
              "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            onClick={handleLogout}
            title={isCollapsed ? "로그아웃" : undefined}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center shrink-0">
              <LogOut className="h-5 w-5" />
            </span>
            {!isCollapsed && <span className="ml-3">로그아웃</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
