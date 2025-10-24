"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthInfo, clearAuthInfo } from "@/lib/auth-utils"
import { Smartphone, Download, QrCode, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MobileAppPage() {
  const router = useRouter()
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = getAuthInfo()
    setAuthInfo(auth)
    setIsLoading(false)

    // USER가 아닌 경우 대시보드로 리다이렉트
    if (auth && auth.role !== "USER") {
      router.replace("/dashboard")
    }
  }, [router])

  const handleGoBack = () => {
    // 로그아웃 + 로그인 페이지로 이동
    clearAuthInfo()
    router.push("/login")
  }

  const handleDownloadApp = () => {
    // 실제 앱스토어 링크로 변경
    window.open("https://play.google.com/store", "_blank")
  }

  const handleDownloadIOS = () => {
    // 실제 앱스토어 링크로 변경
    window.open("https://apps.apple.com", "_blank")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!authInfo || authInfo.role !== "USER") {
    return null
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/mobile_bg.jpg')" }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* 헤더 */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/80 bg-white/90 border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              사장님 계정으로 다시 로그인하기
            </Button>
            
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 mr-8">
        <div className="text-center mb-12 mr-8">
          <Image 
            src="/logo_black_in"
            alt="바로배달 로고" 
            width={700} 
            height={100}
            className="mx-auto mb-6"
          />
          
          <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-lg">
            언제 어디서나 간편하게 주문하세요!<br />
            모바일 앱에서 더 빠르고 편리한 배달 서비스를 경험해보세요.
          </p>
        </div>

        {/* 주요 기능 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mr-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">빠른 주문</h3>
            <p className="text-gray-600 text-sm">
              원클릭으로 간편하게 주문하고 실시간으로 배달 상태를 확인하세요.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">QR 코드 주문</h3>
            <p className="text-gray-600 text-sm">
              QR 코드를 스캔하여 메뉴를 확인하고 바로 주문할 수 있습니다.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">푸시 알림</h3>
            <p className="text-gray-600 text-sm">
              주문 상태 변경, 할인 정보 등을 실시간으로 알려드립니다.
            </p>
          </div>
        </div>

        {/* 다운로드 섹션 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8 mb-8 mr-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              지금 다운로드하세요
            </h2>
            <p className="text-gray-600">
              iOS와 Android 모두 지원합니다
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownloadApp}
              className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">G</span>
              </div>
              <div className="text-left">
                <div className="text-xs opacity-80">GET IT ON</div>
                <div className="text-sm font-bold">Google Play</div>
              </div>
            </Button>

            <Button
              onClick={handleDownloadIOS}
              className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <div className="text-left">
                <div className="text-xs opacity-80">Download on the</div>
                <div className="text-sm font-bold">App Store</div>
              </div>
            </Button>
          </div>
        </div>

        
      </main>
    </div>
  )
}
