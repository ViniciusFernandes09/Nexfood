/**
 * Camada genérica de acesso ao localStorage.
 *
 * Toda a aplicação acessa dados persistidos através deste módulo (ou dos
 * serviços que o utilizam, como recipeService e categoryService).
 * Isso mantém a lógica de persistência isolada dos componentes React e
 * facilita a futura substituição por chamadas a uma API REST
 * (por exemplo, um backend Spring Boot): basta reescrever os serviços,
 * mantendo a mesma assinatura de funções (getRecipes, createRecipe, etc.).
 */

export function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.error(`Erro ao ler "${key}" do localStorage`, error)
    return fallback
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Erro ao salvar "${key}" no localStorage`, error)
  }
}

export function removeFromStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`Erro ao remover "${key}" do localStorage`, error)
  }
}
