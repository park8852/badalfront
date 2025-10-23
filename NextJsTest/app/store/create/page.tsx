"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { createStore, type CreateStoreRequest } from "@/lib/api-client"

export default function StoreCreatePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<CreateStoreRequest>({
    category: "",
    name: "",
    address: "",
    phone: "",
    openH: 9,
    openM: 0,
    closedH: 21,
    closedM: 0,
    createdAt: new Date().toISOString(),
  })

  function onChange<K extends keyof CreateStoreRequest>(key: K, value: CreateStoreRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      // Ensure createdAt is always set to the current time on submit
      await createStore({ ...form, createdAt: new Date().toISOString() })
      alert("가게가 등록되었습니다.")
      router.push("/store")
    } catch (err) {
      console.error(err)
      alert("가게 등록에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">가게 등록</h1>
            <p className="mt-2 text-muted-foreground">기본 정보와 운영 시간을 입력해 가게를 등록하세요</p>
          </div>

          <form onSubmit={onSubmit}>
            <Card className="p-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">카테고리</Label>
                <Input id="category" value={form.category} onChange={(e) => onChange("category", e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">가게 이름</Label>
                <Input id="name" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">주소</Label>
                <Input id="address" value={form.address} onChange={(e) => onChange("address", e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input id="phone" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>오픈 시간</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={form.openH}
                      onChange={(e) => onChange("openH", Number(e.target.value))}
                      placeholder="시"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={form.openM}
                      onChange={(e) => onChange("openM", Number(e.target.value))}
                      placeholder="분"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>마감 시간</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={form.closedH}
                      onChange={(e) => onChange("closedH", Number(e.target.value))}
                      placeholder="시"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={form.closedM}
                      onChange={(e) => onChange("closedM", Number(e.target.value))}
                      placeholder="분"
                    />
                  </div>
                </div>
              </div>

              {/* 생성일은 현재 시간으로 자동 설정되며 화면에 표시하지 않습니다. */}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      등록 중...
                    </>
                  ) : (
                    "등록하기"
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </main>
    </div>
  )
}
