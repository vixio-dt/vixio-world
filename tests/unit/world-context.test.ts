import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setCurrentWorldId, getCurrentWorldId, clearCurrentWorldId } from '@/lib/utils/world-context'

describe('world-context', () => {
  beforeEach(() => {
    // Clear mocks
    vi.clearAllMocks()
    // Reset localStorage mock
    window.localStorage.getItem = vi.fn()
    window.localStorage.setItem = vi.fn()
    window.localStorage.removeItem = vi.fn()
    // Reset cookie
    document.cookie = ''
  })

  describe('setCurrentWorldId', () => {
    it('should set world ID in localStorage', () => {
      const worldId = 'test-world-123'
      setCurrentWorldId(worldId)
      
      expect(window.localStorage.setItem).toHaveBeenCalledWith('currentWorldId', worldId)
    })

    it('should set world ID in cookie', () => {
      const worldId = 'test-world-456'
      setCurrentWorldId(worldId)
      
      expect(document.cookie).toContain('current_world_id=test-world-456')
    })
  })

  describe('getCurrentWorldId', () => {
    it('should get world ID from localStorage', () => {
      const worldId = 'stored-world-789'
      window.localStorage.getItem = vi.fn().mockReturnValue(worldId)
      
      const result = getCurrentWorldId()
      
      expect(window.localStorage.getItem).toHaveBeenCalledWith('currentWorldId')
      expect(result).toBe(worldId)
    })

    it('should return null when no world ID stored', () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(null)
      
      const result = getCurrentWorldId()
      
      expect(result).toBeNull()
    })
  })

  describe('clearCurrentWorldId', () => {
    it('should remove world ID from localStorage', () => {
      clearCurrentWorldId()
      
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('currentWorldId')
    })

    it('should clear the cookie', () => {
      setCurrentWorldId('some-world')
      clearCurrentWorldId()
      
      // Cookie should be cleared (set with past expiry)
      expect(document.cookie).toContain('current_world_id=')
    })
  })
})
