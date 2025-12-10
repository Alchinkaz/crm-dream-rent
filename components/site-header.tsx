"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function SiteHeader() {
  const isMobile = useIsMobile()
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-2 sm:px-4 lg:gap-2 lg:px-6">
        {isMobile && (
          <SidebarTrigger className="h-8 w-8 -ml-1" />
        )}
        <Breadcrumbs />
      </div>
    </header>
  )
}
