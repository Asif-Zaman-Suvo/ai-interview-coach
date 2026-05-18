"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** SSR `false`, first client paint `true` — no `useEffect` + `setMounted`. */
export function useIsClient(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
