export interface AuthInfo {
  token: string
  userId: string
  storeId?: number
  role: string
}

export function setAuthInfo(data: AuthInfo): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("userId", data.userId)
    if (typeof data.storeId === "number") {
      localStorage.setItem("storeId", String(data.storeId))
    } else {
      localStorage.removeItem("storeId")
    }
    localStorage.setItem("role", data.role)
  }
}

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

export function clearAuthInfo(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    localStorage.removeItem("storeId")
    localStorage.removeItem("role")
  }
}

export function isAuthenticated(): boolean {
  return getAuthInfo() !== null
}

// Vite React 프로젝트와의 호환성을 위한 추가 함수들
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

export function handleAuthError(response: Response): boolean {
  if (response.status === 401) {
    clearAuthInfo()
    return true
  }
  return false
}

// 로그인 상태 확인 (Vite React와 동일한 인터페이스)
export function isLoggedIn(): boolean {
  return isAuthenticated()
}