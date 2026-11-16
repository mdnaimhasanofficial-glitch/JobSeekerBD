import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Subscribe to window size changes and return true on screens < 768px.
// useSyncExternalStore is React's built-in way to read browser values
// that can change over time (no useEffect/setState needed).
export function useIsMobile() {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      mql.addEventListener("change", onStoreChange)
      return () => mql.removeEventListener("change", onStoreChange)
    },
    () => window.innerWidth < MOBILE_BREAKPOINT, // on the client
    () => false // on the server (unknown size → desktop layout)
  )
}
