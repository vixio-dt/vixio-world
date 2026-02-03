/**
 * World context utilities - syncs world selection between client (localStorage) and server (cookies)
 */

const COOKIE_NAME = 'current_world_id'
const STORAGE_KEY = 'currentWorldId'

/**
 * Set the current world ID in both localStorage and cookies
 */
export function setCurrentWorldId(worldId: string): void {
  // Set localStorage for client-side reads
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, worldId)
  }
  
  // Set cookie for server-side reads (expires in 1 year)
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)
  document.cookie = `${COOKIE_NAME}=${worldId}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
}

/**
 * Get the current world ID from localStorage
 */
export function getCurrentWorldId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

/**
 * Clear the current world selection
 */
export function clearCurrentWorldId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
  // Clear cookie by setting expiry in the past
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
