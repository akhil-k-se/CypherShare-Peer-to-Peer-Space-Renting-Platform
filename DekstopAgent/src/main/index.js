import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'
import os from 'os'
import axios from 'axios'
import crypto from 'crypto'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load URL in development or static file in production
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('sync-file', async (event, ipfsHash) => {
    try {
      const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs'

      const response = await axios.get(`${IPFS_GATEWAY}/${ipfsHash}`, {
        responseType: 'arraybuffer'
      })

      const encryptedBuffer = Buffer.from(response.data)

      const storageDir = path.join(os.homedir(), '.cyphershare')
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true })
      }

      const fileHashName = crypto.createHash('sha256').update(ipfsHash).digest('hex') + '.enc'

      const filePath = path.join(storageDir, fileHashName)
      fs.writeFileSync(filePath, encryptedBuffer)

      return {
        success: true,
        message: '✅ File synced and saved locally on provider',
        filePath
      }
    } catch (err) {
      console.error('❌ File sync error:', err)
      return {
        success: false,
        error: err.message
      }
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
