import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/services/supabaseClient'

interface AuthContextValue {
  /** Se false, o Supabase não foi configurado (.env vazio) — app roda 100% local, sem login. */
  isConfigured: boolean
  user: User | null
  /** Nome que a pessoa digitou ao criar a conta (user_metadata.full_name), se houver. */
  userName: string | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (name: string, email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    if (!supabase) return { error: 'Supabase não configurado.' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? traduzirErro(error.message) : null }
  }

  async function signUp(name: string, email: string, password: string) {
    if (!supabase) return { error: 'Supabase não configurado.' }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
      },
    })
    return { error: error ? traduzirErro(error.message) : null }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const user = session?.user ?? null
  const userName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() || null

  return (
    <AuthContext.Provider
      value={{
        isConfigured: isSupabaseConfigured,
        user,
        userName,
        session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function traduzirErro(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (lower.includes('user already registered')) return 'Já existe uma conta com este e-mail.'
  if (lower.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (lower.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).'
  return message
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
