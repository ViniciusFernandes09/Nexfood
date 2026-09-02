import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useAppContext } from '@/components/Layout/Layout'
import { CategoryCard } from '@/components/CategoryCard/CategoryCard'
import { Modal, ConfirmDialog } from '@/components/Modal/Modal'
import { useToast } from '@/context/ToastContext'
import type { Category } from '@/types/category'

const COMMON_EMOJIS = ['🍝', '🍔', '🍰', '🥗', '🍲', '🍗', '🍞', '🥤', '🍕', '🍣', '🍜', '🥐']

export function Categories() {
  const { recipesApi, categoriesApi } = useAppContext()
  const { recipes } = recipesApi
  const { categories, addCategory, editCategory, removeCategory } = categoriesApi
  const { showToast } = useToast()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(COMMON_EMOJIS[0])
  const [toDelete, setToDelete] = useState<Category | null>(null)

  const countByCategory = (categoryId: string) =>
    recipes.filter((r) => r.category === categoryId).length

  function openNewForm() {
    setEditing(null)
    setName('')
    setIcon(COMMON_EMOJIS[0])
    setFormOpen(true)
  }

  function openEditForm(category: Category) {
    setEditing(category)
    setName(category.name)
    setIcon(category.icon)
    setFormOpen(true)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return

    if (editing) {
      await editCategory(editing.id, name.trim(), icon)
      showToast('Categoria atualizada com sucesso!')
    } else {
      await addCategory(name.trim(), icon)
      showToast('Categoria criada com sucesso!')
    }
    setFormOpen(false)
  }

  async function handleDelete() {
    if (!toDelete) return
    await removeCategory(toDelete.id)
    showToast('Categoria excluída.', 'info')
    setToDelete(null)
  }

  return (
    <div className="categories-page">
      <div className="categories-page__header">
        <h1>Categorias</h1>
        <button type="button" className="btn btn--primary btn--sm" onClick={openNewForm}>
          <Plus size={16} /> Nova categoria
        </button>
      </div>

      <div className="categories-page__grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            recipeCount={countByCategory(category.id)}
            onEdit={openEditForm}
            onDelete={setToDelete}
          />
        ))}
      </div>

      <Modal
        open={formOpen}
        title={editing ? 'Editar categoria' : 'Nova categoria'}
        onClose={() => setFormOpen(false)}
      >
        <form onSubmit={handleSubmit} className="category-form">
          <label htmlFor="category-name">Nome da categoria</label>
          <input
            id="category-name"
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Massas"
            required
          />

          <span className="category-form__label">Ícone</span>
          <div className="category-form__emojis">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`category-form__emoji ${icon === emoji ? 'is-selected' : ''}`}
                onClick={() => setIcon(emoji)}
                aria-pressed={icon === emoji}
                aria-label={`Selecionar ícone ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="confirm-dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setFormOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary">
              {editing ? 'Salvar alterações' : 'Criar categoria'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${toDelete?.name}"? Esta ação não poderá ser desfeita. As receitas desta categoria não serão excluídas.`}
        confirmLabel="Excluir"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
