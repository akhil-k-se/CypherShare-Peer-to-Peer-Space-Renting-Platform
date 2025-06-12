import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaFileAlt, FaFileImage, FaFileVideo } from "react-icons/fa";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const filesRef = useRef([]); // store previous files for comparison

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/allFiles", {
        withCredentials: true,
      });

      if (res.data.success && Array.isArray(res.data.files)) {
        const newFiles = res.data.files;

        // Compare with existing files
        const changed = hasFilesChanged(newFiles, filesRef.current);

        if (changed) {
          setFiles(newFiles);
          filesRef.current = newFiles;
          console.log("🔁 Files updated");
        } else {
          console.log("✅ No change in files");
        }
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch files");
      setFiles([]);
    }
  };

  const hasFilesChanged = (newFiles, oldFiles) => {
    if (newFiles.length !== oldFiles.length) return true;
    for (let i = 0; i < newFiles.length; i++) {
      if (
        newFiles[i]._id !== oldFiles[i]._id ||
        newFiles[i].isSyncedToProvider !== oldFiles[i].isSyncedToProvider
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    fetchFiles(); // initial fetch

    const interval = setInterval(() => {
      fetchFiles(); // poll every 2 seconds
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getFileIcon = (file) => {
    const ext = file.fileName?.split(".").pop().toLowerCase();

    if (!file.type && ext) {
      if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext))
        return <FaFileImage className="text-xl text-green-400" />;
      if (["mp4", "mov", "avi", "mkv", "webm", "flv"].includes(ext))
        return <FaFileVideo className="text-xl text-red-400" />;
      return <FaFileAlt className="text-xl" />;
    }

    if (file.type?.startsWith("image/"))
      return <FaFileImage className="text-xl text-green-400" />;
    if (file.type?.startsWith("video/"))
      return <FaFileVideo className="text-xl text-red-400" />;

    return <FaFileAlt className="text-xl" />;
  };

  const downloadWithFetch = async (ipfsHash, name) => {
    try {
      const res = await fetch("http://localhost:5000/user/fileDownload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ipfsHash }),
      });

      const blob = await res.blob();

      const disposition = res.headers.get("content-disposition");
      let filename = name;
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Fetch updated file list after download
      // setTimeout(() => {
      //   fetchFiles();
      // }, 1000);
    } catch (err) {
      console.error("❌ Fetch download error", err);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center font-manrope text-white p-6 gap-6">
      <h2 className="text-5xl font-semibold mb-6">Uploaded Files</h2>
      <div className="w-full space-y-8">
        {files.length === 0 ? (
          <p>No files found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8">
            {files.map((file) => (
              <div
                key={file._id}
                className="bg-[#121212] p-6 rounded-2xl border border-gray-700 shadow-md hover:shadow-lg transition duration-300"
              >
                <h3 className="text-lg font-semibold mb-4 text-white break-words">
                  {file.originalName || file.fileName || "Unnamed File"}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  {getFileIcon(file)}
                  <span className="text-gray-400 text-sm truncate max-w-[60%]">
                    {file.type || "Unknown type"}
                  </span>
                </div>

                <div className="flex flex-col justify-between items-center xl:flex-row bg-gray-900 p-3 rounded">
                  <span className="text-sm text-gray-300">
                    Size: {file.size ? (file.size / 1024).toFixed(2) : "0"} KB
                  </span>
                  <button
                    onClick={() =>
                      downloadWithFetch(file.path, file.originalName)
                    }
                    className="bg-amber-500 text-black text-sm px-3 py-1 rounded hover:bg-amber-400 transition"
                  >
                    Download
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Uploaded on: {new Date(file.uploadDate).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Synced to provider: {file.isSyncedToProvider ? "Yes" : "No"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFiles;
