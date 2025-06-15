import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'
import os from 'os'
import axios from 'axios'
import crypto from 'crypto'

import express from 'express'

import { execFile } from 'child_process'
const { spawn } = require('child_process')

let publicNgrokUrl = null // <- Store this for use elsewhere

// function getNgrokPath() {
//   if (app.isPackaged) {
//     return path.join(process.resourcesPath, 'ngrok.exe')
//   } else {
//     return path.join(__dirname, '..', '..', 'assets', 'ngrok.exe')
//   }
// }

function startCloudflareTunnel() {
  return new Promise((resolve, reject) => {
    const isProd = app.isPackaged

    const cloudflaredPath = isProd
      ? path.join(process.resourcesPath, 'cloudflared.exe')
      : path.join(__dirname, '..', '..', 'assets', 'cloudflared.exe')

    console.log('🚀 Starting Cloudflare tunnel from:', cloudflaredPath)

    const tunnel = spawn(cloudflaredPath, ['tunnel', '--url', 'http://localhost:5175'])

    tunnel.stderr.on('data', (data) => {
      const str = data.toString()
      console.error('[cloudflared error]', str)

      const urlMatch = str.match(/https:\/\/[^\s]+\.trycloudflare\.com/)
      if (urlMatch && !publicNgrokUrl) {
        const publicUrl = urlMatch[0]
        console.log('✅ Cloudflare Public URL (from stderr):', publicUrl)
        publicNgrokUrl = publicUrl
        resolve(publicUrl)
      }
    })

    tunnel.stdout.on('data', (data) => {
      // You can optionally keep this for debugging
      const str = data.toString()
      console.log('[cloudflared]', str)
    })

    tunnel.on('close', (code) => {
      console.log(`💀 Cloudflare tunnel exited with code ${code}`)
    })

    tunnel.on('error', (err) => {
      console.error('❌ Failed to start cloudflared:', err.message)
      reject(err)
    })
  })
}

import AutoLaunch from 'auto-launch'

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return '127.0.0.1'
}

const checkAndSetAutoLaunch = async (providerId) => {
  try {
    if (!providerId) {
      console.warn('⚠️ No providerId provided. Skipping auto-launch setup.')
      return
    }

    console.log(`🔄 Checking startup setting for provider: ${providerId}`)

    const res = await axios.get(
      `https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/provider/getInfo/${providerId}`
    )
    console.log('The data while autStart is ', res.data)

    const isEnabled = res.data?.autoStart

    const cypherAutoLauncher = new AutoLaunch({
      name: 'CypherShare',
      path: process.execPath
    })

    const isCurrentlyEnabled = await cypherAutoLauncher.isEnabled()

    if (isEnabled && !isCurrentlyEnabled) {
      await cypherAutoLauncher.enable()
      console.log('✅ Auto-launch enabled for CypherShare.')
    } else if (!isEnabled && isCurrentlyEnabled) {
      await cypherAutoLauncher.disable()
      console.log('🚫 Auto-launch disabled for CypherShare.')
    } else {
      console.log('ℹ️ Auto-launch state unchanged.')
    }
  } catch (err) {
    console.error('❌ Error in checkAndSetAutoLaunch:', err.message)
  }
}

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
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // mainWindow.webContents.openDevTools()
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

  ipcMain.handle('sync-file', async (_event, ipfsHash) => {
    try {
      console.log('Trying to download IPFS file with hash:', ipfsHash)

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

  ipcMain.handle('handle-pending-deletions', async (event, providerId) => {
    try {
      const res = await axios.get(
        `https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/provider/pendingDeletions/${providerId}`,
        {
          withCredentials: true
        }
      )

      const deletions = res.data.pendingDeletion || []

      for (const file of deletions) {
        const hashedName = crypto.createHash('sha256').update(file.ipfsHash).digest('hex')
        const filePath = path.join(os.homedir(), '.cyphershare', `${hashedName}.enc`)

        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath)
            console.log(`✅ Deleted file: ${filePath}`)

            await axios.post(
              `https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/provider/removePendingDeletionDB/${providerId}`,
              { ipfsHash: file.ipfsHash },
              { withCredentials: true }
            )
          } catch (err) {
            console.error(`❌ Error deleting file ${filePath}:`, err.message)
          }
        } else {
          console.warn(`⚠️ File not found for deletion: ${filePath}`)
        }
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Failed to fetch or delete pending deletions:', err.message)
      return { success: false, error: err.message }
    }
  })

  let globalProviderId = null

  ipcMain.handle('set-provider-id', async (event, providerId) => {
    console.log('📥 Received providerId from renderer:', providerId)
    globalProviderId = providerId

    try {
      const url = await startCloudflareTunnel()
      publicNgrokUrl = url
      console.log('🌐 Tunnel Ready. Public URL:', url)

      await checkAndSetAutoLaunch(globalProviderId)

      console.log('✅ Done with cloudflare and starting heartbeat')

      const ip = getLocalIPAddress()
      const port = 5175

      setInterval(() => {
        if (globalProviderId && publicNgrokUrl) {
          axios
            .post(
              'https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/provider/heartbeat',
              {
                providerId: globalProviderId,
                ip,
                port,
                publicUrl: publicNgrokUrl
              }
            )
            .then(() => console.log('💓 Heartbeat sent'))
            .catch((err) => console.error('❌ Heartbeat error:', err.message))
        } else {
          console.log('⏳ Waiting for public URL or providerId...')
        }
      }, 5000)

      return { success: true, publicUrl: url }
    } catch (err) {
      console.error('❌ Tunnel startup failed:', err.message)
      return { success: false, error: err.message }
    }
  })

  const fileServer = express()
  fileServer.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // Or specify the known frontend/backend origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  })

  const FILE_PORT = 5175
  const ip = getLocalIPAddress()

  fileServer.get('/files/:ipfsHash', (req, res) => {
    const ipfsHash = req.params.ipfsHash
    const originalName = req.query.filename || `${ipfsHash}.enc`
    const mimeType = req.query.type || 'application/octet-stream'

    const filePath = path.join(
      os.homedir(),
      '.cyphershare',
      crypto.createHash('sha256').update(ipfsHash).digest('hex') + '.enc'
    )

    console.log('📥 File request received for IPFS hash:', ipfsHash)
    console.log('📂 Looking for file at path:', filePath)

    if (fs.existsSync(filePath)) {
      console.log('✅ File found. Starting manual stream...')

      res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`)
      res.setHeader('Content-Type', mimeType)

      const fileStream = fs.createReadStream(filePath)

      fileStream.on('error', (err) => {
        console.error('❌ Error while reading file stream:', err.message)
        res.status(500).send('Failed to stream file')
      })

      fileStream.pipe(res)
    } else {
      console.warn('❌ File not found:', filePath)
      res.status(404).send('File not found')
    }
  })

  fileServer.delete('/files/:ipfsHash', (req, res) => {
    const ipfsHash = req.params.ipfsHash

    const filePath = path.join(
      os.homedir(),
      '.cyphershare',
      crypto.createHash('sha256').update(ipfsHash).digest('hex') + '.enc'
    )

    console.log(`🗑️ Delete request received for: ${filePath}`)

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
        console.log(`✅ File deleted: ${filePath}`)
        res.status(200).json({ success: true })
      } catch (err) {
        console.error(`❌ Error deleting file: ${err.message}`)
        res.status(500).json({ error: 'Failed to delete file' })
      }
    } else {
      console.warn(`⚠️ File not found for deletion: ${filePath}`)
      res.status(404).json({ error: 'File not found' })
    }
  })

  fileServer.listen(FILE_PORT, () => {
    console.log(`📡 Local file server running at http://${ip}:${FILE_PORT}`)
  })

  // 🚀 Start the app window
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
