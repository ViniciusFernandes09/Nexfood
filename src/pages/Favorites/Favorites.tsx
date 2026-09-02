import { Heart } from 'lucide-react'
import { useAppContext } from '@/components/Layout/Layout'
import { RecipeGrid } from '@/components/RecipeGrid/RecipeGrid'
import { EmptyState } from '@/components/EmptyState/EmptyState'

export function Favorites() {
  const { recipesApi, categoriesApi } = useAppContext()
  const { recipes, toggleFavorite } = recipesApi
  const { categories } = categoriesApi

  const favorites = recipes.filter((r) => r.favorite)

  return (
    <div className="favorites-page">
      <h1>Receitas favoritas</h1>

      {favorites.length > 0 ? (
        <RecipeGrid recipes={favorites} categories={categories} onToggleFavorite={toggleFavorite} />
      ) : (
        <EmptyState
          icon={Heart}
          title="Você ainda não possui receitas favoritas."
          description="Adicione receitas aos favoritos para encontrá-las rapidamente."
        />
      )}
    </div>
  )
}
