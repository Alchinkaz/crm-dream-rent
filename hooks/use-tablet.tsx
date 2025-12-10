import * as React from "react"

const TABLET_BREAKPOINT_MIN = 768
const TABLET_BREAKPOINT_MAX = 1024

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Проверяем только на клиенте
    if (typeof window === 'undefined') return
    
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= TABLET_BREAKPOINT_MIN && width < TABLET_BREAKPOINT_MAX)
    }
    
    const mql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT_MIN}px) and (max-width: ${TABLET_BREAKPOINT_MAX - 1}px)`)
    const onChange = () => {
      checkTablet()
    }
    mql.addEventListener("change", onChange)
    checkTablet()
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isTablet
}

