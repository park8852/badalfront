// 공통 API 호출 유틸리티
// - 토큰 자동 주입, 공통 에러 처리, JSON 직렬화/역직렬화
// - 단순 JSON API에는 이 모듈의 apiGet/apiPost/apiPut/apiDelete 사용을 권장합니다.
import { handleAuthError } from './auth-utils'
import { API_CONFIG, createApiUrl } from './api-config'

// Get auth token from localStorage
// 로컬스토리지에서 인증 토큰을 가져옵니다(클라이언트 전용).
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

// 공통 API 호출 함수
// 공통 fetch 래퍼
// - endpoint: API_CONFIG.ENDPOINTS.* 의 상대 경로
// - options: RequestInit (headers/body/method 등)
// - 반환: 제네릭 T(JSON 파싱 결과)
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  const url = createApiUrl(endpoint)

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    // 401/403 에러 시 자동 로그아웃 및 리다이렉션
    if (handleAuthError(response)) {
      throw new Error("Authentication failed")
    }
    
    const errorText = await response.text()
    console.error(`API Error [${response.status}]:`, errorText)
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

// GET 요청 헬퍼
// GET 요청 헬퍼
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiCall<T>(endpoint, { method: 'GET' })
}

// POST 요청 헬퍼
// POST 요청 헬퍼(JSON)
export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

// PUT 요청 헬퍼
// PUT 요청 헬퍼(JSON)
export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

// DELETE 요청 헬퍼
// DELETE 요청 헬퍼
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiCall<T>(endpoint, { method: 'DELETE' })
}
