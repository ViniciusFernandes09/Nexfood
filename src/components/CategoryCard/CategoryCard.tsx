import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import type { Category } from '@/types/category'

interface CategoryCardProps {
  category: Category
  recipeCount: number
  onEdit?: (category: Category) => void
  onDelete?: (category: Category) => void
}

export function CategoryCard({ category, recipeCount, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="category-card">
      <Link to={`/recipes?category=${category.id}`} className="category-card__link">
        <span className="category-card__icon">{category.icon}</span>
        <span className="category-card__name">{category.name}</span>
        <span className="category-card__count">
          {recipeCount} {recipeCount === 1 ? 'receita' : 'receitas'}
        </span>
      </Link>
      {category.custom && (onEdit || onDelete) && (
        <div className="category-card__actions">
          {onEdit && (
            <button
              type="button"
              className="icon-btn"
              onClick={() => onEdit(category)}
              aria-label={`Editar categoria ${category.name}`}
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="icon-btn icon-btn--danger"
              onClick={() => onDelete(category)}
              aria-label={`Excluir categoria ${category.name}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
