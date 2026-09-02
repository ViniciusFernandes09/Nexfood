const { app, BrowserWindow, Menu } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

// Em produção (app empacotado), carregamos o build gerado pelo Vite (dist/index.html).
// Isso exige que "npm run build" já tenha sido executado antes de empacotar.
const DIST_INDEX = path.join(__dirname, '..', 'dist', 'index.html')

function createWindow() {
  const iconPath = path.join(__dirname, 'icon.ico')

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    title: 'NexFood',
    backgroundColor: '#faf6f0',
    autoHideMenuBar: true, // esconde a barra de menu (Arquivo/Editar/...) para parecer um app real
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Remove completamente o menu padrão do Electron.
  Menu.setApplicationMenu(null)

  if (!fs.existsSync(DIST_INDEX)) {
    win.loadURL(
      'data:text/html,<h1 style="font-family:sans-serif;padding:40px">Build não encontrado.</h1>' +
        '<p style="font-family:sans-serif;padding:0 40px">Rode <code>npm run build</code> antes de abrir o app.</p>'
    )
    return
  }

  win.loadFile(DIST_INDEX)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
