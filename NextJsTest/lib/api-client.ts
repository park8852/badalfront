// API client for backend communication
import { handleAuthError } from "./auth-utils"

const API_BASE_URL = "http://192.168.72.196:8080"

// Get auth token from localStorage or cookie
function getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("authToken")
}

// Store API types
export interface StoreInfo {
    id: number
    memberId: number
    category: string
    name: string
    address: string
    phone: string
    openH: number
    openM: number
    closedH: number
    closedM: number
    thumbnail?: string  // 백엔드에서 thumbnail 사용
    createdAt: string
}

export interface UpdateStoreRequest {
    category: string
    name: string
    address: string
    phone: string
    openH: number
    openM: number
    closedH: number
    closedM: number
    thumbnail?: string  // 백엔드에서 thumbnail 사용
}

// Create Store API request type (different field names than StoreInfo)
export interface CreateStoreRequest {
    category: string
    name: string
    address: string
    phone: string
    openH: number
    openM: number
    closedH: number
    closedM: number
    createdAt: string
    thumbnail?: string  // 백엔드에서 thumbnail 사용
}

// Menu API types
export interface MenuItem {
    id: number
    storeId: number
    title: string
    content: string
    price: number
    thumbnail: string
}

export interface CreateMenuRequest {
    storeId: number
    title: string
    content: string
    price: number
    thumbnail?: string  // URL (파일 없을 때)
}

export interface UpdateMenuRequest {
    title: string
    content: string
    price: number
}

// Order API types
export interface Order {
    id: number
    memberId: number
    storeId: number
    menuId: number
    quantity: number
    totalPrice: number
    createdAt: string
    customerName: string
    customerPhone: string
    customerAddress: string
    storeName: string
    storeAddress: string
    menuTitle: string
    paymentMethod: string
}

export interface OrderDetail {
    id: number
    memberId: number
    storeId: number
    menuId: number
    quantity: number
    totalPrice: number
    createdAt: string
    customerName: string
    customerPhone: string
    customerAddress: string
    storeName: string
    storeAddress: string
    menuTitle: string
    paymentMethod: string
}

// Store API functions
export async function uploadFile(file: File): Promise<{ url: string }> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/upload`

    // FormData를 사용하여 파일 업로드
    const formData = new FormData()
    formData.append("file", file)

    // 🔍 디버깅: 파일 정보 출력
    console.log("📤 [파일 업로드 요청]", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        url: url,
        method: "POST"
    })

    // 🔍 디버깅: FormData 내용 확인
    console.log("📦 [FormData 정보]", {
        hasFile: formData.has("file"),
        entriesCount: Array.from(formData.entries()).length
    })

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            // Content-Type은 설정 안함! (브라우저가 자동으로 multipart/form-data 설정)
        },
        body: formData,
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] File Upload Error:", errorText)
        throw new Error("파일 업로드에 실패했습니다.")
    }

    const responseData = await response.json()
    console.log("[v0] File Upload Success:", responseData)
    
    const unwrapped = responseData && typeof responseData === "object" && "data" in responseData ? responseData.data : responseData
    return unwrapped as { url: string }
}

export async function createStore(data: CreateStoreRequest, file?: File): Promise<StoreInfo> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/store/create`

    console.log("[v0] POST Create Store Request:", { url, token: token ? "present" : "missing", data, hasFile: !!file })

    // 파일이 있으면 FormData로, 없으면 JSON으로
    let body: FormData | string
    let headers: Record<string, string>

    if (file) {
        // FormData 방식 (파일과 데이터 함께 전송)
        const formData = new FormData()
        
        // 파일 추가 (백엔드가 thumbnailFile 필드명을 사용)
        formData.append("thumbnailFile", file)
        
        // 다른 데이터들 추가
        formData.append("name", data.name)
        formData.append("category", data.category)
        formData.append("phone", data.phone)
        formData.append("address", data.address)
        formData.append("openH", data.openH.toString())
        formData.append("openM", data.openM.toString())
        formData.append("closedH", data.closedH.toString())
        formData.append("closedM", data.closedM.toString())
        formData.append("createdAt", data.createdAt)
        
        body = formData
        headers = {
            Authorization: `Bearer ${token}`,
            // Content-Type은 설정 안함! (브라우저가 자동으로 multipart/form-data 설정)
        }
        
        console.log("📤 [FormData로 전송] 파일과 데이터 함께 전송")
    } else {
        // JSON 방식 (기존 방식)
        body = JSON.stringify(data)
        headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
        
        console.log("📤 [JSON으로 전송] 데이터만 전송")
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body,
    })

    console.log("[v0] POST Create Store Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] POST Create Store Error:", errorText)
        throw new Error("Failed to create store")
    }

    const responseData = await response.json()
    const unwrapped = responseData && typeof responseData === "object" && "data" in responseData ? responseData.data : responseData
    console.log("[v0] POST Create Store Data:", unwrapped)
    return unwrapped as StoreInfo
}
// 모든 주문 조회 API (관리자용)
export async function getAllOrders(): Promise<Order[]> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/order/list`

    console.log("[v0] GET All Orders Request:", { url, token: token ? "present" : "missing" })

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    console.log("[v0] GET All Orders Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return []
        }
        const errorText = await response.text()
        console.error("[v0] GET All Orders Error:", errorText)
        throw new Error("Failed to fetch all orders")
    }

    const responseData = await response.json()
    console.log("[v0] GET All Orders Data:", responseData)

    // API 응답 구조에 따라 데이터 추출
    if (responseData.responseType === "SUCCESS" && responseData.data) {
        return responseData.data as Order[]
    }

    return []
}

// 상점 삭제 API (관리자용)
export async function deleteStore(storeId: number): Promise<void> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/store/delete/${storeId}`

    console.log("[v0] DELETE Store Request:", { url, token: token ? "present" : "missing", storeId })

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    console.log("[v0] DELETE Store Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] DELETE Store Error:", errorText)
        throw new Error("Failed to delete store")
    }

    console.log("[v0] DELETE Store Success")
}

// 모든 가게 조회 API (관리자용)
export async function getAllStores(): Promise<StoreInfo[]> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/store/all`

    console.log("[v0] GET All Stores Request:", { url, token: token ? "present" : "missing" })

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    console.log("[v0] GET All Stores Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return []
        }
        const errorText = await response.text()
        console.error("[v0] GET All Stores Error:", errorText)
        throw new Error("Failed to fetch all stores")
    }

    const responseData = await response.json()
    console.log("[v0] GET All Stores Data:", responseData)

    // API 응답 구조에 따라 데이터 추출
    if (responseData.responseType === "SUCCESS" && responseData.data) {
        return responseData.data as StoreInfo[]
    }

    return []
}

export async function getStoreInfo(storeId: number): Promise<StoreInfo> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/store/info/${storeId}`

    console.log("[v0] GET Store Info Request:", { url, token: token ? "present" : "missing" })

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    console.log("[v0] GET Store Info Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] GET Store Info Error:", errorText)
        throw new Error("Failed to fetch store info")
    }

    const responseData = await response.json()
    console.log("[v0] GET Store Info Data:", responseData)

    const storeInfo = responseData.data
    
    // 상대 경로를 전체 URL로 변환
    if (storeInfo.thumbnail && !storeInfo.thumbnail.startsWith('http')) {
        storeInfo.thumbnail = `${API_BASE_URL}/${storeInfo.thumbnail}`
    }

    return storeInfo
}

export async function updateStoreInfo(storeId: number, data: UpdateStoreRequest, file?: File): Promise<StoreInfo> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/store/info`

    console.log("[v0]变更 Update Store Request:", { url, token: token ? "present" : "missing", data, hasFile: !!file })

    // 파일이 있으면 FormData로, 없으면 JSON으로
    let body: FormData | string
    let headers: Record<string, string>

    if (file) {
        // FormData 방식 (파일과 데이터 함께 전송)
        const formData = new FormData()
        
        // 파일 추가 (백엔드가 thumbnailFile 필드명을 사용)
        formData.append("thumbnailFile", file)
        
        // 다른 데이터들 추가
        formData.append("category", data.category)
        formData.append("name", data.name)
        formData.append("phone", data.phone)
        formData.append("address", data.address)
        formData.append("openH", data.openH.toString())
        formData.append("openM", data.openM.toString())
        formData.append("closedH", data.closedH.toString())
        formData.append("closedM", data.closedM.toString())
        
        body = formData
        headers = {
            Authorization: `Bearer ${token}`,
            // Content-Type은 설정 안함! (브라우저가 자동으로 multipart/form-data 설정)
        }
        
        console.log("📤 [FormData로 전송] 파일과 데이터 함께 전송")
    } else {
        // JSON 방식 (기존 방식)
        body = JSON.stringify(data)
        headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
        
        console.log("📤 [JSON으로 전송] 데이터만 전송")
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body,
    })

    console.log("[v0] POST Update Store Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] POST Update Store Error:", errorText)
        throw new Error("Failed to update store info")
    }

    const responseData = await response.json()
    console.log("[v0] POST Update Store Data:", responseData)
    return responseData
}

// Menu API functions
export async function getMenusByStore(storeId: number): Promise<MenuItem[]> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/menu/store/${storeId}`

    console.log("[v0] GET Menus Request:", { url, token: token ? "present" : "missing" })

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    console.log("[v0] GET Menus Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] GET Menus Error:", errorText)
        throw new Error("Failed to fetch menus")
    }

    const responseData = await response.json()
    console.log("[v0] GET Menus Data:", responseData)

    // 일부 API는 { data: [...] } 래핑 형태로 반환될 수 있으므로 안전하게 언래핑한다
    const unwrapped =
        responseData && typeof responseData === "object" && "data" in responseData
            ? (responseData as { data: unknown }).data
            : responseData

    if (!Array.isArray(unwrapped)) {
        console.error("[v0] GET Menus Unexpected Shape (expected array)", responseData)
        return []
    }

    // 상대 경로를 전체 URL로 변환
    const menus = (unwrapped as MenuItem[]).map(menu => ({
        ...menu,
        thumbnail: menu.thumbnail 
            ? menu.thumbnail.startsWith('http') 
                ? menu.thumbnail 
                : `${API_BASE_URL}/${menu.thumbnail}`  // 상대 경로 → 전체 URL
            : menu.thumbnail
    }))

    return menus
}

export async function createMenu(data: CreateMenuRequest, file?: File): Promise<MenuItem> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/menu/create`

    console.log("[v0] POST Create Menu Request:", { url, token: token ? "present" : "missing", data, hasFile: !!file })

    // 파일이 있으면 FormData로, 없으면 JSON으로
    let body: FormData | string
    let headers: Record<string, string>

    if (file) {
        // FormData 방식 (파일과 데이터 함께 전송)
        const formData = new FormData()
        
        // 파일 추가 (백엔드가 thumbnailFile 필드명을 사용)
        formData.append("thumbnailFile", file)
        
        // 다른 데이터들 추가
        formData.append("storeId", data.storeId.toString())
        formData.append("title", data.title)
        formData.append("content", data.content)
        formData.append("price", data.price.toString())
        
        body = formData
        headers = {
            Authorization: `Bearer ${token}`,
            // Content-Type은 설정 안함! (브라우저가 자동으로 multipart/form-data 설정)
        }
        
        console.log("📤 [FormData로 전송] 파일과 데이터 함께 전송")
    } else {
        // JSON 방식 (기존 방식)
        body = JSON.stringify(data)
        headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
        
        console.log("📤 [JSON으로 전송] 데이터만 전송")
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body,
    })

    console.log("[v0] POST Create Menu Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] POST Create Menu Error:", errorText)
        throw new Error("Failed to create menu")
    }

    const responseData = await response.json()
    console.log("[v0] POST Create Menu Data:", responseData)
    // API 응답에서 data 필드만 추출하여 반환
    const unwrapped = responseData && typeof responseData === "object" && "data" in responseData ? responseData.data : responseData
    
    // 상대 경로를 전체 URL로 변환
    const menu = unwrapped as MenuItem
    if (menu.thumbnail && !menu.thumbnail.startsWith('http')) {
        menu.thumbnail = `${API_BASE_URL}/${menu.thumbnail}`
    }
    
    return menu
}

export async function updateMenu(menuId: number, data: UpdateMenuRequest, file?: File): Promise<void> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/menu/info/${menuId}`

    console.log("[v0] PUT Update Menu Request:", { url, token: token ? "present" : "missing", menuId, data, hasFile: !!file })

    // 메뉴 수정은 항상 FormData로 전송 (백엔드 요구사항)
    const formData = new FormData()
    
    // 파일이 있으면 추가 (백엔드가 thumbnailFile 필드명을 사용)
    if (file) {
        formData.append("thumbnailFile", file)
    }
    
    // 데이터 추가
    formData.append("title", data.title)
    formData.append("content", data.content)
    formData.append("price", data.price.toString())
    
    const body = formData
    const headers = {
        Authorization: `Bearer ${token}`,
        // Content-Type은 설정 안함! (브라우저가 자동으로 multipart/form-data 설정)
    }
    
    console.log("📤 [FormData로 전송] 메뉴 수정")

    const response = await fetch(url, {
        method: "POST",
        headers,
        body,
    })

    console.log("[v0] PUT Update Menu Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] PUT Update Menu Error:", errorText)
        throw new Error("Failed to update menu")
    }

    const responseData = await response.json()
    console.log("[v0] PUT Update Menu Data:", responseData)
}

export async function deleteMenu(menuId: number): Promise<void> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/menu/delete/${menuId}`

    console.log("[v0] DELETE Menu Request:", { url, token: token ? "present" : "missing", menuId })

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    console.log("[v0] DELETE Menu Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] DELETE Menu Error:", errorText)
        throw new Error("Failed to delete menu")
    }

    console.log("[v0] DELETE Menu Success")
}

// Order API functions
export async function getOrdersByStore(storeId: number): Promise<Order[]> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/order/store/${storeId}`

    console.log("[v0] GET Orders Request:", { url, token: token ? "present" : "missing" })

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    console.log("[v0] GET Orders Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] GET Orders Error:", errorText)
        throw new Error("Failed to fetch orders")
    }

    const responseData = await response.json()
    console.log("[v0] GET Orders Data:", responseData)

    const unwrapped =
        responseData && typeof responseData === "object" && "data" in responseData
            ? (responseData as { data: unknown }).data
            : responseData

    if (!Array.isArray(unwrapped)) {
        console.error("[v0] GET Orders Unexpected Shape (expected array)", responseData)
        return []
    }

    return unwrapped as Order[]
}

export async function getOrderDetail(orderId: number): Promise<OrderDetail> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/order/${orderId}`

    console.log("[v0] GET Order Detail Request:", { url, token: token ? "present" : "missing" })

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    console.log("[v0] GET Order Detail Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return
        }
        const errorText = await response.text()
        console.error("[v0] GET Order Detail Error:", errorText)
        throw new Error("Failed to fetch order detail")
    }

    const responseData = await response.json()
    console.log("[v0] GET Order Detail Data:", responseData)

    // API 응답에서 data 필드만 추출하여 반환
    const unwrapped = responseData && typeof responseData === "object" && "data" in responseData ? responseData.data : responseData
    return unwrapped as OrderDetail
}

// 기간 내 주문 조회 API
export interface OrderPeriodRequest {
    startDay: string
    endDay: string
}

export interface OrderPeriodResponse {
    id: number
    memberId: number
    storeId: number
    menuId: number
    quantity: number
    totalPrice: number
    createdAt: string
    customerName: string
    customerPhone: string
    customerAddress: string
    storeName: string
    storeAddress: string
    menuTitle: string
    paymentMethod: string
}

export async function getOrdersByPeriod(data: OrderPeriodRequest): Promise<OrderPeriodResponse[]> {
    const token = getAuthToken()
    const url = `${API_BASE_URL}/api/order/day`

    console.log("[v0] POST Order Period Request:", { url, token: token ? "present" : "missing", data })

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    console.log("[v0] POST Order Period Response:", { status: response.status, ok: response.ok })

    if (!response.ok) {
        // 401 에러 시 자동 로그아웃 및 리다이렉션
        if (handleAuthError(response)) {
            return []
        }
        const errorText = await response.text()
        console.error("[v0] POST Order Period Error:", errorText)
        throw new Error("Failed to fetch orders by period")
    }

    const responseData = await response.json()
    console.log("[v0] POST Order Period Data:", responseData)

    // API 응답 구조에 따라 데이터 추출
    if (responseData.responseType === "SUCCESS" && responseData.data) {
        return responseData.data as OrderPeriodResponse[]
    }

    return []
}