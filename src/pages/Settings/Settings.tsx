import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Sun, Moon, Download, Upload, Trash2, Cloud, CloudOff, RefreshCw, LogOut } from 'lucide-react'
import { useAppContext } from '@/components/Layout/Layout'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { ConfirmDialog } from '@/components/Modal/Modal'
import type { Recipe } from '@/types/recipe'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { recipesApi, syncApi } = useAppContext()
  const { recipes, importRecipes, clearAll } = recipesApi
  const { syncing, lastSyncedAt, syncNow } = syncApi
  const { isConfigured, user, signOut } = useAuth()
  const { showToast } = useToast()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  function handleExport() {
    const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nexfood-receitas-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Receitas exportadas com sucesso!')
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result as string) as Recipe[]
        if (!Array.isArray(parsed)) throw new Error('Formato inválido')
        await importRecipes(parsed)
        showToast('Receitas importadas com sucesso!')
      } catch (error) {
        console.error(error)
        showToast('Não foi possível importar este arquivo. Verifique o formato JSON.', 'error')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  async function handleClearAll() {
    await clearAll()
    showToast('Todas as receitas foram removidas.', 'info')
    setConfirmClear(false)
  }

  async function handleSyncNow() {
    const success = await syncNow()
    if (success) {
      showToast('Sincronização concluída!')
    } else {
      showToast(
        'Não foi possível sincronizar. Verifique sua internet e se as tabelas do Supabase foram criadas (veja o console do navegador para detalhes).',
        'error'
      )
    }
  }

  async function handleSignOut() {
    await signOut()
    showToast('Você saiu da sua conta.', 'info')
  }

  return (
    <div className="settings-page">
      <h1>Configurações</h1>

      <section className="settings-section">
        <h2>Aparência</h2>
        <p className="settings-section__description">Escolha como o aplicativo deve ser exibido.</p>
        <div className="theme-toggle">
          <button
            type="button"
            className={`theme-toggle__option ${theme === 'light' ? 'is-active' : ''}`}
            onClick={() => setTheme('light')}
          >
            <Sun size={18} /> Claro
          </button>
          <button
            type="button"
            className={`theme-toggle__option ${theme === 'dark' ? 'is-active' : ''}`}
            onClick={() => setTheme('dark')}
          >
            <Moon size={18} /> Escuro
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>{isConfigured ? <><Cloud size={18} /> Conta e sincronização</> : <><CloudOff size={18} /> Sincronização</>}</h2>

        {isConfigured ? (
          <>
            <p className="settings-section__description">
              Logado como <strong>{user?.email}</strong>. Suas receitas são salvas neste
              dispositivo (funcionam offline) e sincronizadas automaticamente com a nuvem
              sempre que houver internet.
            </p>

            <div className="sync-status">
              <span className={`sync-status__dot ${syncing ? 'is-syncing' : ''}`} />
              {syncing
                ? 'Sincronizando...'
                : lastSyncedAt
                  ? `Última sincronização: ${lastSyncedAt.toLocaleTimeString('pt-BR')}`
                  : 'Ainda não sincronizado nesta sessão'}
            </div>

            <div className="settings-section__actions">
              <button type="button" className="btn btn--ghost" onClick={handleSyncNow} disabled={syncing}>
                <RefreshCw size={16} className={syncing ? 'spin' : ''} /> Sincronizar agora
              </button>
              <button type="button" className="btn btn--ghost" onClick={handleSignOut}>
                <LogOut size={16} /> Sair da conta
              </button>
            </div>
          </>
        ) : (
          <p className="settings-section__description">
            A sincronização com a nuvem (Supabase) não está configurada. O app está funcionando
            100% local, salvo apenas neste navegador. Veja o README do projeto para ativar login
            e sincronização entre dispositivos.
          </p>
        )}
      </section>

      <section className="settings-section">
        <h2>Seus dados</h2>
        <p className="settings-section__description">
          {isConfigured
            ? 'Além da sincronização automática, você pode exportar ou importar suas receitas manualmente a qualquer momento.'
            : 'Suas receitas ficam salvas apenas neste navegador (localStorage). Use a exportação para fazer backup ou levar suas receitas para outro dispositivo.'}
        </p>

        <div className="settings-section__actions">
          <button type="button" className="btn btn--ghost" onClick={handleExport}>
            <Download size={16} /> Exportar receitas (JSON)
          </button>

          <button type="button" className="btn btn--ghost" onClick={handleImportClick}>
            <Upload size={16} /> Importar receitas (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImportFile}
          />
        </div>
      </section>

      <section className="settings-section settings-section--danger">
        <h2>Zona de risco</h2>
        <p className="settings-section__description">
          Isso removerá permanentemente todas as suas receitas salvas neste dispositivo
          {isConfigured ? ' (a cópia na nuvem não é apagada automaticamente).' : '.'}
        </p>
        <button type="button" className="btn btn--danger" onClick={() => setConfirmClear(true)}>
          <Trash2 size={16} /> Limpar todos os dados
        </button>
      </section>

      <ConfirmDialog
        open={confirmClear}
        title="Limpar todos os dados"
        description="Tem certeza que deseja excluir todas as suas receitas deste dispositivo? Esta ação não poderá ser desfeita. Considere exportar seus dados antes."
        confirmLabel="Limpar tudo"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  )
}
