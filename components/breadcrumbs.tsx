"use client"

import { IconChevronRight } from "@tabler/icons-react"
import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, string> = {
  "/": "Главная",
  "/finances": "Финансы",
  "/mopeds": "Мопеды",
  "/motorcycles": "Мотоциклы",
  "/cars": "Авто",
  "/apartments": "Квартиры",
  "/clients": "Клиенты",
  "/projects": "Проекты",
  "/settings": "Настройки",
  "/help": "Помощь",
  "/users": "Пользователи",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] || ""

  if (!title) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      <span className="text-foreground font-medium">{title}</span>
    </nav>
  )
}
