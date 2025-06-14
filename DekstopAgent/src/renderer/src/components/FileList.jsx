import { useEffect, useState, useRef } from 'react'
import { fetchProviderFiles, syncFile } from '../api/fileService'

function FileList({ providerId }) {
  const [files, setFiles] = useState([])
  const filesRef = useRef([]) // Keeps track of current files for comparison

  // Compare if file arrays are different (basic check, can be improved)
  const hasFilesChanged = (newFiles, oldFiles) => {
    if (newFiles.length !== oldFiles.length) return true

    for (let i = 0; i < newFiles.length; i++) {
      if (
        newFiles[i].ipfsHash !== oldFiles[i].ipfsHash ||
        newFiles[i].fileName !== oldFiles[i].fileName ||
        newFiles[i].isSynced !== oldFiles[i].isSynced
      ) {
        return true
      }
    }

    return false
  }

  const loadFiles = async () => {
    try {
      const data = await fetchProviderFiles(providerId)
      const cleanedData = data.filter(Boolean)

      if (hasFilesChanged(cleanedData, filesRef.current)) {
        setFiles(cleanedData)
        filesRef.current = cleanedData
        console.log('🔁 Files updated')
      } else {
        // console.log('✅ No file change detected')
      }
    } catch (err) {
      console.error('Error loading files:', err)
    }
  }

  useEffect(() => {
    if (!providerId) return

    loadFiles() // Load immediately on mount

    const interval = setInterval(() => {
      loadFiles()
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval) // Clean up on unmount
  }, [providerId])

  const handleSync = async (ipfsHash) => {
    try {
      const result = await syncFile(ipfsHash)
      if (result.success) {
        alert('✅ File synced!')
        await loadFiles() // Refresh files after sync
      } else {
        alert(`❌ Sync failed: ${result.message}`)
      }
    } catch (err) {
      console.error('❌ Sync failed:', err)
      alert('Sync failed')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">📦 Files Assigned to You</h1>

      <ul className="space-y-3">
        {files.length === 0 ? (
          <p className="text-gray-500">No files assigned</p>
        ) : (
          files.map((file) => (
            <li
              key={file.ipfsHash}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              <span className="truncate w-2/3 text-gray-800">{file.fileName}</span>
              <button
                onClick={() => handleSync(file.ipfsHash)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Sync
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default FileList
