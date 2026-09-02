import { Star } from 'lucide-react'

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
  readOnly?: boolean
}

export function Rating({ value, onChange, size = 16, readOnly = false }: RatingProps) {
  const stars = [1, 2, 3, 4, 5]

  if (readOnly || !onChange) {
    return (
      <span className="rating" aria-label={`Avaliação: ${value} de 5 estrelas`}>
        {stars.map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= Math.round(value) ? 'currentColor' : 'none'}
            className="rating__star"
          />
        ))}
        <span className="rating__value">{value.toFixed(1)}</span>
      </span>
    )
  }

  return (
    <span className="rating rating--editable" role="radiogroup" aria-label="Avalie esta receita">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className="rating__button"
          onClick={() => onChange(star)}
          aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          role="radio"
          aria-checked={value === star}
        >
          <Star size={size + 6} fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </span>
  )
}
