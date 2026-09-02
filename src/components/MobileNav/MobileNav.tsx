import { NavLink } from 'react-router-dom'
import { Home, BookOpen, PlusCircle, Heart, Tag } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/recipes', label: 'Receitas', icon: BookOpen, end: false },
  { to: '/recipes/new', label: 'Nova', icon: PlusCircle, end: false },
  { to: '/favorites', label: 'Favoritas', icon: Heart, end: false },
  { to: '/categories', label: 'Categorias', icon: Tag, end: false },
]

export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Navegação principal">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `mobile-nav__link ${isActive ? 'is-active' : ''}`}
        >
          <Icon size={21} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
