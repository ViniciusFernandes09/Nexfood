import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Heart,
  Pencil,
  Trash2,
  Clock,
  Flame,
  Timer,
  Users,
  BarChart3,
  ImageOff,
  ArrowLeft,
  BookX,
} from 'lucide-react'
import { useAppContext } from '@/components/Layout/Layout'
import { Rating } from '@/components/Rating/Rating'
import { ConfirmDialog } from '@/components/Modal/Modal'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { DIFFICULTY_LABELS } from '@/types/recipe'
import { formatTime } from '@/utils/formatTime'
import { useToast } from '@/context/ToastContext'

export function RecipeDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipesApi, categoriesApi } = useAppContext()
  const { recipes, toggleFavorite, removeRecipe, loading } = recipesApi
  const { categories } = categoriesApi
  const { showToast } = useToast()

  const recipe = recipes.find((r) => r.id === id)

  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (loading) return null

  if (!recipe) {
    return (
      <EmptyState
        icon={BookX}
        title="Receita não encontrada"
        description="Ela pode ter sido excluída ou o link está incorreto."
        action={
          <Link to="/recipes" className="btn btn--primary">
            Voltar para receitas
          </Link>
        }
      />
    )
  }

  const category = categories.find((c) => c.id === recipe.category)

  function toggleIngredient(ingId: string) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev)
      next.has(ingId) ? next.delete(ingId) : next.add(ingId)
      return next
    })
  }

  function toggleStep(stepId: string) {
    setCheckedSteps((prev) => {
      const next = new Set(prev)
      next.has(stepId) ? next.delete(stepId) : next.add(stepId)
      return next
    })
  }

  async function handleDelete() {
    await removeRecipe(recipe!.id)
    showToast('Receita excluída.', 'info')
    navigate('/recipes')
  }

  return (
    <div className="recipe-details">
      <button type="button" className="recipe-details__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="recipe-details__hero">
        {imageError || !recipe.image ? (
          <div className="recipe-details__image-fallback">
            <ImageOff size={40} strokeWidth={1.5} />
          </div>
        ) : (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="recipe-details__image"
            onError={() => setImageError(true)}
          />
        )}

        <button
          type="button"
          className={`recipe-details__favorite ${recipe.favorite ? 'is-active' : ''}`}
          onClick={() => toggleFavorite(recipe.id)}
          aria-pressed={recipe.favorite}
          aria-label={recipe.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={20} fill={recipe.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <header className="recipe-details__header">
        <div>
          <span className="recipe-details__category">
            {category ? `${category.icon} ${category.name}` : recipe.category}
          </span>
          <h1>{recipe.title}</h1>
          {recipe.description && <p className="recipe-details__description">{recipe.description}</p>}
          <Rating value={recipe.rating} readOnly size={17} />
          {recipe.tags.length > 0 && (
            <div className="tag-list">
              {recipe.tags.map((tag) => (
                <span key={tag} className="tag-chip tag-chip--static">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="recipe-details__actions">
          <Link to={`/recipes/${recipe.id}/edit`} className="btn btn--ghost">
            <Pencil size={16} /> Editar
          </Link>
          <button type="button" className="btn btn--danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} /> Excluir
          </button>
        </div>
      </header>

      <section className="recipe-details__info">
        <div className="info-pill">
          <Clock size={18} />
          <span className="info-pill__label">Preparo</span>
          <span className="info-pill__value">{formatTime(recipe.preparationTime)}</span>
        </div>
        <div className="info-pill">
          <Flame size={18} />
          <span className="info-pill__label">Cozimento</span>
          <span className="info-pill__value">{formatTime(recipe.cookingTime)}</span>
        </div>
        <div className="info-pill">
          <Timer size={18} />
          <span className="info-pill__label">Tempo total</span>
          <span className="info-pill__value">
            {formatTime(recipe.preparationTime + recipe.cookingTime)}
          </span>
        </div>
        <div className="info-pill">
          <Users size={18} />
          <span className="info-pill__label">Porções</span>
          <span className="info-pill__value">{recipe.servings}</span>
        </div>
        <div className="info-pill">
          <BarChart3 size={18} />
          <span className="info-pill__label">Dificuldade</span>
          <span className="info-pill__value">{DIFFICULTY_LABELS[recipe.difficulty]}</span>
        </div>
      </section>

      <div className="recipe-details__columns">
        <section className="recipe-details__section">
          <h2>Ingredientes</h2>
          <ul className="checklist">
            {recipe.ingredients.map((ingredient) => {
              const checked = checkedIngredients.has(ingredient.id)
              return (
                <li key={ingredient.id}>
                  <label className={`checklist__item ${checked ? 'is-checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleIngredient(ingredient.id)}
                    />
                    <span>
                      {ingredient.quantity} {ingredient.unit} de {ingredient.name}
                    </span>
                  </label>
                </li>
              )
            })}
            {recipe.ingredients.length === 0 && (
              <p className="dynamic-list__empty">Nenhum ingrediente cadastrado.</p>
            )}
          </ul>
        </section>

        <section className="recipe-details__section">
          <h2>Modo de preparo</h2>
          <ol className="steps-list">
            {recipe.steps
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((step, index) => {
                const checked = checkedSteps.has(step.id)
                return (
                  <li key={step.id} className={`steps-list__item ${checked ? 'is-checked' : ''}`}>
                    <span className="steps-list__number">{index + 1}</span>
                    <div className="steps-list__content">
                      <p>{step.description}</p>
                      <label className="steps-list__check">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStep(step.id)}
                        />
                        Concluído
                      </label>
                    </div>
                  </li>
                )
              })}
            {recipe.steps.length === 0 && (
              <p className="dynamic-list__empty">Nenhuma etapa cadastrada.</p>
            )}
          </ol>
        </section>
      </div>

      {recipe.notes && (
        <section className="recipe-details__section recipe-details__notes">
          <h2>Observações pessoais</h2>
          <p>{recipe.notes}</p>
        </section>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir receita"
        description="Tem certeza que deseja excluir esta receita? Esta ação não poderá ser desfeita."
        confirmLabel="Excluir"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
