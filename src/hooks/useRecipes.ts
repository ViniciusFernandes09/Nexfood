import { useCallback, useEffect, useState } from 'react'
import type { Recipe, RecipeFormData } from '@/types/recipe'
import * as recipeService from '@/services/recipeService'
import * as syncService from '@/services/syncService'

/**
 * Hook central que carrega e mantém a lista de receitas em memória.
 *
 * Modelo híbrido: toda leitura/escrita acontece primeiro no localStorage
 * (via recipeService, sempre funciona offline). Quando há um usuário
 * logado (userId), cada mutação também é espelhada no Supabase em segundo
 * plano (silenciosamente — se estiver offline, a próxima sincronização
 * completa, feita pelo hook useSync, resolve as pendências).
 */
export function useRecipes(userId?: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    const data = await recipeService.getRecipes()
    setRecipes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addRecipe = useCallback(
    async (data: RecipeFormData) => {
      const created = await recipeService.createRecipe(data)
      setRecipes((prev) => [created, ...prev])
      if (userId) syncService.pushRecipe(created, userId)
      return created
    },
    [userId]
  )

  const editRecipe = useCallback(
    async (id: string, data: RecipeFormData) => {
      const updated = await recipeService.updateRecipe(id, data)
      if (updated) {
        setRecipes((prev) => prev.map((r) => (r.id === id ? updated : r)))
        if (userId) syncService.pushRecipe(updated, userId)
      }
      return updated
    },
    [userId]
  )

  const removeRecipe = useCallback(
    async (id: string) => {
      await recipeService.deleteRecipe(id)
      setRecipes((prev) => prev.filter((r) => r.id !== id))
      if (userId) syncService.deleteRemoteRecipe(id, userId)
    },
    [userId]
  )

  const toggleFavorite = useCallback(
    async (id: string) => {
      const updated = await recipeService.toggleFavorite(id)
      if (updated) {
        setRecipes((prev) => prev.map((r) => (r.id === id ? updated : r)))
        if (userId) syncService.pushRecipe(updated, userId)
      }
      return updated
    },
    [userId]
  )

  const importRecipes = useCallback(
    async (imported: Recipe[]) => {
      await recipeService.replaceAllRecipes(imported)
      setRecipes(imported)
      if (userId) {
        await Promise.all(imported.map((r) => syncService.pushRecipe(r, userId)))
      }
    },
    [userId]
  )

  const clearAll = useCallback(async () => {
    await recipeService.clearAllRecipes()
    setRecipes([])
  }, [])

  /** Usado internamente pelo hook useSync após uma sincronização completa. */
  const applySyncedRecipes = useCallback(async (synced: Recipe[]) => {
    await recipeService.replaceAllRecipes(synced)
    setRecipes(synced)
  }, [])

  return {
    recipes,
    loading,
    reload,
    addRecipe,
    editRecipe,
    removeRecipe,
    toggleFavorite,
    importRecipes,
    clearAll,
    applySyncedRecipes,
  }
}
