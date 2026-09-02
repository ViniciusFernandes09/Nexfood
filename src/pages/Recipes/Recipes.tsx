import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, BookOpen } from 'lucide-react'
import { useAppContext } from '@/components/Layout/Layout'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { RecipeGrid } from '@/components/RecipeGrid/RecipeGrid'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import type { Difficulty, SortOption } from '@/types/recipe'
import { DIFFICULTY_LABELS } from '@/types/recipe'

export function Recipes() {
  const { recipesApi, categoriesApi, search, setSearch } = useAppContext()
  const { recipes, toggleFavorite } = recipesApi
  const { categories } = categoriesApi

  const [searchParams, setSearchParams] = useSearchParams()
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<SortOption>('recent')

  const categoryFilter = searchParams.get('category') ?? ''
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('')
  const [maxTimeFilter, setMaxTimeFilter] = useState<number | ''>('')
  const [minRatingFilter, setMinRatingFilter] = useState<number | ''>('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  function handleCategoryChange(value: string) {
    if (value) {
      setSearchParams({ category: value })
    } else {
      setSearchParams({})
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    let result = recipes.filter((recipe) => {
      const matchesSearch =
        !query ||
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(query))

      const matchesCategory = !categoryFilter || recipe.category === categoryFilter
      const matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter
      const matchesTime =
        !maxTimeFilter || recipe.preparationTime + recipe.cookingTime <= Number(maxTimeFilter)
      const matchesRating = !minRatingFilter || recipe.rating >= Number(minRatingFilter)
      const matchesFavorite = !favoritesOnly || recipe.favorite

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesTime &&
        matchesRating &&
        matchesFavorite
      )
    })

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'name-asc':
          return a.title.localeCompare(b.title, 'pt-BR')
        case 'name-desc':
          return b.title.localeCompare(a.title, 'pt-BR')
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return result
  }, [recipes, search, categoryFilter, difficultyFilter, maxTimeFilter, minRatingFilter, favoritesOnly, sort])

  return (
    <div className="recipes-page">
      <div className="recipes-page__header">
        <h1>Minhas receitas</h1>
        <div className="recipes-page__view-toggle" role="group" aria-label="Modo de visualização">
          <button
            type="button"
            className={layout === 'grid' ? 'is-active' : ''}
            onClick={() => setLayout('grid')}
            aria-label="Ver em grade"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            className={layout === 'list' ? 'is-active' : ''}
            onClick={() => setLayout('list')}
            aria-label="Ver em lista"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="recipes-page__search">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="recipes-page__filters">
        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value)}
          aria-label="Filtrar por categoria"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | '')}
          aria-label="Filtrar por dificuldade"
        >
          <option value="">Qualquer dificuldade</option>
          {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={maxTimeFilter}
          onChange={(e) => setMaxTimeFilter(e.target.value ? Number(e.target.value) : '')}
          aria-label="Filtrar por tempo máximo de preparo"
        >
          <option value="">Qualquer tempo</option>
          <option value="20">Até 20 min</option>
          <option value="40">Até 40 min</option>
          <option value="60">Até 1h</option>
          <option value="120">Até 2h</option>
        </select>

        <select
          value={minRatingFilter}
          onChange={(e) => setMinRatingFilter(e.target.value ? Number(e.target.value) : '')}
          aria-label="Filtrar por avaliação mínima"
        >
          <option value="">Qualquer avaliação</option>
          <option value="3">3+ estrelas</option>
          <option value="4">4+ estrelas</option>
          <option value="5">5 estrelas</option>
        </select>

        <label className="checkbox-filter">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
          />
          Só favoritas
        </label>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Ordenar receitas"
          className="recipes-page__sort"
        >
          <option value="recent">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
          <option value="name-asc">Nome A-Z</option>
          <option value="name-desc">Nome Z-A</option>
          <option value="rating">Melhor avaliação</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <RecipeGrid
          recipes={filtered}
          categories={categories}
          onToggleFavorite={toggleFavorite}
          layout={layout}
        />
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma receita encontrada"
          description="Tente ajustar a pesquisa ou os filtros."
        />
      )}
    </div>
  )
}
