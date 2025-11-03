// API 설정 중앙화
// 환경변수를 우선하고, 없으면 기본값 사용

// API 관련 설정과 엔드포인트 상수를 중앙집중 관리합니다.
// - BASE_URL: 백엔드 서버의 루트 URL (환경변수 우선)
// - ENDPOINTS: 각 도메인(인증/가게/메뉴/주문/게시판/업로드)의 상대 경로
// - ENV: 환경 플래그(개발/프로덕션)
export const API_CONFIG = {
  // 백엔드 서버 주소
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  
  // API 엔드포인트들
  ENDPOINTS: {
    // 인증 관련
    AUTH: {
      LOGIN: '/api/member/login',
      LOGOUT: '/api/member/logout',
      REGISTER: '/api/member/register',
      INFO: '/api/member/info',
    },
    
    // 가게 관련
    STORE: {
      CREATE: '/api/store/create',
      ALL: '/api/store/all',
      INFO: '/api/store/info',
      DELETE: '/api/store/delete',
    },
    
    // 메뉴 관련
    MENU: {
      CREATE: '/api/menu/create',
      STORE: '/api/menu/store',
      INFO: '/api/menu/info',
      DELETE: '/api/menu/delete',
    },
    
    // 주문 관련
    ORDER: {
      LIST: '/api/order/list',
      STORE: '/api/order/store',
      DETAIL: '/api/order',
      DAY: '/api/order/day',
      SALES: '/api/order/sales',
    },
    
    // 게시판 관련
    BOARD: {
      LIST: '/api/board',
      UPDATE: '/api/board/update',
      DELETE: '/api/board/delete',
    },
    
    // 파일 업로드
    UPLOAD: '/api/upload',
  },
  
  // 환경 정보
  ENV: {
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
  }
}

// 주어진 상대 엔드포인트를 BASE_URL과 결합해 절대 URL을 생성합니다.
// 사용 예) createApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN)
export const createApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// 환경별 로깅 설정 (개발 환경에서만 사용하도록 기본값 구성)
export const API_LOGGING = {
  ENABLED: API_CONFIG.ENV.IS_DEVELOPMENT,
  PREFIX: '[API]'
}
