import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Heart, Tag } from 'lucide-react'
import { useAppContext } from '@/components/Layout/Layout'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { RecipeGrid } from '@/components/RecipeGrid/RecipeGrid'
import { CategoryCard } from '@/components/CategoryCard/CategoryCard'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { useAuth } from '@/context/AuthContext'

export function Home() {
  const { recipesApi, categoriesApi, search, setSearch } = useAppContext()
  const { recipes, toggleFavorite } = recipesApi
  const { categories } = categoriesApi
  const { userName } = useAuth()

  const firstName = userName?.split(' ')[0]

  const favoriteRecipes = recipes.filter((r) => r.favorite).slice(0, 4)
  const recentRecipes = [...recipes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const countByCategory = (categoryId: string) =>
    recipes.filter((r) => r.category === categoryId).length

  return (
    <div className="home">
      <section className="home__welcome">
        <h1>{firstName ? `Olá, ${firstName}! 👋` : 'Olá! 👋'}</h1>
        <p>Vamos cozinhar alguma coisa?</p>
        <div className="home__search">
          <SearchBar value={search} onChange={setSearch} large />
        </div>
      </section>

      <section className="home__section">
        <div className="home__section-header">
          <h2>
            <Heart size={18} /> Receitas favoritas
          </h2>
          <Link to="/favorites" className="home__see-all">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        {favoriteRecipes.length > 0 ? (
          <RecipeGrid
            recipes={favoriteRecipes}
            categories={categories}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <EmptyState
            icon={Heart}
            title="Nenhuma receita favoritada ainda"
            description="Marque receitas com ❤️ para vê-las por aqui."
          />
        )}
      </section>

      <section className="home__section">
        <div className="home__section-header">
          <h2>
            <BookOpen size={18} /> Adicionadas recentemente
          </h2>
          <Link to="/recipes" className="home__see-all">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        {recentRecipes.length > 0 ? (
          <RecipeGrid
            recipes={recentRecipes}
            categories={categories}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Seu livro de receitas está vazio"
            description="Que tal cadastrar sua primeira receita?"
            action={
              <Link to="/recipes/new" className="btn btn--primary">
                Nova receita
              </Link>
            }
          />
        )}
      </section>

      <section className="home__section">
        <div className="home__section-header">
          <h2>
            <Tag size={18} /> Categorias
          </h2>
          <Link to="/categories" className="home__see-all">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        <div className="home__categories">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              recipeCount={countByCategory(category.id)}
            />
          ))}
        </div>
      </section>

      <section className="home__stats">
        <div className="stat-card">
          <span className="stat-card__value">{recipes.length}</span>
          <span className="stat-card__label">Total de receitas</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{recipes.filter((r) => r.favorite).length}</span>
          <span className="stat-card__label">Total de favoritas</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{categories.length}</span>
          <span className="stat-card__label">Categorias</span>
        </div>
      </section>
    </div>
  )
}
