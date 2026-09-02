import type { Recipe } from '@/types/recipe'
import type { Category } from '@/types/category'
import { supabase } from './supabaseClient'

/**
 * Camada de sincronização do modelo híbrido.
 *
 * Filosofia: o localStorage é sempre a fonte da verdade "imediata" — o app
 * lê e escreve nele primeiro, então tudo continua funcionando sem internet
 * (inclusive na cozinha, com wifi ruim). O Supabase entra como uma cópia
 * de segurança/sincronização que roda por trás:
 *   - push*: envia uma alteração local para a nuvem (silenciosa, sem
 *     travar a UI se estiver offline — os erros são só logados).
 *   - pull*: busca tudo que está na nuvem.
 *   - runFullSync: roda no login (e ao reconectar) comparando local x
 *     remoto por "updatedAt" (o mais recente vence) e deixa os dois lados
 *     iguais no final.
 *
 * "Lápides" (tombstones): quando um item é excluído, além de removê-lo da
 * tabela, gravamos um registro em `tombstones` dizendo "este id foi
 * excluído nesta data". Sem isso, um outro dispositivo que ainda tem uma
 * cópia local antiga do item não teria como diferenciar "isto é uma
 * receita nova que ainda não sincronizei" de "isto foi excluído em outro
 * lugar" — as duas situações parecem idênticas (existe local, não existe
 * remoto). Com a lápide, o app sabe que deve remover a cópia local também,
 * em vez de reenviá-la para a nuvem.
 */

type TombstoneKind = 'recipe' | 'category'

// ---------- Conversão Recipe (camelCase) <-> linha do Supabase (snake_case) ----------

function recipeToRow(recipe: Recipe, userId: string) {
  return {
    id: recipe.id,
    user_id: userId,
    title: recipe.title,
    description: recipe.description,
    image: recipe.image,
    category: recipe.category,
    tags: recipe.tags,
    preparation_time: recipe.preparationTime,
    cooking_time: recipe.cookingTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    rating: recipe.rating,
    favorite: recipe.favorite,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    notes: recipe.notes,
    created_at: recipe.createdAt,
    updated_at: recipe.updatedAt,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRecipe(row: any): Recipe {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    image: row.image ?? '',
    category: row.category ?? '',
    tags: row.tags ?? [],
    preparationTime: row.preparation_time ?? 0,
    cookingTime: row.cooking_time ?? 0,
    servings: row.servings ?? 1,
    difficulty: row.difficulty ?? 'facil',
    rating: Number(row.rating) || 0,
    favorite: Boolean(row.favorite),
    ingredients: row.ingredients ?? [],
    steps: row.steps ?? [],
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function categoryToRow(category: Category, userId: string) {
  return {
    id: category.id,
    user_id: userId,
    name: category.name,
    icon: category.icon,
    custom: category.custom,
    updated_at: new Date().toISOString(),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    custom: Boolean(row.custom),
  }
}

// ---------- Tombstones (registro de exclusões) ----------

async function pushTombstone(id: string, kind: TombstoneKind, userId: string): Promise<void> {
  if (!supabase) return
  try {
    const { error } = await supabase
      .from('tombstones')
      .upsert({ id, kind, user_id: userId, deleted_at: new Date().toISOString() })
    if (error) console.warn('Falha ao registrar exclusão no Supabase:', error.message)
  } catch (error) {
    console.warn('Falha ao registrar exclusão remota (offline?):', error)
  }
}

interface TombstoneMaps {
  recipes: Map<string, string>
  categories: Map<string, string>
}

async function fetchTombstones(userId: string): Promise<TombstoneMaps> {
  const empty: TombstoneMaps = { recipes: new Map(), categories: new Map() }
  if (!supabase) return empty

  const { data, error } = await supabase
    .from('tombstones')
    .select('id, kind, deleted_at')
    .eq('user_id', userId)

  if (error) {
    console.warn('Falha ao buscar exclusões do Supabase:', error.message)
    return empty
  }

  const recipes = new Map<string, string>()
  const categories = new Map<string, string>()
  for (const row of data ?? []) {
    const target = row.kind === 'recipe' ? recipes : categories
    target.set(row.id, row.deleted_at)
  }
  return { recipes, categories }
}

/**
 * Remove do array local qualquer item que tenha uma lápide mais recente do
 * que a última alteração local dele — ou seja, foi excluído em outro
 * dispositivo depois da última vez que este dispositivo o alterou.
 * (Se o item local foi editado DEPOIS da exclusão remota, ele sobrevive —
 * interpretamos isso como "recriação" intencional.)
 */
function removeTombstoned<T extends { id: string }>(
  items: T[],
  tombstones: Map<string, string>,
  getUpdatedAt: (item: T) => string | undefined
): T[] {
  return items.filter((item) => {
    const deletedAt = tombstones.get(item.id)
    if (!deletedAt) return true
    const updatedAt = getUpdatedAt(item)
    if (!updatedAt) return false // sem data de referência: lápide vence
    return new Date(updatedAt) > new Date(deletedAt)
  })
}

// ---------- Push individual (chamado após cada mutação local) ----------

export async function pushRecipe(recipe: Recipe, userId: string): Promise<void> {
  if (!supabase) return
  try {
    const { error } = await supabase.from('recipes').upsert(recipeToRow(recipe, userId))
    if (error) console.warn('Falha ao sincronizar receita com o Supabase:', error.message)
  } catch (error) {
    console.warn('Falha ao sincronizar receita (offline?):', error)
  }
}

export async function deleteRemoteRecipe(id: string, userId: string): Promise<void> {
  if (!supabase) return
  try {
    const { error } = await supabase.from('recipes').delete().eq('id', id).eq('user_id', userId)
    if (error) console.warn('Falha ao excluir receita no Supabase:', error.message)
  } catch (error) {
    console.warn('Falha ao excluir receita remota (offline?):', error)
  }
  await pushTombstone(id, 'recipe', userId)
}

export async function pushCategory(category: Category, userId: string): Promise<void> {
  if (!supabase) return
  try {
    const { error } = await supabase.from('categories').upsert(categoryToRow(category, userId))
    if (error) console.warn('Falha ao sincronizar categoria com o Supabase:', error.message)
  } catch (error) {
    console.warn('Falha ao sincronizar categoria (offline?):', error)
  }
}

export async function deleteRemoteCategory(id: string, userId: string): Promise<void> {
  if (!supabase) return
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id).eq('user_id', userId)
    if (error) console.warn('Falha ao excluir categoria no Supabase:', error.message)
  } catch (error) {
    console.warn('Falha ao excluir categoria remota (offline?):', error)
  }
  await pushTombstone(id, 'category', userId)
}

// ---------- Sincronização completa (login / reconexão) ----------

function mergeById<T extends { id: string }>(
  local: T[],
  remote: T[],
  getUpdatedAt: (item: T) => string | undefined
): { merged: T[]; toPush: T[] } {
  const byId = new Map<string, T>()
  const toPush: T[] = []

  for (const item of local) byId.set(item.id, item)

  for (const remoteItem of remote) {
    const localItem = byId.get(remoteItem.id)
    if (!localItem) {
      byId.set(remoteItem.id, remoteItem)
      continue
    }
    const localTime = getUpdatedAt(localItem)
    const remoteTime = getUpdatedAt(remoteItem)
    if (localTime && remoteTime && new Date(localTime) > new Date(remoteTime)) {
      // versão local é mais nova: mantém local e marca para reenviar
      toPush.push(localItem)
    } else {
      byId.set(remoteItem.id, remoteItem)
    }
  }

  // itens que só existem localmente (nunca sincronizados) precisam ser enviados
  const remoteIds = new Set(remote.map((r) => r.id))
  for (const item of local) {
    if (!remoteIds.has(item.id) && !toPush.includes(item)) {
      toPush.push(item)
    }
  }

  return { merged: Array.from(byId.values()), toPush }
}

export interface FullSyncResult {
  recipes: Recipe[]
  categories: Category[]
}

/**
 * Roda a sincronização completa: busca tudo da nuvem (receitas, categorias
 * e lápides de exclusão), remove localmente qualquer item que foi excluído
 * em outro dispositivo, compara o que sobrou (o mais recente por
 * "updatedAt" vence) e envia de volta qualquer coisa local que estava mais
 * atualizada ou que nunca tinha sido sincronizada. Retorna o resultado já
 * mesclado, para o app salvar como o novo estado local.
 */
export async function runFullSync(
  userId: string,
  localRecipes: Recipe[],
  localCategories: Category[]
): Promise<FullSyncResult | null> {
  if (!supabase) return null

  try {
    const [
      { data: recipeRows, error: recipeError },
      { data: categoryRows, error: categoryError },
      tombstones,
    ] = await Promise.all([
      supabase.from('recipes').select('*').eq('user_id', userId),
      supabase.from('categories').select('*').eq('user_id', userId),
      fetchTombstones(userId),
    ])

    if (recipeError || categoryError) {
      console.warn('Falha ao buscar dados do Supabase:', recipeError?.message ?? categoryError?.message)
      return null
    }

    const remoteRecipes = (recipeRows ?? []).map(rowToRecipe)
    const remoteCategories = (categoryRows ?? []).map(rowToCategory)

    // Remove localmente (e da lista remota, por segurança) tudo que foi excluído em outro lugar.
    const survivingLocalRecipes = removeTombstoned(localRecipes, tombstones.recipes, (r) => r.updatedAt)
    const survivingRemoteRecipes = removeTombstoned(remoteRecipes, tombstones.recipes, (r) => r.updatedAt)
    const survivingLocalCategories = removeTombstoned(localCategories, tombstones.categories, () => undefined)
    const survivingRemoteCategories = removeTombstoned(remoteCategories, tombstones.categories, () => undefined)

    const recipesMerge = mergeById(survivingLocalRecipes, survivingRemoteRecipes, (r) => r.updatedAt)
    const categoriesMerge = mergeById(survivingLocalCategories, survivingRemoteCategories, () => undefined)

    // Se o usuário nunca sincronizou categorias antes (nuvem vazia), envia as atuais.
    const categoriesToPush =
      survivingRemoteCategories.length === 0 ? survivingLocalCategories : categoriesMerge.toPush

    await Promise.all([
      ...recipesMerge.toPush.map((r) => pushRecipe(r, userId)),
      ...categoriesToPush.map((c) => pushCategory(c, userId)),
    ])

    return { recipes: recipesMerge.merged, categories: categoriesMerge.merged }
  } catch (error) {
    console.warn('Falha ao sincronizar com o Supabase (offline?):', error)
    return null
  }
}
