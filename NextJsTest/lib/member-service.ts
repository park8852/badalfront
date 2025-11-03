// 회원 도메인 API 서비스
// - 회원가입/로그인/로그아웃/내 정보 조회·수정 기능 제공
// - 인증 필요 요청은 getAuthHeaders()를 통해 토큰을 자동 포함
// - 401/403 응답은 handleAuthError로 세션 정리 및 안내 후 예외 처리
import { getAuthHeaders, handleAuthError } from './auth-utils'
import { API_CONFIG, createApiUrl } from './api-config'

// 회원정보 수정 요청 타입
export interface UpdateMemberRequest {
  name: string
  email: string
  phone: string
  address: string
  birth: string
}

export const memberService = {
  // 회원가입
  async register(memberData: any) {
    try {
      const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('회원가입 API 오류:', error)
      throw error
    }
  },

  // 로그인
  async login(loginData: any) {
    try {
      const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('로그인 API 오류:', error)
      throw error
    }
  },

  // 로그아웃 (서버 세션 종료, 로컬 스토리지는 handleAuthError/상위에서 정리)
  async logout() {
    try {
      const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (handleAuthError(response)) {
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('로그아웃 API 오류:', error)
      throw error
    }
  },

  // 회원정보조회 (인증 필요)
  async getMyInfo() {
    try {
      const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AUTH.INFO), {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (handleAuthError(response)) {
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('내 정보 조회 API 오류:', error)
      throw error
    }
  },

  // 회원정보변경 (POST 방식, 인증 필요)
  async updateMyInfo(memberData: UpdateMemberRequest) {
    try {
      const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AUTH.INFO), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(memberData),
      })

      if (!response.ok) {
        if (handleAuthError(response)) {
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('내 정보 수정 API 오류:', error)
      throw error
    }
  }
}