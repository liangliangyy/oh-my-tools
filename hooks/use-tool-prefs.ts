"use client"

import { useSyncExternalStore } from "react"
import {
  subscribe,
  getFavoritesSnapshot,
  getRecentsSnapshot,
  getServerSnapshot,
  toggleFavorite,
  recordRecent,
} from "@/lib/tool-prefs"

/** 收藏的工具 id 列表（最近收藏在前）。 */
export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, getFavoritesSnapshot, getServerSnapshot)
}

/** 最近使用的工具 id 列表（最近在前，最多 8 个）。 */
export function useRecents(): string[] {
  return useSyncExternalStore(subscribe, getRecentsSnapshot, getServerSnapshot)
}

export { toggleFavorite, recordRecent }
