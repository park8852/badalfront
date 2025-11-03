import useSWR, { SWRConfiguration } from 'swr'

// SWR 전역/상황별 기본 설정 값
// - revalidateOnFocus: 포커스 시 재검증
// - refreshInterval: 폴링 주기(0이면 비활성)
// - dedupingInterval: 동일 키 중복 요청 병합 시간
// - errorRetryCount/Interval: 재시도 횟수/간격
// 페이지 특성(대시보드/실시간/정적)에 맞춰 프리셋을 분리합니다.
// 사용처에서는 <SWRConfig value={dashboardSwrConfig}>처럼 주입하거나 훅에서 개별 전달
// (주의) 과도한 폴링은 서버 부하를 유발할 수 있으므로 주기/조건을 상황에 맞게 조정하세요.
// 공통 SWR 설정
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000, // 2초 내 중복 요청 제거
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  refreshInterval: 0, // 기본적으로 자동 새로고침 비활성화
}

// 대시보드용 설정 (자동 새로고침 활성화)
export const dashboardSwrConfig: SWRConfiguration = {
  ...swrConfig,
  refreshInterval: 30000, // 30초마다 새로고침 (3초에서 변경)
  refreshWhenHidden: false, // 탭이 숨겨져 있을 때는 새로고침 안함
  refreshWhenOffline: false, // 오프라인일 때는 새로고침 안함
}

// 실시간 데이터용 설정(보다 짧은 폴링 주기)
export const realtimeSwrConfig: SWRConfiguration = {
  ...swrConfig,
  refreshInterval: 15000, // 15초마다 새로고침
  refreshWhenHidden: false,
}

// 정적 데이터용 설정(초기 로드 후 재검증 최소화)
export const staticSwrConfig: SWRConfiguration = {
  ...swrConfig,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}
