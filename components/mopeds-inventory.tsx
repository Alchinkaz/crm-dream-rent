"use client"

import * as React from "react"
import { IconPlus, IconPencil, IconTrash, IconSearch, IconUpload, IconFilter } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getMopeds, addMoped, updateMoped, deleteMoped, getCachedMopeds, type Moped } from "@/lib/mopeds-store"
import { useAuth } from "@/lib/auth"
import { useIsMobile } from "@/hooks/use-mobile"
import { MopedDetailModal } from "@/components/moped-detail-modal"

const STATUS_LABELS = {
  available: "Доступен",
  rented: "В аренде",
  maintenance: "На обслуживании",
}

const STATUS_VARIANTS = {
  available: "default" as const,
  rented: "secondary" as const,
  maintenance: "outline" as const,
}

const CONDITION_LABELS = {
  new: "Новый",
  good: "Исправен",
  broken: "Сломан",
}

export function MopedsInventory() {
  const { hasTabAccess, username } = useAuth()
  const isMobile = useIsMobile()
  const canEdit = hasTabAccess("mopeds", "inventory", "edit")
  
  const [mopeds, setMopeds] = React.useState<Moped[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewingMoped, setViewingMoped] = React.useState<Moped | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [statusFilters, setStatusFilters] = React.useState<string[]>([])
  const [conditionFilters, setConditionFilters] = React.useState<string[]>([])

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [addFormData, setAddFormData] = React.useState({
    brand: "",
    model: "",
    licensePlate: "",
    photo: "",
    status: "available" as Moped["status"],
    grnz: "",
    vinCode: "",
    color: "",
    mileage: "",
    condition: "good" as "new" | "good" | "broken",
    insuranceDate: "",
    techInspectionDate: "",
  })

  const [viewFormData, setViewFormData] = React.useState({
    brand: "",
    model: "",
    licensePlate: "",
    photo: "",
    status: "available" as Moped["status"],
    grnz: "",
    vinCode: "",
    color: "",
    mileage: "",
    condition: "good" as "new" | "good" | "broken",
    insuranceDate: "",
    techInspectionDate: "",
  })

  React.useEffect(() => {
    // Сначала проверяем кэш - если данные есть, устанавливаем их сразу без loading
    const cached = getCachedMopeds()
    if (cached && cached.length > 0) {
      setMopeds(cached)
    }
    
    // Затем загружаем свежие данные в фоне
    const loadMopeds = async () => {
      try {
        const loadedMopeds = await getMopeds()
        console.log("[MopedsInventory] Loaded mopeds:", loadedMopeds.length)
        setMopeds(loadedMopeds)
      } catch (error) {
        console.error("[MopedsInventory] Error loading mopeds:", error)
      }
    }
    loadMopeds()
  }, [])

  const filteredMopeds = React.useMemo(() => {
    let filtered = mopeds

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (moped) =>
          moped.brand.toLowerCase().includes(query) ||
          moped.model.toLowerCase().includes(query) ||
          moped.licensePlate.toLowerCase().includes(query),
      )
    }

    if (statusFilters.length > 0) {
      filtered = filtered.filter((moped) => statusFilters.includes(moped.status))
    }

    if (conditionFilters.length > 0) {
      filtered = filtered.filter((moped) => {
        const mopedCondition = (moped as any).condition || "good"
        console.log(
          "[v0] Filtering moped:",
          moped.brand,
          moped.model,
          "condition:",
          mopedCondition,
          "filters:",
          conditionFilters,
        )
        return conditionFilters.includes(mopedCondition)
      })
    }

    return filtered
  }, [mopeds, searchQuery, statusFilters, conditionFilters])

  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const toggleConditionFilter = (condition: string) => {
    setConditionFilters((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  const handleOpenAddDialog = () => {
    setAddFormData({
      brand: "",
      model: "",
      licensePlate: "",
      photo: "",
      status: "available",
      grnz: "",
      vinCode: "",
      color: "",
      mileage: "",
      condition: "good",
      insuranceDate: "",
      techInspectionDate: "",
    })
    setIsDialogOpen(true)
  }

  const handleViewMoped = (moped: Moped) => {
    setViewingMoped(moped)
    setViewFormData({
      brand: moped.brand,
      model: moped.model,
      licensePlate: moped.licensePlate,
      photo: moped.photo || "",
      status: moped.status,
      grnz: (moped as any).grnz || "",
      vinCode: (moped as any).vinCode || "",
      color: (moped as any).color || "",
      mileage: (moped as any).mileage || "",
      condition: (moped as any).condition || "good",
      insuranceDate: (moped as any).insuranceDate || "",
      techInspectionDate: (moped as any).techInspectionDate || "",
    })
    setIsViewModalOpen(true)
  }

  async function handleSaveAdd() {
    if (!addFormData.brand || !addFormData.model || !addFormData.licensePlate) {
      return
    }

    const newMoped = await addMoped({ ...addFormData, createdBy: username || undefined })
    if (newMoped) {
      const loadedMopeds = await getMopeds()
      setMopeds(loadedMopeds)
    }
    setIsDialogOpen(false)
    setAddFormData({
      brand: "",
      model: "",
      licensePlate: "",
      photo: "",
      status: "available",
      grnz: "",
      vinCode: "",
      color: "",
      mileage: "",
      condition: "good",
      insuranceDate: "",
      techInspectionDate: "",
    })
  }

  async function handleSaveFromView() {
    if (!viewFormData.brand || !viewFormData.model || !viewFormData.licensePlate || !viewingMoped) {
      return
    }

    await updateMoped(viewingMoped.id, viewFormData)
    const loadedMopeds = await getMopeds()
    setMopeds(loadedMopeds)
    setIsViewModalOpen(false)
    setViewingMoped(null)
  }

  async function handleDelete(id: string, e?: React.MouseEvent) {
    e?.stopPropagation()
    if (confirm("Вы уверены, что хотите удалить этот мопед?")) {
      await deleteMoped(id)
      const loadedMopeds = await getMopeds()
      setMopeds(loadedMopeds)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по марке, модели или номеру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <IconFilter className="size-4 mr-2" />
              Фильтры
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Статус</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("available")}
              onCheckedChange={() => toggleStatusFilter("available")}
            >
              Доступен
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("rented")}
              onCheckedChange={() => toggleStatusFilter("rented")}
            >
              В аренде
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("maintenance")}
              onCheckedChange={() => toggleStatusFilter("maintenance")}
            >
              На обслуживании
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Состояние</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={conditionFilters.includes("new")}
              onCheckedChange={() => toggleConditionFilter("new")}
            >
              Новый
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={conditionFilters.includes("good")}
              onCheckedChange={() => toggleConditionFilter("good")}
            >
              Исправен
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={conditionFilters.includes("broken")}
              onCheckedChange={() => toggleConditionFilter("broken")}
            >
              Сломан
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenAddDialog}>
                <IconPlus className="size-4 mr-2" />
                Добавить мопед
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-4xl w-[85vw] max-h-[95vh] h-[95vh] overflow-hidden flex flex-col p-0">
              <MopedDetailModal
                moped={null}
                formData={addFormData}
                setFormData={setAddFormData}
                onSave={handleSaveAdd}
                onDelete={undefined}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3">
        {filteredMopeds.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 border rounded-lg">
            {searchQuery || statusFilters.length > 0 || conditionFilters.length > 0
              ? "Мопеды не найдены"
              : "Нет мопедов. Добавьте первый мопед."}
          </div>
        ) : (
          filteredMopeds.map((moped) => (
            <div
              key={moped.id}
              className="flex items-center gap-4 px-4 py-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleViewMoped(moped)}
            >
              <div className="size-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={moped.photo || "/placeholder.svg?height=48&width=48"}
                  alt={`${moped.brand} ${moped.model}`}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base">
                    {moped.brand} {moped.model}
                  </h3>
                  <Badge variant={STATUS_VARIANTS[moped.status]}>{STATUS_LABELS[moped.status]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Гос. номер: {moped.licensePlate} • Добавлен: {new Date(moped.createdAt).toLocaleDateString("ru-RU")}
                  {moped.createdBy && ` • Создано: ${moped.createdBy}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={(e) => handleDelete(moped.id, e)} aria-label="Удалить">
                  <IconTrash className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="!max-w-4xl w-[85vw] max-h-[95vh] h-[95vh] overflow-hidden flex flex-col p-0">
          <MopedDetailModal
            moped={viewingMoped}
            formData={viewFormData}
            setFormData={setViewFormData}
            onSave={handleSaveFromView}
            onDelete={() => viewingMoped && handleDelete(viewingMoped.id)}
            onClose={() => setIsViewModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

