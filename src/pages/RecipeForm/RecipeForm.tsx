import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, X, Check } from 'lucide-react'
import { useAppContext } from '@/components/Layout/Layout'
import { IngredientList } from '@/components/IngredientList/IngredientList'
import { StepList } from '@/components/StepList/StepList'
import { Rating } from '@/components/Rating/Rating'
import { useToast } from '@/context/ToastContext'
import type { Difficulty, Recipe, RecipeFormData } from '@/types/recipe'
import { DIFFICULTY_LABELS } from '@/types/recipe'
import { formatTime } from '@/utils/formatTime'

interface RecipeFormProps {
  initialRecipe?: Recipe
  mode: 'create' | 'edit'
}

const emptyFormData: RecipeFormData = {
  title: '',
  description: '',
  image: '',
  category: '',
  tags: [],
  preparationTime: 0,
  cookingTime: 0,
  servings: 4,
  difficulty: 'facil',
  rating: 0,
  ingredients: [],
  steps: [],
  notes: '',
}

export function RecipeForm({ initialRecipe, mode }: RecipeFormProps) {
  const { recipesApi, categoriesApi } = useAppContext()
  const { addRecipe, editRecipe } = recipesApi
  const { categories } = categoriesApi
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RecipeFormData>(
    initialRecipe
      ? {
          title: initialRecipe.title,
          description: initialRecipe.description,
          image: initialRecipe.image,
          category: initialRecipe.category,
          tags: initialRecipe.tags,
          preparationTime: initialRecipe.preparationTime,
          cookingTime: initialRecipe.cookingTime,
          servings: initialRecipe.servings,
          difficulty: initialRecipe.difficulty,
          rating: initialRecipe.rating,
          ingredients: initialRecipe.ingredients,
          steps: initialRecipe.steps,
          notes: initialRecipe.notes,
        }
      : { ...emptyFormData, category: categories[0]?.id ?? '' }
  )
  const [tagInput, setTagInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  function update<K extends keyof RecipeFormData>(field: K, value: RecipeFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      update('image', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleAddTag() {
    const tag = tagInput.trim().toLowerCase()
    if (!tag || formData.tags.includes(tag)) {
      setTagInput('')
      return
    }
    update('tags', [...formData.tags, tag])
    setTagInput('')
  }

  function handleRemoveTag(tag: string) {
    update(
      'tags',
      formData.tags.filter((t) => t !== tag)
    )
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!formData.title.trim() || !formData.category) return

    setSubmitting(true)
    try {
      if (mode === 'edit' && initialRecipe) {
        await editRecipe(initialRecipe.id, formData)
        showToast('Receita atualizada com sucesso!')
      } else {
        const created = await addRecipe(formData)
        showToast('Receita salva com sucesso!')
        setSaved(true)
        setTimeout(() => navigate(`/recipes/${created.id}`), 700)
        return
      }
      navigate(`/recipes/${initialRecipe!.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  const totalTime = formData.preparationTime + formData.cookingTime

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h1>{mode === 'edit' ? 'Editar receita' : 'Nova receita'}</h1>

      <section className="form-section">
        <h2>Informações básicas</h2>

        <div className="form-field">
          <label htmlFor="title">Nome da receita *</label>
          <input
            id="title"
            type="text"
            className="input"
            value={formData.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Ex: Lasanha à Bolonhesa"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            className="input textarea"
            value={formData.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Um breve resumo sobre esta receita..."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="category">Categoria *</label>
            <select
              id="category"
              className="input"
              value={formData.category}
              onChange={(e) => update('category', e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione...
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Foto da receita</label>
            <label className="image-upload">
              <ImagePlus size={18} />
              <span>{formData.image ? 'Trocar imagem' : 'Enviar imagem'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          </div>
        </div>

        {formData.image && (
          <div className="image-preview">
            <img src={formData.image} alt="Pré-visualização da receita" />
            <button
              type="button"
              className="icon-btn icon-btn--danger"
              onClick={() => update('image', '')}
              aria-label="Remover imagem"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="form-field">
          <label htmlFor="tags">Tags</label>
          <div className="tag-input">
            <input
              id="tags"
              type="text"
              className="input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="Ex: rápido, família (pressione Enter)"
            />
            <button type="button" className="btn btn--ghost btn--sm" onClick={handleAddTag}>
              Adicionar
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="tag-list">
              {formData.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remover tag ${tag}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="form-section">
        <h2>Informações da receita</h2>

        <div className="form-row form-row--4">
          <div className="form-field">
            <label htmlFor="prepTime">Tempo de preparo (min)</label>
            <input
              id="prepTime"
              type="number"
              min={0}
              className="input"
              value={formData.preparationTime}
              onChange={(e) => update('preparationTime', Number(e.target.value) || 0)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="cookTime">Tempo de cozimento (min)</label>
            <input
              id="cookTime"
              type="number"
              min={0}
              className="input"
              value={formData.cookingTime}
              onChange={(e) => update('cookingTime', Number(e.target.value) || 0)}
            />
          </div>
          <div className="form-field">
            <label>Tempo total</label>
            <p className="form-field__readonly">{formatTime(totalTime)}</p>
          </div>
          <div className="form-field">
            <label htmlFor="servings">Porções</label>
            <input
              id="servings"
              type="number"
              min={1}
              className="input"
              value={formData.servings}
              onChange={(e) => update('servings', Number(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="difficulty">Dificuldade</label>
            <select
              id="difficulty"
              className="input"
              value={formData.difficulty}
              onChange={(e) => update('difficulty', e.target.value as Difficulty)}
            >
              {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Avaliação pessoal</label>
            <Rating value={formData.rating} onChange={(v) => update('rating', v)} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2>Ingredientes</h2>
        <IngredientList
          ingredients={formData.ingredients}
          onChange={(ingredients) => update('ingredients', ingredients)}
        />
      </section>

      <section className="form-section">
        <h2>Modo de preparo</h2>
        <StepList steps={formData.steps} onChange={(steps) => update('steps', steps)} />
      </section>

      <section className="form-section">
        <h2>Observações</h2>
        <textarea
          className="input textarea"
          value={formData.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder='Ex: "Use menos açúcar na próxima vez."'
          rows={3}
        />
      </section>

      <div className="recipe-form__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {saved ? (
            <>
              <Check size={16} /> Receita salva!
            </>
          ) : (
            'Salvar receita'
          )}
        </button>
      </div>
    </form>
  )
}
