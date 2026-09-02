import { Link } from 'react-router-dom'
import { BookX } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState/EmptyState'

export function NotFound() {
  return (
    <div className="not-found-page">
      <EmptyState
        icon={BookX}
        title="Página não encontrada"
        description="A página que você está procurando não existe."
        action={
          <Link to="/" className="btn btn--primary">
            Voltar para o início
          </Link>
        }
      />
    </div>
  )
}
