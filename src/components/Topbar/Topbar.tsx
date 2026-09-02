import { useNavigate } from 'react-router-dom'
import { ChefHat, Plus, Sun, Moon } from 'lucide-react'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { useTheme } from '@/context/ThemeContext'

interface TopbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function Topbar({ search, onSearchChange }: TopbarProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  function handleSearchSubmitNavigate(value: string) {
    onSearchChange(value)
    navigate('/recipes')
  }

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <ChefHat size={22} />
        <span>NexFood</span>
      </div>

      <div className="topbar__search">
        <SearchBar value={search} onChange={handleSearchSubmitNavigate} />
      </div>

      <div className="topbar__actions">
        <button
          type="button"
          className="icon-btn icon-btn--lg"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => navigate('/recipes/new')}
        >
          <Plus size={16} /> Nova receita
        </button>

        <div className="topbar__avatar" aria-hidden="true">
          👨‍🍳
        </div>
      </div>
    </header>
  )
}
