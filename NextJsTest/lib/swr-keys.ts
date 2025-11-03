// SWR 캐시 키와 무효화 헬퍼
// - 키 생성기를 표준화하여 컴포넌트/서비스 간 캐시 충돌을 예방합니다.
// - invalidateCache는 필요한 범위만 부분 무효화하도록 구성되어 있습니다.
//   (주의) 과도한 전역 무효화는 불필요한 네트워크 트래픽을 유발할 수 있습니다.
// 사용 예)
//   useSWR(SWR_KEYS.STORE_INFO(storeId), () => getStoreInfo(storeId))
//   invalidateCache.storeMenus(storeId)
//
// 서버/빌드 시점에는 swr의 mutate가 없으므로 window 체크 후 동적 import(require)합니다.
// 이는 클라이언트에서만 실행되도록 보장하기 위함입니다.
// SWR 캐시 키 관리
export const SWR_KEYS = {
  // Store 관련
  STORE_INFO: (storeId: number) => `store-info-${storeId}`,
  STORE_MENUS: (storeId: number) => `store-menus-${storeId}`,
  
  // Order 관련
  STORE_ORDERS: (storeId: number) => `store-orders-${storeId}`,
  ORDER_DETAIL: (orderId: number) => `order-detail-${orderId}`,
  ORDERS_BY_PERIOD: (startDay: string, endDay: string) => `orders-period-${startDay}-${endDay}`,
  
  // Member 관련
  MEMBER_INFO: (memberId: number) => `member-info-${memberId}`,
} as const

// 캐시 무효화 헬퍼
export const invalidateCache = {
  storeInfo: (storeId: number) => {
    // SWR mutate를 사용하여 캐시 무효화
    if (typeof window !== 'undefined') {
      const { mutate } = require('swr')
      mutate(SWR_KEYS.STORE_INFO(storeId))
    }
  },
  
  storeMenus: (storeId: number) => {
    if (typeof window !== 'undefined') {
      const { mutate } = require('swr')
      mutate(SWR_KEYS.STORE_MENUS(storeId))
    }
  },
  
  storeOrders: (storeId: number) => {
    if (typeof window !== 'undefined') {
      const { mutate } = require('swr')
      mutate(SWR_KEYS.STORE_ORDERS(storeId))
    }
  },
  
  allStoreData: (storeId: number) => {
    if (typeof window !== 'undefined') {
      const { mutate } = require('swr')
      mutate(SWR_KEYS.STORE_INFO(storeId))
      mutate(SWR_KEYS.STORE_MENUS(storeId))
      mutate(SWR_KEYS.STORE_ORDERS(storeId))
    }
  }
}
