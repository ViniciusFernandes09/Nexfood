import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Home } from '@/pages/Home/Home'
import { Recipes } from '@/pages/Recipes/Recipes'
import { RecipeDetails } from '@/pages/RecipeDetails/RecipeDetails'
import { NewRecipe } from '@/pages/NewRecipe/NewRecipe'
import { EditRecipe } from '@/pages/EditRecipe/EditRecipe'
import { Favorites } from '@/pages/Favorites/Favorites'
import { Categories } from '@/pages/Categories/Categories'
import { Settings } from '@/pages/Settings/Settings'
import { NotFound } from '@/pages/NotFound/NotFound'
import { Login } from '@/pages/Login/Login'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'

/**
 * Controla o acesso às rotas do app com base no login.
 * - Se o Supabase não foi configurado (.env vazio): libera tudo direto,
 *   o app funciona 100% local, sem tela de login.
 * - Se foi configurado: exige login antes de mostrar qualquer receita.
 */
function AuthGate() {
  const { isConfigured, user, loading } = useAuth()

  if (!isConfigured) return <Outlet />

  if (loading) {
    return (
      <div className="auth-loading">
        <span>Carregando...</span>
      </div>
    )
  }

  if (!user) return <Login />

  return <Outlet />
}

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              <Route element={<AuthGate />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/recipes/new" element={<NewRecipe />} />
                  <Route path="/recipes/:id" element={<RecipeDetails />} />
                  <Route path="/recipes/:id/edit" element={<EditRecipe />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </HashRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
