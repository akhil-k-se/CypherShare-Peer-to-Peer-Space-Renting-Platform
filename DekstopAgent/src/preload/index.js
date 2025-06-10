import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Expose APIs only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      syncFile: (ipfsHash) => ipcRenderer.invoke('sync-file', ipfsHash),
      sendProviderId: (providerId) => ipcRenderer.send('set-provider-id', providerId)
    })
  } catch (error) {
    console.error('Error exposing APIs in preload:', error)
  }
} else {
  // Fallback if contextIsolation is disabled (not recommended)
  window.electron = electronAPI
  window.api = api
}
