// 인증 정보 구조체
// - token: 액세스 토큰(JWT 등)
// - userId: 사용자 식별자(표시 목적 또는 서버 요청 시 사용)
// - storeId: 선택적 매장 식별자(사장님/점주 계정일 때 바인딩)
// - role: 권한(ADMIN/USER 등)
export interface AuthInfo {
  token: string
  userId: string
  storeId?: number
  role: string
}

// 로컬스토리지에 인증 정보를 저장합니다.
// - 서버 사이드에서는 실행되지 않도록 window 존재 여부를 확인합니다.
export function setAuthInfo(data: AuthInfo): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("userId", data.userId)
    if (typeof data.storeId === "number") {
      localStorage.setItem("storeId", String(data.storeId))
    }else {
      localStorage.removeItem("storeId")
    }
    localStorage.setItem("role", data.role)
  }
}

// 로컬스토리지에서 인증 정보를 읽어 반환합니다.
// - 토큰/유저ID가 모두 있을 때만 유효한 객체를 돌려줍니다.
export function getAuthInfo(): AuthInfo | null {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken")
    const userId = localStorage.getItem("userId")
    const storeId = localStorage.getItem("storeId")
    const role = localStorage.getItem("role")

    if (token && userId) {
      return {
        token,
        userId,
        storeId: storeId ? Number(storeId) : undefined,
        role: role || "USER",
      }
    }
  }
  return null
}

// 로컬스토리지에서 인증 관련 항목을 모두 제거합니다.
export function clearAuthInfo(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    localStorage.removeItem("storeId")
    localStorage.removeItem("role")
  }
}

// 현재 인증 상태(토큰/유저ID 존재)를 boolean으로 반환합니다.
export function isAuthenticated(): boolean {
  return getAuthInfo() !== null
}

// Vite React 프로젝트와의 호환성을 위한 추가 함수들
// 인증 헤더를 반환합니다.
// - 토큰이 있으면 Authorization 헤더를 포함합니다.
// - 기본 Content-Type은 JSON입니다.
export function getAuthHeaders(): Record<string, string> {
  const authInfo = getAuthInfo()
  if (authInfo?.token) {
    return {
      Authorization: `Bearer ${authInfo.token}`,
      "Content-Type": "application/json",
    }
  }
  return {
    "Content-Type": "application/json",
  }
}

// 인증 실패(401/403) 응답을 처리합니다.
// - 세션/스토리지를 정리하고 만료 알림을 띄운 뒤 로그인 페이지로 이동합니다.
// - 호출부에서는 true 반환 시 이후 로직을 중단하고 상위에서 흐름을 제어합니다.
export function handleAuthError(response: Response): boolean {
  // 401 (Unauthorized) 또는 403 (Forbidden) 에러 처리
  if (response.status === 401 || response.status === 403) {
    clearAuthInfo()
    // 토큰 만료 시 알림 표시 후 로그인 페이지로 리다이렉션
    if (typeof window !== "undefined") {
      // 사용자에게 토큰 만료 알림 표시
      const showExpiredMessage = () => {
        // 커스텀 알림 메시지 생성
        const notification = document.createElement('div')
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #dc2626;
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 400px;
          animation: slideIn 0.3s ease-out;
        `
        notification.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 4px;">세션 만료</div>
          <div style="font-size: 14px; opacity: 0.9;">세션이 만료되었습니다. 다시 로그인해주세요.</div>
        `
        
        // CSS 애니메이션 추가
        const style = document.createElement('style')
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `
        document.head.appendChild(style)
        document.body.appendChild(notification)
        
        // 3초 후 알림 제거 및 리다이렉션
        setTimeout(() => {
          notification.style.animation = 'slideIn 0.3s ease-out reverse'
          setTimeout(() => {
            document.body.removeChild(notification)
            document.head.removeChild(style)
            window.location.href = "/login"
          }, 300)
        }, 3000)
      }
      
      showExpiredMessage()
    }
    return true
  }
  return false
}

// 로그인 상태 확인 (Vite React와 동일한 인터페이스)
// Vite React 프로젝트 호환용 별칭
export function isLoggedIn(): boolean {
  return isAuthenticated()
}