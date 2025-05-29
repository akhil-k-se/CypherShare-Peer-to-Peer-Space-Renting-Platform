import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt, FaFileImage, FaFileVideo } from "react-icons/fa";

const MyFiles = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/allFiles", { withCredentials: true })
      .then((res) => {
        console.log(res.data.files);

        if (res.data.success && Array.isArray(res.data.files)) {
          setFiles(res.data.files);
          console.log("Data Received");
        } else {
          alert("Failed to fetch files");
          setFiles([]);
        }
      })
      .catch(() => {
        alert("Failed to fetch files");
        setFiles([]);
      });
  }, []);

  const getFileIcon = (file) => {
    if (!file.type) {

      const ext = file.fileName?.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext))
        return <FaFileImage className="text-xl text-green-400" />;
      if (["mp4", "mov", "avi", "mkv", "webm", "flv"].includes(ext))
        return <FaFileVideo className="text-xl text-red-400" />;
      return <FaFileAlt className="text-xl" />;
    }

    // check MIME type
    if (file.type.startsWith("image/"))
      return <FaFileImage className="text-xl text-green-400" />;
    if (file.type.startsWith("video/"))
      return <FaFileVideo className="text-xl text-red-400" />;

    return <FaFileAlt className="text-xl" />;
  };

  const downloadFile = (fileId) => {
    console.log("Download clicked for fileId:", fileId);
    // Actual download logic here, e.g.:
    // window.open(`http://localhost:5000/files/download/${fileId}`, '_blank');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center font-manrope text-white p-6 gap-6">
      <h2 className="text-5xl font-semibold mb-6">Uploaded Files</h2>
      <div className="w-full space-y-8">
        {files.length === 0 ? (
          <p>No files found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {files.map((file) => (
              <div key={file._id} className="bg-[#121212] p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">
                  {file.originalName || file.fileName || "Unnamed File"}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  {getFileIcon(file)}
                  <span className="text-gray-400">{file.type || "Unknown type"}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-900 p-3 rounded">
                  <span>
                    Size:{" "}
                    {file.size ? (file.size / 1024).toFixed(2) : "0"} KB
                  </span>
                  <button
                    onClick={() => downloadFile(file._id)}
                    className="bg-amber-500 text-black px-3 py-1 rounded hover:bg-amber-400 transition"
                  >
                    Download
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Uploaded on: {new Date(file.uploadDate).toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Synced to provider:{" "}
                  {file.isSyncedToProvider ? "Yes" : "No"}
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
