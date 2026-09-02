import { GripVertical, Plus, Trash2 } from 'lucide-react'
import type { Ingredient } from '@/types/recipe'
import { generateId } from '@/utils/generateId'

interface IngredientListProps {
  ingredients: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
}

export function IngredientList({ ingredients, onChange }: IngredientListProps) {
  function handleAdd() {
    onChange([...ingredients, { id: generateId('ing'), quantity: '', unit: '', name: '' }])
  }

  function handleRemove(id: string) {
    onChange(ingredients.filter((ingredient) => ingredient.id !== id))
  }

  function handleUpdate(id: string, field: keyof Ingredient, value: string) {
    onChange(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    )
  }

  function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= ingredients.length) return
    const updated = [...ingredients]
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    onChange(updated)
  }

  return (
    <div className="dynamic-list">
      {ingredients.length === 0 && (
        <p className="dynamic-list__empty">Nenhum ingrediente adicionado ainda.</p>
      )}

      {ingredients.map((ingredient, index) => (
        <div key={ingredient.id} className="dynamic-list__row">
          <button
            type="button"
            className="dynamic-list__drag"
            onClick={() => handleMove(index, -1)}
            disabled={index === 0}
            aria-label="Mover ingrediente para cima"
            title="Mover para cima"
          >
            <GripVertical size={16} />
          </button>

          <input
            type="text"
            className="input input--sm"
            placeholder="Qtd."
            value={ingredient.quantity}
            onChange={(e) => handleUpdate(ingredient.id, 'quantity', e.target.value)}
            aria-label="Quantidade"
          />
          <input
            type="text"
            className="input input--sm"
            placeholder="Unidade"
            value={ingredient.unit}
            onChange={(e) => handleUpdate(ingredient.id, 'unit', e.target.value)}
            aria-label="Unidade de medida"
          />
          <input
            type="text"
            className="input input--grow"
            placeholder="Nome do ingrediente"
            value={ingredient.name}
            onChange={(e) => handleUpdate(ingredient.id, 'name', e.target.value)}
            aria-label="Nome do ingrediente"
          />

          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => handleRemove(ingredient.id)}
            aria-label="Remover ingrediente"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button type="button" className="btn btn--ghost btn--sm" onClick={handleAdd}>
        <Plus size={16} /> Adicionar ingrediente
      </button>
    </div>
  )
}
