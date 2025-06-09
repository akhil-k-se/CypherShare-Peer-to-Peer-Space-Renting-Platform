import { useEffect, useState } from 'react'
import { fetchProviderFiles } from '../api/fileService'
import { syncFile } from '../api/fileService'  // your wrapped function


function FileList({ providerId }) {
  const [files, setFiles] = useState([])

  // Extracted fetch function
  const loadFiles = async () => {
    try {
      console.log(providerId)
      const data = await fetchProviderFiles(providerId)
      console.log('Checking data ', data)

      // Remove null or undefined entries
      const cleanedData = data.filter(Boolean)
      setFiles(cleanedData)
    } catch (err) {
      console.error('Error loading files:', err)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [providerId])


const handleSync = async (ipfsHash) => {
  try {
    const result = await syncFile(ipfsHash)  // call wrapped function
    if (result.success) {
      alert('✅ File synced!')
      await loadFiles() // reload files after sync
    } else {
      alert(`Sync failed: ${result.message}`)
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
        {files.map((file) => (
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
        ))}
      </ul>
    </div>
  )
}

export default FileList
