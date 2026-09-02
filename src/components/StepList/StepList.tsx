import { Plus, Trash2 } from 'lucide-react'
import type { Step } from '@/types/recipe'
import { generateId } from '@/utils/generateId'

interface StepListProps {
  steps: Step[]
  onChange: (steps: Step[]) => void
}

export function StepList({ steps, onChange }: StepListProps) {
  function reorder(list: Step[]): Step[] {
    return list.map((step, index) => ({ ...step, order: index + 1 }))
  }

  function handleAdd() {
    onChange(reorder([...steps, { id: generateId('step'), order: 0, description: '' }]))
  }

  function handleRemove(id: string) {
    onChange(reorder(steps.filter((step) => step.id !== id)))
  }

  function handleUpdate(id: string, description: string) {
    onChange(steps.map((step) => (step.id === id ? { ...step, description } : step)))
  }

  return (
    <div className="dynamic-list">
      {steps.length === 0 && (
        <p className="dynamic-list__empty">Nenhuma etapa adicionada ainda.</p>
      )}

      {steps.map((step, index) => (
        <div key={step.id} className="dynamic-list__row dynamic-list__row--step">
          <span className="dynamic-list__step-number">{index + 1}</span>
          <textarea
            className="input input--grow textarea"
            placeholder={`Descreva a etapa ${index + 1}...`}
            value={step.description}
            onChange={(e) => handleUpdate(step.id, e.target.value)}
            rows={2}
            aria-label={`Descrição da etapa ${index + 1}`}
          />
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => handleRemove(step.id)}
            aria-label={`Remover etapa ${index + 1}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button type="button" className="btn btn--ghost btn--sm" onClick={handleAdd}>
        <Plus size={16} /> Adicionar etapa
      </button>
    </div>
  )
}
