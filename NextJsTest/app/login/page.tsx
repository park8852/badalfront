"use client"

import { useRouter } from "next/navigation"
import { getAuthInfo } from "@/lib/auth-utils"
import LoginPage from "@/components/login-page"

export default function LoginRoute() {
  const router = useRouter()

  const handlePageChange = (page: string) => {
    if (page === "member") {
      router.push("/register")
    } else if (page === "home") {
      router.push("/")
    }
  }

  const handleLoginSuccess = () => {
    const auth = getAuthInfo()
    const hasStore = typeof auth?.storeId === "number"
    router.replace(hasStore ? "/dashboard" : "/store/create")
  }

  return <LoginPage onPageChange={handlePageChange} onLoginSuccess={handleLoginSuccess} />
}
