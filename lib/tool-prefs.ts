// 工具偏好存储 —— 收藏 + 最近使用，纯浏览器本地（localStorage）
//
// 设计要点：
//  - 快照引用稳定：getSnapshot 只返回模块内缓存的数组引用，仅在 mutation /
//    storage 事件时替换引用，配合 useSyncExternalStore 不会触发无限重渲染。
//  - 跨标签页同步：监听 window "storage" 事件，刷新缓存并通知订阅者。
//  - SSR 安全：服务端返回稳定空数组，避免 hydration 抖动。

const FAV_KEY = "tools:favorites:v1"
const RECENT_KEY = "tools:recents:v1"
const RECENT_CAP = 8

let favCache: string[] = []
let recentCache: string[] = []
let initialized = false

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function readLS(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []
  } catch {
    return []
  }
}

function writeLS(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 隐私模式 / 配额超限时静默降级，内存缓存仍然可用
  }
}

function ensureInit() {
  if (initialized || typeof window === "undefined") return
  initialized = true
  favCache = readLS(FAV_KEY)
  recentCache = readLS(RECENT_KEY)
  window.addEventListener("storage", (e) => {
    if (e.key === FAV_KEY) {
      favCache = readLS(FAV_KEY)
      emit()
    } else if (e.key === RECENT_KEY) {
      recentCache = readLS(RECENT_KEY)
      emit()
    }
  })
}

export function subscribe(cb: () => void): () => void {
  ensureInit()
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function getFavoritesSnapshot(): string[] {
  return favCache
}

export function getRecentsSnapshot(): string[] {
  return recentCache
}

const EMPTY: string[] = []
export function getServerSnapshot(): string[] {
  return EMPTY
}

export function toggleFavorite(id: string) {
  ensureInit()
  favCache = favCache.includes(id) ? favCache.filter((x) => x !== id) : [id, ...favCache]
  writeLS(FAV_KEY, favCache)
  emit()
}

export function recordRecent(id: string) {
  ensureInit()
  recentCache = [id, ...recentCache.filter((x) => x !== id)].slice(0, RECENT_CAP)
  writeLS(RECENT_KEY, recentCache)
  emit()
}
