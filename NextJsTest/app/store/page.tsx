"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { getStoreInfo, updateStoreInfo, type StoreInfo } from "@/lib/api-client"
import { Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default function StoreManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [storeData, setStoreData] = useState<StoreInfo | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    address: "",
    phone: "",
    open_H: 9,
    open_M: 0,
    closed_H: 21,
    closed_M: 0,
  })

  // TODO: Replace with actual store ID from auth context
  const storeId = 1

  useEffect(() => {
    loadStoreInfo()
  }, [])

  async function loadStoreInfo() {
    try {
      setLoading(true)
      const data = await getStoreInfo(storeId)
      setStoreData(data)
      setFormData({
        category: data.category,
        name: data.name,
        address: data.address,
        phone: data.phone,
        open_H: data.open_H,
        open_M: data.open_M,
        closed_H: data.closed_H,
        closed_M: data.closed_M,
      })
    } catch (error) {
      console.error("Failed to load store info:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      await updateStoreInfo(storeId, formData)
      alert("가게 정보가 저장되었습니다.")
      await loadStoreInfo()
    } catch (error) {
      console.error("Failed to update store info:", error)
      alert("저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">가게 관리</h1>
            <p className="mt-2 text-muted-foreground">가게 정보와 운영 설정을 관리하세요</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <h2 className="mb-6 text-xl font-semibold">기본 정보</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="예: Korean, Chinese, Japanese"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="storeName">가게 이름</Label>
                  <Input
                    id="storeName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            <Card className="mt-6 p-6">
              <h2 className="mb-6 text-xl font-semibold">운영 시간</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>오픈 시간</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={formData.open_H}
                        onChange={(e) => setFormData({ ...formData, open_H: Number.parseInt(e.target.value) })}
                        placeholder="시"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.open_M}
                        onChange={(e) => setFormData({ ...formData, open_M: Number.parseInt(e.target.value) })}
                        placeholder="분"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>마감 시간</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={formData.closed_H}
                        onChange={(e) => setFormData({ ...formData, closed_H: Number.parseInt(e.target.value) })}
                        placeholder="시"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.closed_M}
                        onChange={(e) => setFormData({ ...formData, closed_M: Number.parseInt(e.target.value) })}
                        placeholder="분"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={loadStoreInfo}>
                취소
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "저장하기"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
