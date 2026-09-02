import type { Category } from '@/types/category'
import { generateId } from '@/utils/generateId'
import { seedCategories } from '@/data/seedCategories'
import { readFromStorage, writeToStorage } from './storage'

// Mantém o prefixo antigo da chave (compatibilidade com dados já salvos
// antes do app se chamar "NexFood") — não renomear.
const STORAGE_KEY = 'meu-livro-de-receitas:categories'

function loadAll(): Category[] {
  return readFromStorage<Category[]>(STORAGE_KEY, seedCategories)
}

function saveAll(categories: Category[]): void {
  writeToStorage(STORAGE_KEY, categories)
}

export async function getCategories(): Promise<Category[]> {
  return loadAll()
}

export async function createCategory(
  name: string,
  icon: string
): Promise<Category> {
  const categories = loadAll()
  const newCategory: Category = {
    id: generateId('cat'),
    name,
    icon,
    custom: true,
  }
  saveAll([...categories, newCategory])
  return newCategory
}

export async function updateCategory(
  id: string,
  name: string,
  icon: string
): Promise<Category | undefined> {
  const categories = loadAll()
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return undefined

  categories[index] = { ...categories[index], name, icon }
  saveAll(categories)
  return categories[index]
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = loadAll().filter((c) => c.id !== id)
  saveAll(categories)
}

export async function replaceAllCategories(categories: Category[]): Promise<void> {
  saveAll(categories)
}
