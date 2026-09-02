import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * true somente se o usuário preencheu o .env com as credenciais do
 * Supabase. Se não preencheu, o app inteiro continua funcionando
 * normalmente, só que 100% local (sem login, sem sincronização) —
 * nenhuma outra parte do código deve assumir que o Supabase existe
 * sem checar esta flag antes.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
