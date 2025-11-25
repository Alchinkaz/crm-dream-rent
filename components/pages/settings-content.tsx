"use client"

import { useTheme } from "next-themes"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function SettingsContent() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-8 py-8 px-4 lg:px-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Внешний вид</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Light Mode Card */}
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "relative rounded-xl border-2 p-6 transition-all hover:border-blue-500",
              theme === "light" ? "border-blue-500" : "border-border",
            )}
          >
            <div className="aspect-video rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-4">
              <IconSun className="size-12 text-yellow-500" />
            </div>
            <p className="text-sm font-medium text-center">Светлая тема</p>
          </button>

          {/* Dark Mode Card */}
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "relative rounded-xl border-2 p-6 transition-all hover:border-blue-500",
              theme === "dark" ? "border-blue-500" : "border-border",
            )}
          >
            <div className="aspect-video rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center mb-4">
              <IconMoon className="size-12 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-center">Темная тема</p>
          </button>

          {/* Auto Mode Card */}
          <button
            onClick={() => setTheme("system")}
            className={cn(
              "relative rounded-xl border-2 p-6 transition-all hover:border-blue-500",
              theme === "system" ? "border-blue-500" : "border-border",
            )}
          >
            <div className="aspect-video rounded-lg bg-gradient-to-br from-white to-gray-900 border border-gray-400 flex items-center justify-center mb-4">
              <div className="flex gap-2">
                <IconSun className="size-8 text-yellow-500" />
                <IconMoon className="size-8 text-gray-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-center">Авто</p>
          </button>
        </div>
      </div>
    </div>
  )
}
