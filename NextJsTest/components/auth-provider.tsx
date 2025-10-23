"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-utils"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/register"]
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!isPublicRoute && !isAuthenticated()) {
      router.push("/login")
    } else if (pathname === "/login" && isAuthenticated()) {
      router.push("/dashboard")
    } else if (pathname === "/register" && isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [pathname, router])

  return <>{children}</>
}
