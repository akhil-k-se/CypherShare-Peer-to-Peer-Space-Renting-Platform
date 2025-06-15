import { useState } from 'react'
import { loginProvider } from '../api/authService'

import axios from 'axios'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handlePendingDeletions(providerId) {
    window.electronAPI
      .handlePendingDeletions(providerId)
      .then((res) => {
        if (res.success) {
          console.log('✅ Pending deletions processed.')
        } else {
          console.error('❌ Error in deletions:', res.error)
        }
      })
      .catch((err) => {
        console.error('❌ IPC Error:', err.message)
      })
  }
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true) // Show loading screen

      const data = await loginProvider(email, password)
      console.log('✅ Login successful:', data)

      await handlePendingDeletions(data.id)

      // ✅ Tell main process the providerId
      if (window.electronAPI?.sendProviderId) {
        const tunnelRes = await window.electronAPI.sendProviderId(data.id)
        if (!tunnelRes || !tunnelRes.success) {
          throw new Error(tunnelRes?.error || 'Tunnel failed to start')
        }
        console.log('🌐 Tunnel is ready:', tunnelRes.publicUrl)
      } else {
        throw new Error('electronAPI.sendProviderId not available')
      }

      setLoading(false)
      onLogin(data) // ✅ Only call after tunnel is ready
    } catch (err) {
      setLoading(false)
      console.error('❌ Login failed:', err.message || err)
      alert('Login failed: ' + (err.response?.data?.error || err.message))
    }
  }

  return loading ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
        <p className="text-lg text-gray-700 font-semibold">Logging...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-xl space-y-4 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center">Provider Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
