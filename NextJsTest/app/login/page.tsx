"use client"

import { useRouter } from "next/navigation"
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
      console.log('로그인 성공 후 대시보드로 이동');
      router.push("/dashboard")
  }

  return <LoginPage onPageChange={handlePageChange} onLoginSuccess={handleLoginSuccess} />
}
