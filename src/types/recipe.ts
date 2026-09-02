export type Difficulty = 'facil' | 'medio' | 'dificil'

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

export interface Ingredient {
  id: string
  quantity: string
  unit: string
  name: string
}

export interface Step {
  id: string
  order: number
  description: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  category: string
  tags: string[]
  preparationTime: number // minutos
  cookingTime: number // minutos
  servings: number
  difficulty: Difficulty
  rating: number // 0 a 5
  favorite: boolean
  ingredients: Ingredient[]
  steps: Step[]
  notes: string
  createdAt: string
  updatedAt: string
}

/** Dados usados no formulário de criação/edição, antes de virarem um Recipe completo */
export type RecipeFormData = Omit<
  Recipe,
  'id' | 'createdAt' | 'updatedAt' | 'favorite'
>

export type SortOption =
  | 'recent'
  | 'oldest'
  | 'name-asc'
  | 'name-desc'
  | 'rating'

export interface RecipeFilters {
  category?: string
  difficulty?: Difficulty
  maxTime?: number
  minRating?: number
  favoritesOnly?: boolean
  search?: string
}
