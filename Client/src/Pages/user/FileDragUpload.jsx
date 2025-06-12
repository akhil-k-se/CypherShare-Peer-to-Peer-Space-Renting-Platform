import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileDragUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [providerId, setProviderId] = useState("");
  const xhrRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("providerId", providerId);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    setUploading(true);
    setUploadProgress(0);
    setUploadCompleted(false);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        setUploading(false);
        xhrRef.current = null;

        if (xhr.status === 200) {
          setUploadCompleted(true);

          toast.success("✅File Uploaded Successfully", {
            className:
              "!bg-[#0f0f0f] !text-[#e6ffe6] !border-l-4 !border-[#00ff88] !shadow-lg !shadow-green-500/30 !rounded-md !px-6 !py-4 !font-['Share_Tech_Mono'] !tracking-wider",
            bodyClassName: "!text-sm !uppercase",
            progressClassName: "!bg-[#00ff88]",
            closeButton: false,
            icon: false,
            theme: "dark", // ✅ Keep it "light" to let our styles override
          });
        } else {
          let message = "❌ Upload failed. Please try again.";
          try {
            const res = JSON.parse(xhr.responseText);
            if (res && res.message) {
              message = `❌ Upload failed: ${res.message}`;
            }
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          toast.error(message, {
            className:
              "bg-[#0f0f0f] text-[#fefefe] border-l-4 border-[#ff1f1f] shadow-lg shadow-red-500/30 rounded-md px-6 py-4 font-['Share_Tech_Mono'] tracking-wider",
            progressClassName: "!bg-[#ff1f1f]", // 👈 Enforce red with !important
            closeButton: false,
            icon: false,
            theme: "dark", // 👈 Use light to prevent default dark theming
          });
        }
      }
    };

    xhr.open("POST", "https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/file/upload");
    xhr.withCredentials = true;
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
    <div className="w-full max-w-xl mx-auto p-10 border-2 border-dashed border-amber-400 rounded-md text-center bg-black text-gray-300 hover:border-amber-400 transition-colors flex flex-col items-center justify-center text-xl">
      {/* Provider Selection */}
      {/* <select
        className="mb-4 p-2 bg-black text-white border border-gray-600 rounded"
        value={providerId}
        onChange={(e) => setProviderId(e.target.value)}
      >
        <option value="">Select a Provider</option>
        <option value="providerObjectId1">Provider 1</option>
        <option value="providerObjectId2">Provider 2</option>
      </select> */}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="w-full border-2 border-gray-500 border-dashed rounded p-6 cursor-pointer hover:border-amber-400 transition-colors"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>
            Drag & drop a file here, or{" "}
            <span className="text-amber-400">click to select</span>
          </p>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="w-full mt-4">
          <div className="w-full bg-gray-700 rounded h-4">
            <div
              className="bg-gradient-to-r from-white to-amber-400 h-4 rounded"
              style={{ width: `${uploadProgress}%`, transition: "width 0.3s" }}
            />
          </div>
          <button
            onClick={cancelUpload}
            className="mt-3 px-6 py-2 bg-white text-black rounded-xl hover:bg-gray-300 transition-all"
          >
            Cancel Upload
          </button>
        </div>
      )}

      {/* Upload Success */}
      {!uploading && uploadCompleted && (
        <p className="mt-4 text-green-400 font-semibold">✅ Upload complete!</p>
      )}
      <ToastContainer position="top-right" autoClose={2000} pauseOnHover />
    </div>
  );
};

export default FileDragUpload;
