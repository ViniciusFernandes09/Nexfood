import type { Recipe } from '@/types/recipe'
import type { Category } from '@/types/category'
import { RecipeCard } from '@/components/RecipeCard/RecipeCard'

interface RecipeGridProps {
  recipes: Recipe[]
  categories: Category[]
  onToggleFavorite: (id: string) => void
  layout?: 'grid' | 'list'
}

export function RecipeGrid({
  recipes,
  categories,
  onToggleFavorite,
  layout = 'grid',
}: RecipeGridProps) {
  const categoryLabel = (id: string) => {
    const category = categories.find((c) => c.id === id)
    return category ? `${category.icon} ${category.name}` : id
  }

  return (
    <div className={`recipe-grid recipe-grid--${layout}`}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onToggleFavorite={onToggleFavorite}
          layout={layout}
          categoryLabel={categoryLabel(recipe.category)}
        />
      ))}
    </div>
  )
}
