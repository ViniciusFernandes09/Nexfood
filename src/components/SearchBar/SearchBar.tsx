import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  large?: boolean
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Pesquisar receitas...',
  large = false,
}: SearchBarProps) {
  return (
    <div className={`search-bar ${large ? 'search-bar--large' : ''}`}>
      <Search size={large ? 22 : 18} className="search-bar__icon" />
      <label className="sr-only" htmlFor="search-input">
        {placeholder}
      </label>
      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="search-bar__input"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Limpar pesquisa"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
