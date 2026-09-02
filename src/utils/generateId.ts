/**
 * Gera um identificador único simples, suficiente para uso local
 * (localStorage). Não depende de bibliotecas externas.
 */
export function generateId(prefix = 'id'): string {
  const random = Math.random().toString(36).slice(2, 10)
  const timestamp = Date.now().toString(36)
  return `${prefix}_${timestamp}${random}`
}
