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
import type { Resource } from "@/lib/types/inventory"

type ResourceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (resource: Omit<Resource, "id">) => void
  resource?: Resource | null
  warehouseId: string
}

export function ResourceDialog({ open, onOpenChange, onSubmit, resource, warehouseId }: ResourceDialogProps) {
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState("")
  const [quantity, setQuantity] = React.useState("")
  const [unit, setUnit] = React.useState("")
  const [price, setPrice] = React.useState("")

  React.useEffect(() => {
    if (resource) {
      setName(resource.name)
      setType(resource.type)
      setQuantity(resource.quantity.toString())
      setUnit(resource.unit)
      setPrice(resource.price.toString())
    } else {
      setName("")
      setType("")
      setQuantity("")
      setUnit("")
      setPrice("")
    }
  }, [resource, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      warehouseId,
      name,
      type,
      quantity: Number.parseFloat(quantity),
      unit,
      price: Number.parseFloat(price),
    })
    setName("")
    setType("")
    setQuantity("")
    setUnit("")
    setPrice("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{resource ? "Редактировать ресурс" : "Добавить ресурс"}</DialogTitle>
          <DialogDescription>
            {resource ? "Редактировать информацию о ресурсе" : "Добавить новый ресурс на склад"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Сталь листовая"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Тип</Label>
              <Input id="type" value={type} onChange={(e) => setType(e.target.value)} placeholder="Металл" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Количество</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Единица</Label>
                <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="кг" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Цена</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150"
                required
              />
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
