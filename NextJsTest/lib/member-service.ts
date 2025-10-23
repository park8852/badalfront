const API_BASE_URL = "http://192.168.72.196:8080"

interface LoginRequest {
  userid: string
  userpw: string
}

interface LoginResponse {
  responseType: "SUCCESS" | "FAIL"
  message: string
  data?: {
    token: string
    userId: string
    role: string
  }
}

interface RegisterRequest {
  userid: string
  userpw: string
  name: string
  birth: string
  phone: string
  email: string
  address: string
  role: "USER" | "OWNER"
  created_at: string
}

interface RegisterResponse {
  responseType: "SUCCESS" | "FAIL"
  message: string
}

export const memberService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const url = `${API_BASE_URL}/api/member/login`
    console.log("[v0] Login Request:", { url, userid: data.userid })

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, credentials: 'include',
      body: JSON.stringify(data),
    })

    console.log("[v0] Login Response Status:", response.status)

    const contentType = response.headers.get("content-type")
    let result

    if (contentType && contentType.includes("application/json")) {
      result = await response.json()
    } else {
      const text = await response.text()
      console.log("[v0] Login Response (Plain Text):", text)
      result = {
        responseType: response.ok ? "SUCCESS" : "FAIL",
        message: text,
      }
    }

    console.log("[v0] Login Response Data:", result)
    return result
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const url = `${API_BASE_URL}/api/member/register`
    console.log("[v0] Register Request URL:", url)
    console.log("[v0] Register Request Body:", JSON.stringify(data, null, 2))

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    console.log("[v0] Register Response Status:", response.status)

    const contentType = response.headers.get("content-type")
    let result

    if (contentType && contentType.includes("application/json")) {
      result = await response.json()
    } else {
      const text = await response.text()
      console.log("[v0] Register Response (Plain Text):", text)
      result = {
        responseType: response.ok ? "SUCCESS" : "FAIL",
        message: text,
      }
    }

    console.log("[v0] Register Response Data:", result)
    return result
  },
}
