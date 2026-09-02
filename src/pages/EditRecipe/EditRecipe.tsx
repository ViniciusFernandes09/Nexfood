import { useParams } from 'react-router-dom'
import { useAppContext } from '@/components/Layout/Layout'
import { RecipeForm } from '@/pages/RecipeForm/RecipeForm'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { BookX } from 'lucide-react'

export function EditRecipe() {
  const { id } = useParams<{ id: string }>()
  const { recipesApi } = useAppContext()
  const { recipes, loading } = recipesApi

  const recipe = recipes.find((r) => r.id === id)

  if (loading) return null

  if (!recipe) {
    return (
      <EmptyState
        icon={BookX}
        title="Receita não encontrada"
        description="Ela pode ter sido excluída."
      />
    )
  }

  return <RecipeForm mode="edit" initialRecipe={recipe} />
}
