import { useCallback, useEffect, useState } from 'react'
import type { Category } from '@/types/category'
import * as categoryService from '@/services/categoryService'
import * as syncService from '@/services/syncService'

export function useCategories(userId?: string) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    const data = await categoryService.getCategories()
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addCategory = useCallback(
    async (name: string, icon: string) => {
      const created = await categoryService.createCategory(name, icon)
      setCategories((prev) => [...prev, created])
      if (userId) syncService.pushCategory(created, userId)
      return created
    },
    [userId]
  )

  const editCategory = useCallback(
    async (id: string, name: string, icon: string) => {
      const updated = await categoryService.updateCategory(id, name, icon)
      if (updated) {
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
        if (userId) syncService.pushCategory(updated, userId)
      }
      return updated
    },
    [userId]
  )

  const removeCategory = useCallback(
    async (id: string) => {
      await categoryService.deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      if (userId) syncService.deleteRemoteCategory(id, userId)
    },
    [userId]
  )

  /** Usado internamente pelo hook useSync após uma sincronização completa. */
  const applySyncedCategories = useCallback(async (synced: Category[]) => {
    await categoryService.replaceAllCategories(synced)
    setCategories(synced)
  }, [])

  return {
    categories,
    loading,
    reload,
    addCategory,
    editCategory,
    removeCategory,
    applySyncedCategories,
  }
}
