"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Warehouse } from "@/lib/types/inventory"

type WarehouseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (warehouse: Omit<Warehouse, "id" | "resourceCount">) => void
  warehouse?: Warehouse | null
}

export function WarehouseDialog({ open, onOpenChange, onSubmit, warehouse }: WarehouseDialogProps) {
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState("")

  React.useEffect(() => {
    if (warehouse) {
      setName(warehouse.name)
      setType(warehouse.type)
    } else {
      setName("")
      setType("")
    }
  }, [warehouse, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, type })
    setName("")
    setType("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{warehouse ? "Редактировать склад" : "Добавить склад"}</DialogTitle>
          <DialogDescription>
            {warehouse ? "Редактировать информацию о складе" : "Добавить новый склад в систему"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название склада</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Центральный склад"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Тип склада</Label>
              <Input id="type" value={type} onChange={(e) => setType(e.target.value)} placeholder="Основной" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
