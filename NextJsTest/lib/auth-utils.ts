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
    if (data.storeId) {
      localStorage.setItem("storeId", String(data.storeId))
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
