import { useState } from 'react'
import type { FormEvent } from 'react'
import { ChefHat, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (mode === 'signup' && !name.trim()) {
      setError('Digite seu nome.')
      return
    }

    setSubmitting(true)

    const result =
      mode === 'signin' ? await signIn(email, password) : await signUp(name, email, password)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (mode === 'signup') {
      setSignupSuccess(true)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">
          <ChefHat size={28} />
          <span>NexFood</span>
        </div>

        <h1>{mode === 'signin' ? 'Entrar' : 'Criar conta'}</h1>
        <p className="login-card__subtitle">
          {mode === 'signin'
            ? 'Entre para sincronizar suas receitas entre dispositivos.'
            : 'Crie sua conta gratuita para guardar suas receitas com segurança.'}
        </p>

        {signupSuccess ? (
          <div className="login-card__success">
            <p>
              Conta criada! Se a confirmação por e-mail estiver ativada no seu projeto Supabase,
              verifique sua caixa de entrada antes de entrar.
            </p>
            <button type="button" className="btn btn--primary" onClick={() => { setMode('signin'); setSignupSuccess(false) }}>
              Ir para o login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            {mode === 'signup' && (
              <div className="form-field">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como podemos te chamar?"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && <p className="login-form__error">{error}</p>}

            <button type="submit" className="btn btn--primary login-form__submit" disabled={submitting}>
              {submitting && <Loader2 size={16} className="spin" />}
              {mode === 'signin' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        )}

        {!signupSuccess && (
          <button
            type="button"
            className="login-card__switch"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError(null)
            }}
          >
            {mode === 'signin' ? 'Não tem conta? Criar uma agora' : 'Já tem conta? Entrar'}
          </button>
        )}
      </div>
    </div>
  )
}
