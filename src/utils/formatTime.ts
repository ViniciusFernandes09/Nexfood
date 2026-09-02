/**
 * Formata um tempo em minutos para um texto legível, ex: "1h 20min".
 */
export function formatTime(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return '—'

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}min`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}min`
}

/**
 * Formata uma data ISO para o padrão brasileiro (dd/mm/aaaa).
 */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('pt-BR')
}
