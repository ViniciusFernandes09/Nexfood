import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Heart, Tag, PlusCircle, Settings, ChefHat } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/recipes', label: 'Minhas receitas', icon: BookOpen, end: false },
  { to: '/favorites', label: 'Favoritas', icon: Heart, end: false },
  { to: '/categories', label: 'Categorias', icon: Tag, end: false },
  { to: '/recipes/new', label: 'Nova receita', icon: PlusCircle, end: false },
  { to: '/settings', label: 'Configurações', icon: Settings, end: false },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <ChefHat size={26} />
        <span>NexFood</span>
      </div>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'is-active' : ''}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <p className="sidebar__footer">Seu livro de receitas, sempre à mão. 📖</p>
    </aside>
  )
}
