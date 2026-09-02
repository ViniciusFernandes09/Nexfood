import { useCallback, useEffect, useRef, useState } from 'react'
import type { useRecipes } from './useRecipes'
import type { useCategories } from './useCategories'
import * as syncService from '@/services/syncService'

/**
 * Roda a sincronização completa (nuvem <-> local) quando o usuário loga e
 * sempre que a conexão com a internet volta. Não faz nada se não houver
 * usuário logado (app continua 100% local nesse caso).
 *
 * IMPORTANTE: só dispara a primeira sincronização depois que o
 * carregamento local inicial (localStorage) já terminou. Sem isso, a
 * sincronização podia rodar usando uma lista local ainda vazia (antes do
 * useEffect de leitura do localStorage terminar) e sobrescrever os dados
 * locais com um resultado incompleto.
 */
export function useSync(
  userId: string | undefined,
  recipesApi: ReturnType<typeof useRecipes>,
  categoriesApi: ReturnType<typeof useCategories>
) {
  const [syncing, setSyncing] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)

  const recipesRef = useRef(recipesApi.recipes)
  recipesRef.current = recipesApi.recipes
  const categoriesRef = useRef(categoriesApi.categories)
  categoriesRef.current = categoriesApi.categories

  const syncNow = useCallback(async () => {
    if (!userId) return false
    setSyncing(true)
    const result = await syncService.runFullSync(userId, recipesRef.current, categoriesRef.current)
    if (result) {
      await recipesApi.applySyncedRecipes(result.recipes)
      await categoriesApi.applySyncedCategories(result.categories)
      setLastSyncedAt(new Date())
    }
    setSyncing(false)
    return Boolean(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const localDataReady = !recipesApi.loading && !categoriesApi.loading

  useEffect(() => {
    if (!userId) return
    if (!localDataReady) return // aguarda o localStorage terminar de carregar antes da 1ª sync

    syncNow()

    function handleOnline() {
      syncNow()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, localDataReady])

  return { syncing, lastSyncedAt, syncNow }
}
