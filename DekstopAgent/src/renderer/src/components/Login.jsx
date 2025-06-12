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
        console.log('✅ Pending deletions processed.');
      } else {
        console.error('❌ Error in deletions:', res.error);
      }
    })
    .catch((err) => {
      console.error('❌ IPC Error:', err.message);
    });
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await loginProvider(email, password)
      console.log('Login successful:', data)

      onLogin(data) // Sets provider in React state
      
      
      await handlePendingDeletions(data.id);

      // ✅ Send provider ID to Electron main process
      if (window.electronAPI?.sendProviderId) {
        await window.electronAPI.sendProviderId(data.id) // assuming data._id is the provider ID
        console.log(`[Login] Sent provider ID to Electron main process: ${data.id}`)
      } else {
        console.warn('❌ electronAPI.sendProviderId is not available')
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message)
      alert('Invalid email or password')
    }
  }

  return (
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
