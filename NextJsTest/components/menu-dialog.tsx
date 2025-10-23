"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { createMenu, updateMenu, type MenuItem } from "@/lib/api-client"

interface MenuDialogProps {
  open: boolean
  onClose: (success: boolean) => void
  menu: MenuItem | null
  storeId: number
}

export function MenuDialog({ open, onClose, menu, storeId }: MenuDialogProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    price: 0,
    thumbnail: "",
  })

  useEffect(() => {
    if (menu) {
      setFormData({
        title: menu.title,
        content: menu.content,
        price: menu.price,
        thumbnail: menu.thumbnail,
      })
    } else {
      setFormData({
        title: "",
        content: "",
        price: 0,
        thumbnail: "",
      })
    }
  }, [menu, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setSaving(true)

      if (menu) {
        // Update existing menu
        await updateMenu(menu.id, {
          storeId,
          ...formData,
        })
      } else {
        // Create new menu
        await createMenu({
          storeId,
          ...formData,
        })
      }

      onClose(true)
    } catch (error) {
      console.error("Failed to save menu:", error)
      alert("저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{menu ? "메뉴 수정" : "메뉴 추가"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">메뉴 이름</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">설명</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">가격</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="thumbnail">이미지 URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
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
      </DialogContent>
    </Dialog>
  )
}
