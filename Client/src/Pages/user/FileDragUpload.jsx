import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const FileDragUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [providerId, setProviderId] = useState(''); // capture providerId
  const xhrRef = useRef(null);

const onDrop = acceptedFiles => {
  const file = acceptedFiles[0];
  if (!file || !providerId) {
    alert('Please select a provider first.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('providerId', providerId);

  const xhr = new XMLHttpRequest();
  xhrRef.current = xhr;

  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percentComplete = Math.round((event.loaded / event.total) * 100);
      setUploadProgress(percentComplete);
    }
  });

  xhr.upload.addEventListener('loadstart', () => {
    setUploading(true);
    setUploadProgress(0);
  });

  xhr.upload.addEventListener('loadend', () => {
    setUploading(false);
    xhrRef.current = null;
  });

  xhr.open('POST', 'http://localhost:5000/file/upload');
  xhr.withCredentials = true;  // <-- This line enables credentials
  xhr.send(formData);
};


  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      setUploading(false);
      setUploadProgress(0);
      xhrRef.current = null;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="w-full p-10 border-2 border-dashed border-amber-400 rounded-md text-center bg-black text-gray-300 hover:border-amber-400 cursor-pointer transition-colors flex flex-col items-center justify-center text-xl">
      {/* Provider Selector */}
      <select
        className="mb-4 p-2 bg-black text-white rounded"
        value={providerId}
        onChange={(e) => setProviderId(e.target.value)}
      >
        <option value="">Select a Provider</option>
        <option value="providerObjectId1">Provider 1</option>
        <option value="providerObjectId2">Provider 2</option>
        {/* Dynamically populate this if needed */}
      </select>

      <div {...getRootProps()} className="w-full">
        <input {...getInputProps()} />
        {
          isDragActive
            ? <p>Drop the files here ...</p>
            : <p>Drag & drop files here, or <span className="text-amber-400">click to upload</span></p>
        }
      </div>

      {uploading && (
        <>
          <div className="w-full bg-gray-700 rounded mt-4 h-4">
            <div
              className="bg-gradient-to-r from-white to-amber-400 h-4 rounded"
              style={{ width: `${uploadProgress}%`, transition: 'width 0.3s' }}
            />
          </div>
          <button
            onClick={cancelUpload}
            className="mt-3 px-6 py-2 bg-white rounded-xl text-black hover:bg-gray-300 transition-all font-manrope hover:cursor-pointer"
          >
            Cancel Upload
          </button>
        </>
      )}

      {uploadProgress === 100 && !uploading && (
        <p className="mt-2 text-green-400">Upload complete!</p>
      )}
    </div>
  );
};

export default FileDragUpload;
