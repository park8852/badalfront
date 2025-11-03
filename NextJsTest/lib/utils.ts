import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind 클래스 병합 헬퍼
// - 조건부 클래스 결합(clsx) + 충돌 규칙 병합(twMerge)
// - 사용 예) className={cn("p-2", isActive && "text-primary")}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
