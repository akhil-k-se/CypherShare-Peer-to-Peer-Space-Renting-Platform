import { useEffect, useState, useRef } from 'react'
import { fetchProviderFiles, syncFile } from '../api/fileService'

function FileList({ providerId }) {
  const [files, setFiles] = useState([])
  const filesRef = useRef([])

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
      }
    } catch (err) {
      console.error('Error loading files:', err)
    }
  }

  useEffect(() => {
    if (!providerId) return

    loadFiles()
    const interval = setInterval(() => {
      loadFiles()
    }, 2000)

    return () => clearInterval(interval)
  }, [providerId])

  const handleSync = async (ipfsHash) => {
    try {
      const result = await syncFile(ipfsHash)
      if (result.success) {
        alert('✅ File synced!')
        await loadFiles()
      } else {
        alert(`❌ Sync failed: ${result.message}`)
      }
    } catch (err) {
      console.error('❌ Sync failed:', err)
      alert('Sync failed')
    }
  }

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-screen text-white font-orbitron">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white tracking-wide">
        📦 Files Assigned to You
      </h1>

      <ul className="space-y-4">
        {files.length === 0 ? (
          <p className="text-gray-500">No files assigned</p>
        ) : (
          files.map((file) => (
            <li
              key={file.ipfsHash}
              className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 flex justify-between items-center shadow-md transition hover:shadow-lg"
            >
              <span className="truncate w-2/3 text-gray-300 text-sm sm:text-base">
                {file.fileName}
              </span>
              <button
                onClick={() => handleSync(file.ipfsHash)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm sm:text-base"
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
