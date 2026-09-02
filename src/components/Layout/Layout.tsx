import { Outlet, useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { MobileNav } from '@/components/MobileNav/MobileNav'
import { Topbar } from '@/components/Topbar/Topbar'
import { useRecipes } from '@/hooks/useRecipes'
import { useCategories } from '@/hooks/useCategories'
import { useSync } from '@/hooks/useSync'
import { useAuth } from '@/context/AuthContext'

export interface AppOutletContext {
  recipesApi: ReturnType<typeof useRecipes>
  categoriesApi: ReturnType<typeof useCategories>
  syncApi: ReturnType<typeof useSync>
  search: string
  setSearch: (value: string) => void
}

export function Layout() {
  const { user } = useAuth()
  const recipesApi = useRecipes(user?.id)
  const categoriesApi = useCategories(user?.id)
  const syncApi = useSync(user?.id, recipesApi, categoriesApi)
  const [search, setSearch] = useState('')

  const context: AppOutletContext = { recipesApi, categoriesApi, syncApi, search, setSearch }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-shell__main">
        <Topbar search={search} onSearchChange={setSearch} />
        <main className="app-shell__content">
          <Outlet context={context} />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}

/** Hook de conveniência para as páginas acessarem o contexto compartilhado. */
export function useAppContext() {
  return useOutletContext<AppOutletContext>()
}
