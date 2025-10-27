"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthInfo, clearAuthInfo } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  ArrowLeft,
  LogOut,
  Shield
} from "lucide-react"

interface Notice {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
  isImportant: boolean
}

const NoticeManagementPage = () => {
  const router = useRouter()
  const [authInfo, setAuthInfo] = useState(getAuthInfo())
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // 새 공지사항 폼 데이터
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    isImportant: false
  })

  useEffect(() => {
    // 인증 확인
    if (!authInfo || authInfo.role !== "ADMIN") {
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
          content: "2024년 1월 15일 오전 2시부터 4시까지 시스템 점검이 진행됩니다. 이용에 불편을 드려 죄송합니다.",
          author: "관리자",
          createdAt: "2024-01-10T10:00:00Z",
          isImportant: true
        },
        {
          id: 2,
          title: "새로운 기능 업데이트",
          content: "주문 관리 기능이 개선되었습니다. 더욱 편리한 주문 처리가 가능합니다.",
          author: "관리자",
          createdAt: "2024-01-08T14:30:00Z",
          isImportant: false
        },
        {
          id: 3,
          title: "정기 결제 일정 안내",
          content: "매월 1일 정기 결제가 진행됩니다. 결제 실패 시 서비스 이용이 제한될 수 있습니다.",
          author: "관리자",
          createdAt: "2024-01-05T09:15:00Z",
          isImportant: true
        }
      ]
      setNotices(mockNotices)
    } catch (error) {
      console.error("공지사항 로드 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNotice = async () => {
    try {
      // TODO: 실제 API 연동
      const newNoticeData: Notice = {
        id: Date.now(),
        title: newNotice.title,
        content: newNotice.content,
        author: authInfo?.userId || "관리자",
        createdAt: new Date().toISOString(),
        isImportant: newNotice.isImportant
      }
      
      setNotices(prev => [newNoticeData, ...prev])
      setNewNotice({ title: "", content: "", isImportant: false })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("공지사항 생성 실패:", error)
    }
  }

  const handleEditNotice = async () => {
    if (!editingNotice) return

    try {
      // TODO: 실제 API 연동
      setNotices(prev => 
        prev.map(notice => 
          notice.id === editingNotice.id 
            ? { ...notice, title: newNotice.title, content: newNotice.content, isImportant: newNotice.isImportant }
            : notice
        )
      )
      setEditingNotice(null)
      setNewNotice({ title: "", content: "", isImportant: false })
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("공지사항 수정 실패:", error)
    }
  }

  const handleDeleteNotice = async (noticeId: number) => {
    try {
      // TODO: 실제 API 연동
      setNotices(prev => prev.filter(notice => notice.id !== noticeId))
    } catch (error) {
      console.error("공지사항 삭제 실패:", error)
    }
  }

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice)
    setNewNotice({
      title: notice.title,
      content: notice.content,
      isImportant: notice.isImportant
    })
    setIsEditDialogOpen(true)
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

  const handleLogout = () => {
    clearAuthInfo()
    router.replace("/login")
  }

  if (!authInfo || authInfo.role !== "ADMIN") {
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
                onClick={() => router.push("/admin")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>관리자 대시보드</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">공지사항 관리</h1>
                <p className="text-sm text-gray-500">시스템 공지사항 작성 및 관리</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                관리자
              </Badge>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 상단 액션 바 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">공지사항 목록</h2>
            <Badge variant="outline" className="bg-gray-100">
              총 {notices.length}개
            </Badge>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>새 공지사항</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>새 공지사항 작성</DialogTitle>
                <DialogDescription>
                  사용자들에게 전달할 공지사항을 작성해주세요.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">제목</label>
                  <Input
                    value={newNotice.title}
                    onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="공지사항 제목을 입력하세요"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">내용</label>
                  <Textarea
                    value={newNotice.content}
                    onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="공지사항 내용을 입력하세요"
                    rows={6}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={newNotice.isImportant}
                    onChange={(e) => setNewNotice(prev => ({ ...prev, isImportant: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isImportant" className="text-sm font-medium text-gray-700">
                    중요 공지사항으로 설정
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  취소
                </Button>
                <Button 
                  onClick={handleCreateNotice}
                  disabled={!newNotice.title.trim() || !newNotice.content.trim()}
                >
                  작성하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 검색 바 */}
        <div className="mb-6">
          <Input
            placeholder="공지사항 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* 공지사항 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">로딩 중...</p>
            </div>
          ) : filteredNotices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">공지사항이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotices.map((notice) => (
              <Card key={notice.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{notice.title}</CardTitle>
                        {notice.isImportant && (
                          <Badge variant="destructive" className="text-xs">
                            중요
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="whitespace-pre-wrap">
                        {notice.content}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(notice)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>수정</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>삭제</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteNotice(notice.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
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
            ))
          )}
        </div>

        {/* 수정 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>공지사항 수정</DialogTitle>
              <DialogDescription>
                공지사항 내용을 수정해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">제목</label>
                <Input
                  value={newNotice.title}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="공지사항 제목을 입력하세요"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">내용</label>
                <Textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="공지사항 내용을 입력하세요"
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsImportant"
                  checked={newNotice.isImportant}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, isImportant: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="editIsImportant" className="text-sm font-medium text-gray-700">
                  중요 공지사항으로 설정
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                취소
              </Button>
              <Button 
                onClick={handleEditNotice}
                disabled={!newNotice.title.trim() || !newNotice.content.trim()}
              >
                수정하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default NoticeManagementPage
