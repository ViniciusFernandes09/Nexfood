import type { Recipe, RecipeFormData } from '@/types/recipe'
import { generateId } from '@/utils/generateId'
import { seedRecipes } from '@/data/seedRecipes'
import { readFromStorage, writeToStorage } from './storage'

/**
 * Camada de acesso a dados das receitas.
 *
 * Toda a aplicação deve falar com receitas exclusivamente através destas
 * funções, nunca acessando o localStorage diretamente nos componentes.
 * Isso permite que, no futuro, esta implementação seja trocada por chamadas
 * HTTP a uma API REST (ex: Spring Boot) sem alterar nenhum componente —
 * basta reescrever o corpo destas funções para usar fetch/axios, mantendo
 * as mesmas assinaturas (idealmente retornando Promises, como já é feito
 * aqui via async/await).
 */

// Mantém o prefixo antigo da chave de propósito (compatibilidade com dados já
// salvos por quem já usava o app antes de ele se chamar "NexFood") — mudar
// isso faria quem já tem receitas salvas "perder" tudo ao abrir o app de novo.
const STORAGE_KEY = 'meu-livro-de-receitas:recipes'

function loadAll(): Recipe[] {
  return readFromStorage<Recipe[]>(STORAGE_KEY, seedRecipes)
}

function saveAll(recipes: Recipe[]): void {
  writeToStorage(STORAGE_KEY, recipes)
}

export async function getRecipes(): Promise<Recipe[]> {
  return loadAll()
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  return loadAll().find((recipe) => recipe.id === id)
}

export async function createRecipe(data: RecipeFormData): Promise<Recipe> {
  const recipes = loadAll()
  const now = new Date().toISOString()

  const newRecipe: Recipe = {
    ...data,
    id: generateId('recipe'),
    favorite: false,
    createdAt: now,
    updatedAt: now,
  }

  saveAll([newRecipe, ...recipes])
  return newRecipe
}

export async function updateRecipe(
  id: string,
  data: RecipeFormData
): Promise<Recipe | undefined> {
  const recipes = loadAll()
  const index = recipes.findIndex((recipe) => recipe.id === id)
  if (index === -1) return undefined

  const updated: Recipe = {
    ...recipes[index],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  }

  recipes[index] = updated
  saveAll(recipes)
  return updated
}

export async function deleteRecipe(id: string): Promise<void> {
  const recipes = loadAll().filter((recipe) => recipe.id !== id)
  saveAll(recipes)
}

export async function toggleFavorite(id: string): Promise<Recipe | undefined> {
  const recipes = loadAll()
  const index = recipes.findIndex((recipe) => recipe.id === id)
  if (index === -1) return undefined

  recipes[index] = { ...recipes[index], favorite: !recipes[index].favorite }
  saveAll(recipes)
  return recipes[index]
}

export async function replaceAllRecipes(recipes: Recipe[]): Promise<void> {
  saveAll(recipes)
}

export async function clearAllRecipes(): Promise<void> {
  saveAll([])
}
