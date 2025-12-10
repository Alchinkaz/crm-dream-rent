"use client"

import * as React from "react"
import { IconPencil, IconTrash, IconUpload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Moped } from "@/lib/mopeds-store"

export function MopedDetailModal({
  moped,
  formData,
  setFormData,
  onSave,
  onDelete,
  onClose,
}: {
  moped: Moped | null
  formData: {
    brand: string
    model: string
    licensePlate: string
    photo: string
    status: Moped["status"]
    grnz?: string
    vinCode?: string
    color?: string
    mileage?: string
    condition?: "new" | "good" | "broken"
    insuranceDate?: string
    techInspectionDate?: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  onSave: () => void
  onDelete: (() => void) | undefined
  onClose: () => void
}) {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = React.useState<"main" | "history" | "settings">("main")
  const [isImageEditModalOpen, setIsImageEditModalOpen] = React.useState(false)

  const isNewMoped = !moped

  const handleImageSave = (url: string) => {
    setFormData({ ...formData, photo: url })
  }

  return (
    <>
      <div className={`flex flex-col gap-4 sm:gap-6 ${isMobile ? 'p-4 pb-4' : 'p-8 pb-6'} border-b shrink-0`}>
        <div className="flex items-center gap-3 group">
          <div className="relative pb-1">
            <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>{isNewMoped ? "Новый мопед" : `${formData.brand} ${formData.model}`}</h1>
            <span className="absolute -bottom-0 left-0 w-full h-[1px] bg-border group-hover:bg-foreground transition-colors" />
          </div>
        </div>

        <div className={`border-b ${isMobile ? '-mb-4 -mx-4 px-4' : '-mb-6 -mx-8 px-8'}`}>
          <nav className={`flex ${isMobile ? 'gap-4' : 'gap-6'} overflow-x-auto scrollbar-hide`} aria-label="Moped sections">
            <button
              onClick={() => setActiveTab("main")}
              className={`text-muted-foreground hover:text-foreground relative whitespace-nowrap border-b-2 text-sm font-medium transition-colors pb-3.5 ${
                activeTab === "main" ? "text-foreground border-foreground" : "border-transparent"
              }`}
            >
              Основные
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`text-muted-foreground hover:text-foreground relative whitespace-nowrap border-b-2 text-sm font-medium transition-colors pb-3.5 ${
                activeTab === "history" ? "text-foreground border-foreground" : "border-transparent"
              }`}
            >
              История
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`text-muted-foreground hover:text-foreground relative whitespace-nowrap border-b-2 text-sm font-medium transition-colors pb-3.5 ${
                activeTab === "settings" ? "text-foreground border-foreground" : "border-transparent"
              }`}
            >
              Настройки
            </button>
          </nav>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
        {activeTab === "main" ? (
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 sm:gap-6`}>
            <div className={`${isMobile ? 'w-full' : 'w-[280px]'} flex-shrink-0`}>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted group sticky top-0">
                <img
                  src={formData.photo || "/placeholder.svg?height=400&width=400&query=scooter"}
                  alt={isNewMoped ? "Новый мопед" : `${formData.brand} ${formData.model}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsImageEditModalOpen(true)}
                >
                  <IconPencil className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Марка</div>
                <div>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Honda"
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Модель</div>
                <div>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Dio"
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Гос. номер</div>
                <div>
                  <Input
                    placeholder="А123ВС77"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">№ Тех паспорта</div>
                <div>
                  <Input
                    placeholder="№ Тех паспорта"
                    value={formData.grnz || ""}
                    onChange={(e) => setFormData({ ...formData, grnz: e.target.value })}
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">VIN-Code</div>
                <div>
                  <Input
                    placeholder="1HGBH41JXMN109186"
                    value={formData.vinCode || ""}
                    onChange={(e) => setFormData({ ...formData, vinCode: e.target.value })}
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Цвет</div>
                <div>
                  <Input
                    placeholder="Красный"
                    value={formData.color || ""}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Пробег</div>
                <div>
                  <Input
                    placeholder="15000 км"
                    value={formData.mileage || ""}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Состояние</div>
                <div>
                  <Select
                    value={formData.condition || "good"}
                    onValueChange={(value: "new" | "good" | "broken") => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger className="border-none shadow-none h-8 focus:ring-0 px-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новый</SelectItem>
                      <SelectItem value="good">Исправен</SelectItem>
                      <SelectItem value="broken">Сломан</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Дата страховки</div>
                <div>
                  <Input
                    type="date"
                    value={formData.insuranceDate || ""}
                    onChange={(e) => setFormData({ ...formData, insuranceDate: e.target.value })}
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Дата Тех-Осмотра</div>
                <div>
                  <Input
                    type="date"
                    value={formData.techInspectionDate || ""}
                    onChange={(e) => setFormData({ ...formData, techInspectionDate: e.target.value })}
                    className="border-none shadow-none h-8 focus-visible:ring-0 px-0"
                  />
                </div>
              </div>

              <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                <div className="text-sm text-muted-foreground">Статус</div>
                <div>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Moped["status"]) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="border-none shadow-none h-8 focus:ring-0 px-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Доступен</SelectItem>
                      <SelectItem value="rented">В аренде</SelectItem>
                      <SelectItem value="maintenance">На обслуживании</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!isNewMoped && moped?.createdAt && (
                <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-[180px_1fr]'} items-${isMobile ? 'start' : 'center'} gap-4 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2`}>
                  <div className="text-sm text-muted-foreground">Дата создания</div>
                  <div>
                    <span className="text-sm">{new Date(moped.createdAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "history" ? (
          <div className="space-y-4">
            <div className="text-center text-muted-foreground py-12 border rounded-lg">
              История аренд и изменений будет отображаться здесь
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {onDelete && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 text-destructive">Опасная зона</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Удаление мопеда необратимо. Все данные будут потеряны.
                </p>
                <Button variant="destructive" onClick={onDelete}>
                  <IconTrash className="size-4 mr-2" />
                  Удалить мопед
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 ${isMobile ? 'px-4' : 'px-8'} py-4 border-t bg-muted/30 shrink-0`}>
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Отмена
        </Button>
        <Button onClick={onSave} disabled={!formData.brand || !formData.model || !formData.licensePlate} className="w-full sm:w-auto">
          {isNewMoped ? "Добавить" : "Сохранить"}
        </Button>
      </div>

      <ImageEditModal
        open={isImageEditModalOpen}
        onOpenChange={setIsImageEditModalOpen}
        currentUrl={formData.photo}
        onSave={handleImageSave}
      />
    </>
  )
}

function ImageEditModal({
  open,
  onOpenChange,
  currentUrl,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUrl: string
  onSave: (url: string) => void
}) {
  const [imageUrl, setImageUrl] = React.useState(currentUrl)
  const [dragActive, setDragActive] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setImageUrl(currentUrl)
  }, [currentUrl])

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImageUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleSave = () => {
    onSave(imageUrl)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Редактировать изображение</h2>

          <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={imageUrl || "/placeholder.svg?height=400&width=400&query=scooter"}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Загрузить</TabsTrigger>
              <TabsTrigger value="url">Ссылка</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0])
                    }
                  }}
                />
                <IconUpload className="size-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Перетащите изображение сюда или</p>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Выбрать файл
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label>URL изображения</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

