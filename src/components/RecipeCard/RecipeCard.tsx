import { Link } from 'react-router-dom'
import { Heart, Clock, ImageOff } from 'lucide-react'
import { useState } from 'react'
import type { Recipe } from '@/types/recipe'
import { DIFFICULTY_LABELS } from '@/types/recipe'
import { formatTime } from '@/utils/formatTime'
import { Rating } from '@/components/Rating/Rating'

interface RecipeCardProps {
  recipe: Recipe
  onToggleFavorite: (id: string) => void
  layout?: 'grid' | 'list'
  categoryLabel?: string
}

export function RecipeCard({
  recipe,
  onToggleFavorite,
  layout = 'grid',
  categoryLabel,
}: RecipeCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <article className={`recipe-card recipe-card--${layout}`}>
      <Link to={`/recipes/${recipe.id}`} className="recipe-card__image-link">
        {imageError || !recipe.image ? (
          <div className="recipe-card__image-fallback">
            <ImageOff size={28} strokeWidth={1.5} />
          </div>
        ) : (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="recipe-card__image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </Link>

      <button
        type="button"
        className={`recipe-card__favorite ${recipe.favorite ? 'is-active' : ''}`}
        onClick={() => onToggleFavorite(recipe.id)}
        aria-pressed={recipe.favorite}
        aria-label={recipe.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart size={18} fill={recipe.favorite ? 'currentColor' : 'none'} />
      </button>

      <div className="recipe-card__body">
        <Link to={`/recipes/${recipe.id}`} className="recipe-card__title-link">
          <h3 className="recipe-card__title">{recipe.title}</h3>
        </Link>

        <div className="recipe-card__meta">
          <span className="recipe-card__category">{categoryLabel ?? recipe.category}</span>
          <span className="recipe-card__dot">•</span>
          <span className="recipe-card__time">
            <Clock size={13} /> {formatTime(recipe.preparationTime + recipe.cookingTime)}
          </span>
          <span className="recipe-card__dot">•</span>
          <span className="recipe-card__difficulty">
            {DIFFICULTY_LABELS[recipe.difficulty]}
          </span>
        </div>

        <Rating value={recipe.rating} readOnly size={13} />
      </div>
    </article>
  )
}
