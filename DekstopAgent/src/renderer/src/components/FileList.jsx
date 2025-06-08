import { useEffect, useState } from 'react';
import { fetchProviderFiles, syncFile } from '../api/fileService';

function FileList({ providerId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        console.log(providerId);
        
        const data = await fetchProviderFiles(providerId);
        setFiles(data.files);
      } catch (err) {
        console.error('Error loading files:', err);
      }
    };

    loadFiles();
  }, [providerId]);

  const handleSync = async (ipfsHash) => {
    try {
      await syncFile(ipfsHash);
      alert('✅ File synced!');
    } catch (err) {
      console.error('❌ Sync failed:', err);
      alert('Sync failed');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">📦 Files Assigned to You</h1>
      <ul className="space-y-3">
        {files.map((file) => (
          <li key={file._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <span className="truncate w-2/3 text-gray-800">{file.originalName}</span>
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
  );
}

export default FileList;
