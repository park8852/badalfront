"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Store, UtensilsCrossed, LogOut, PlusSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearAuthInfo } from "@/lib/auth-utils"

const navigation = [
  { name: "주문 관리", href: "/dashboard", icon: Home },
  { name: "가게 관리", href: "/store", icon: Store },
  { name: "메뉴 관리", href: "/menu", icon: UtensilsCrossed },
  { name: "가게 등록", href: "/store/create", icon: PlusSquare },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    clearAuthInfo()
    router.push("/login")
  }

  return (
    <aside className="hidden w-64 border-r bg-sidebar lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">배달 관리</h1>
          <p className="mt-1 text-sm text-sidebar-foreground/70">사장님 대시보드</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            로그아웃
          </Button>
        </div>
      </div>
    </aside>
  )
}
