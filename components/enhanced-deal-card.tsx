"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconCalendar, IconScooter, IconUser } from "@tabler/icons-react"
import type { DealWithFields } from "@/lib/types/crm-fields"
import { useAuth } from "@/lib/auth"
import React from "react"
import { getMopedByIdCached, type Moped } from "@/lib/mopeds-store"

type EnhancedDealCardProps = {
  deal: DealWithFields
  onClick?: () => void
  mopedMap?: Map<string, Moped>
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

export function EnhancedDealCard({ deal, onClick, mopedMap }: EnhancedDealCardProps) {
  const { username } = useAuth()
  const [moped, setMoped] = React.useState<Moped | null>(null)

  React.useEffect(() => {
    if (!deal.mopedId) {
      setMoped(null)
      return
    }

    // Prefer provided map for instant, flicker-free display
    if (mopedMap && mopedMap.has(deal.mopedId)) {
      setMoped(mopedMap.get(deal.mopedId) || null)
      return
    }

    // Fallback to cached fetch
    const loadMoped = async () => {
      const foundMoped = await getMopedByIdCached(deal.mopedId as string)
      if (foundMoped) setMoped(foundMoped)
    }
    loadMoped()
  }, [deal.mopedId, mopedMap])

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="px-6 pb-2">
        <h3
          data-no-drag
          className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          {deal.clientName}
        </h3>
      </CardHeader>

      <div className="px-6 space-y-1">
        {/* Moped */}
        {moped && (
          <div className="flex items-center gap-2 text-xs pb-2 mb-1">
            <div className="size-6 rounded overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
              {moped.photo ? (
                <img
                  src={moped.photo || "/placeholder.svg"}
                  alt={`${moped.brand} ${moped.model}`}
                  className="size-full object-cover"
                />
              ) : (
                <IconScooter className="size-3.5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {moped.brand} {moped.model}
              </p>
              <p className="text-xs text-muted-foreground truncate">{moped.licensePlate}</p>
            </div>
          </div>
        )}

        {/* Responsible */}
        {(deal.manager || username) && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Ответственный:</span>
            <Avatar className="size-4 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=16&width=16" alt={username} />
              <AvatarFallback className="text-xs">{(deal.manager || username)?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{deal.manager || username}</span>
          </div>
        )}

        {/* Source */}
        {deal.source && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Источник:</span>
            <span className="font-medium">{deal.source}</span>
          </div>
        )}
      </div>

      <div className="border-t mt-1" />

      <div className="px-6 py-2 space-y-1">
        {(deal.dateStart || deal.dateEnd) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconCalendar className="size-3.5 flex-shrink-0" />
            <span>
              {deal.dateStart && formatDate(deal.dateStart)}
              {deal.dateStart && deal.dateEnd && " — "}
              {deal.dateEnd && formatDate(deal.dateEnd)}
            </span>
          </div>
        )}
        {deal.createdBy && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconUser className="size-3.5 flex-shrink-0" />
            <span>Создано: {deal.createdBy}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
