// API client for backend communication

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
  thumbnail: string
}

export interface UpdateMenuRequest {
  storeId: number
  title: string
  content: string
  price: number
  thumbnail: string
}

// Order API types
export interface Order {
  id: number
  storeid: number
  menuid: number
  menu_name: string
  thumbnail: string
  quantity: number
  total_price: number
  created_at: string
}

export interface OrderDetail {
  id: number
  storeid: number
  menuid: number
  quantity: number
  total_price: number
  created_at: string
  menu: {
    id: number
    name: string
    price: number
    thumbnail: string
  }
}

// Store API functions
export async function createStore(data: CreateStoreRequest): Promise<StoreInfo> {
  const token = getAuthToken()
  const url = `${API_BASE_URL}/api/store/create`

  console.log("[v0] POST Create Store Request:", { url, token: token ? "present" : "missing", data })

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  console.log("[v0] POST Create Store Response:", { status: response.status, ok: response.ok })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] POST Create Store Error:", errorText)
    throw new Error("Failed to create store")
  }

  const responseData = await response.json()
  // Some backends wrap the result as { responseType, data, message }
  const unwrapped = responseData && typeof responseData === "object" && "data" in responseData ? responseData.data : responseData
  console.log("[v0] POST Create Store Data:", unwrapped)
  return unwrapped as StoreInfo
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
    const errorText = await response.text()
    console.error("[v0] GET Store Info Error:", errorText)
    throw new Error("Failed to fetch store info")
  }

  const data = await response.json()
  console.log("[v0] GET Store Info Data:", data)
  return data
}

export async function updateStoreInfo(storeId: number, data: UpdateStoreRequest): Promise<StoreInfo> {
  const token = getAuthToken()
  const url = `${API_BASE_URL}/api/store/info/${storeId}`

  console.log("[v0] POST Update Store Request:", { url, token: token ? "present" : "missing", data })

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  console.log("[v0] POST Update Store Response:", { status: response.status, ok: response.ok })

  if (!response.ok) {
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
  const url = `${API_BASE_URL}/api/menu/store/${storeId}`

  console.log("[v0] GET Menus Request:", { url })

  const response = await fetch(url)

  console.log("[v0] GET Menus Response:", { status: response.status, ok: response.ok })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] GET Menus Error:", errorText)
    throw new Error("Failed to fetch menus")
  }

  const data = await response.json()
  console.log("[v0] GET Menus Data:", data)
  return data
}

export async function createMenu(data: CreateMenuRequest): Promise<MenuItem> {
  const url = `${API_BASE_URL}/api/menu/create`

  console.log("[v0] POST Create Menu Request:", { url, data })

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  console.log("[v0] POST Create Menu Response:", { status: response.status, ok: response.ok })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] POST Create Menu Error:", errorText)
    throw new Error("Failed to create menu")
  }

  const responseData = await response.json()
  console.log("[v0] POST Create Menu Data:", responseData)
  return responseData
}

export async function updateMenu(menuId: number, data: UpdateMenuRequest): Promise<MenuItem> {
  const url = `${API_BASE_URL}/api/menu/info/${menuId}`

  console.log("[v0] PUT Update Menu Request:", { url, menuId, data })

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  console.log("[v0] PUT Update Menu Response:", { status: response.status, ok: response.ok })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] PUT Update Menu Error:", errorText)
    throw new Error("Failed to update menu")
  }

  const responseData = await response.json()
  console.log("[v0] PUT Update Menu Data:", responseData)
  return responseData
}

export async function deleteMenu(menuId: number): Promise<void> {
  const url = `${API_BASE_URL}/api/menu/info/${menuId}`

  console.log("[v0] DELETE Menu Request:", { url, menuId })

  const response = await fetch(url, {
    method: "DELETE",
  })

  console.log("[v0] DELETE Menu Response:", { status: response.status, ok: response.ok })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] DELETE Menu Error:", errorText)
    throw new Error("Failed to delete menu")
  }

  console.log("[v0] DELETE Menu Success")
}

// Order API functions
export async function getOrdersByStore(storeId: number): Promise<Order[]> {
  const url = `${API_BASE_URL}/api/order/store/${storeId}`

  console.log("[v0] GET Orders Request:", { url })

  const response = await fetch(url)

  console.log("[v0] GET Orders Response:", { status: response.status, ok: response.ok })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] GET Orders Error:", errorText)
    throw new Error("Failed to fetch orders")
  }

  const data = await response.json()
  console.log("[v0] GET Orders Data:", data)
  return data
}

export async function getOrderDetail(orderId: number): Promise<OrderDetail> {
  const url = `${API_BASE_URL}/api/order/${orderId}`

  console.log("[v0] GET Order Detail Request:", { url })

  const response = await fetch(url)

  console.log("[v0] GET Order Detail Response:", { status: response.status, ok: response.ok })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] GET Order Detail Error:", errorText)
    throw new Error("Failed to fetch order detail")
  }

  const data = await response.json()
  console.log("[v0] GET Order Detail Data:", data)
  return data
}
