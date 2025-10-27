"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthInfo } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Calendar,
  User,
  Megaphone,
  Search,
  ArrowLeft
} from "lucide-react"

interface Notice {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
  isImportant: boolean
}

const NoticePage = () => {
  const router = useRouter()
  const [authInfo, setAuthInfo] = useState(getAuthInfo())
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // 인증 확인
    if (!authInfo) {
      router.replace("/login")
      return
    }

    loadNotices()
  }, [authInfo, router])

  const loadNotices = async () => {
    try {
      // TODO: 실제 API 연동
      // 임시 데이터
      const mockNotices: Notice[] = [
        {
          id: 1,
          title: "시스템 점검 안내",
          content: "2024년 1월 15일 오전 2시부터 4시까지 시스템 점검이 진행됩니다. 이용에 불편을 드려 죄송합니다.\n\n점검 시간: 2024년 1월 15일 오전 2시 ~ 4시\n영향 범위: 전체 서비스 일시 중단\n\n점검 완료 후 정상 서비스가 재개됩니다.",
          author: "관리자",
          createdAt: "2024-01-10T10:00:00Z",
          isImportant: true
        },
        {
          id: 2,
          title: "새로운 기능 업데이트",
          content: "주문 관리 기능이 개선되었습니다. 더욱 편리한 주문 처리가 가능합니다.\n\n주요 개선사항:\n- 주문 상태 실시간 업데이트\n- 배달 완료 알림 기능 추가\n- 주문 내역 상세 조회 기능 개선",
          author: "관리자",
          createdAt: "2024-01-08T14:30:00Z",
          isImportant: false
        },
        {
          id: 3,
          title: "정기 결제 일정 안내",
          content: "매월 1일 정기 결제가 진행됩니다. 결제 실패 시 서비스 이용이 제한될 수 있습니다.\n\n결제 방법: 등록된 카드 자동 결제\n결제 실패 시: 3일 후 재시도\n문의사항: 고객센터 1588-0000",
          author: "관리자",
          createdAt: "2024-01-05T09:15:00Z",
          isImportant: true
        },
        {
          id: 4,
          title: "배달료 정책 변경 안내",
          content: "배달료 정책이 다음과 같이 변경됩니다.\n\n변경 내용:\n- 기본 배달료: 3,000원 → 2,500원\n- 무료 배달 최소 주문금액: 15,000원 → 12,000원\n- 적용일: 2024년 2월 1일부터",
          author: "관리자",
          createdAt: "2024-01-03T16:20:00Z",
          isImportant: false
        }
      ]
      setNotices(mockNotices)
    } catch (error) {
      console.error("공지사항 로드 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const importantNotices = filteredNotices.filter(notice => notice.isImportant)
  const normalNotices = filteredNotices.filter(notice => !notice.isImportant)

  const getRoleText = () => {
    if (!authInfo) return "사용자"
    switch (authInfo.role) {
      case "ADMIN": return "관리자"
      case "OWNER": return "사장님"
      case "USER": return "사용자"
      default: return "사용자"
    }
  }

  const getDashboardPath = () => {
    if (!authInfo) return "/"
    switch (authInfo.role) {
      case "ADMIN": return "/admin"
      case "OWNER": return "/dashboard"
      case "USER": return "/"
      default: return "/"
    }
  }

  if (!authInfo) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push(getDashboardPath())}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>대시보드</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <Megaphone className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">공지사항</h1>
                <p className="text-sm text-gray-500">바로배달 시스템 공지사항</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {getRoleText()}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 바 */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="공지사항 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* 중요 공지사항 */}
        {importantNotices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Badge variant="destructive" className="mr-2">중요</Badge>
              중요 공지사항
            </h2>
            <div className="space-y-4">
              {importantNotices.map((notice) => (
                <Card key={notice.id} className="border-red-200 bg-red-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg text-red-900">{notice.title}</CardTitle>
                          <Badge variant="destructive" className="text-xs">
                            중요
                          </Badge>
                        </div>
                        <CardDescription className="text-red-800 whitespace-pre-wrap">
                          {notice.content}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-red-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{notice.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(notice.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 일반 공지사항 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">일반 공지사항</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">로딩 중...</p>
            </div>
          ) : normalNotices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">공지사항이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {normalNotices.map((notice) => (
                <Card key={notice.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                    <CardDescription className="whitespace-pre-wrap">
                      {notice.content}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{notice.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(notice.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 전체 공지사항이 없을 때 */}
        {!isLoading && filteredNotices.length === 0 && searchTerm && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">검색 결과가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">다른 검색어를 시도해보세요.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default NoticePage
