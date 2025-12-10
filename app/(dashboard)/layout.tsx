"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProtectedRoute } from "@/lib/auth"
import { useIsMobile } from "@/hooks/use-mobile"
import { useIsTablet } from "@/hooks/use-tablet"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  // На планшетах sidebar открыт по умолчанию, но в collapsed состоянии
  const defaultOpen = isTablet ? false : false
  
  return (
    <ProtectedRoute>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
            "--header-height": "calc(var(--spacing) * 16)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" collapsible="icon" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className={`@container/main flex flex-1 flex-col gap-2 ${isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4 md:p-6'} overflow-y-auto`}>{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

