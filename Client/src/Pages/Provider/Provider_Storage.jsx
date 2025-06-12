import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Provider_Storage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState("Select User");
  const [usedStorage, setUsedStorage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(1); // Avoid divide by zero
  const [files, setFiles] = useState([]);
  const filesRef = useRef([]);

  const users = ["Akhil", "Aryan", "Akash"];

  const handleUserSelect = (user) => {
    setSelectedUser(user === "Reset" ? "Select User" : user);
    setShowDropdown(false);
  };

  // Check if files have changed
  const hasFilesChanged = (newFiles, oldFiles) => {
    if (newFiles.length !== oldFiles.length) return true;
    for (let i = 0; i < newFiles.length; i++) {
      if (
        newFiles[i]._id !== oldFiles[i]._id ||
        newFiles[i].fileSize !== oldFiles[i].fileSize ||
        newFiles[i.uploadedAt] !== oldFiles[i.uploadedAt]
      ) {
        return true;
      }
    }
    return false;
  };

  // Fetch files repeatedly
  const fetchFileData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/provider/files", {
        withCredentials: true,
      });
      const newFiles = res.data.files || [];
      if (hasFilesChanged(newFiles, filesRef.current)) {
        setFiles(newFiles);
        filesRef.current = newFiles;
        console.log("🔁 Files updated");
      } else {
        console.log("✅ No file change");
      }
    } catch (error) {
      console.error(
        "Error fetching files:",
        error?.response?.data?.msg || error.message
      );
    }
  };

  useEffect(() => {
    const fetchStorageInfo = async () => {
      try {
        const res1 = await axios.get("http://localhost:5000/provider/getInfo", {
          withCredentials: true,
        });
        setUsedStorage(res1.data.usedStorage);
        setTotalStorage(res1.data.totalStorage);
      } catch (error) {
        console.error(
          "Error fetching storage info:",
          error?.response?.data?.msg || error.message
        );
      }
    };

    fetchStorageInfo();
    fetchFileData(); // Initial fetch

    const interval = setInterval(() => {
      fetchFileData(); // Poll every 2 seconds
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const usagePercentage = Math.min((usedStorage / totalStorage) * 100, 100);

  return (
    <div className="w-full h-full flex font-manrope flex-col text-white gap-6 p-2">
      <div className="text-4xl md:text-7xl">Storage Management</div>

      {/* Storage Usage Bar */}
      <div className="w-full h-auto bg-black rounded-xl border border-gray-300 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 px-6 py-6">
        <div className="text-xl md:text-2xl">
          {usedStorage}GB <span className="text-gray-400">used</span>
        </div>
        <div className="w-full md:w-[40%] h-4 bg-gray-300 relative rounded-xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gray-300 to-amber-400 rounded-xl"
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <div className="text-xl md:text-2xl">
          {totalStorage - usedStorage}GB{" "}
          <span className="text-gray-400">available</span>
        </div>
      </div>

      {/* Dropdown Button */}
      <div className="relative w-fit">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="bg-amber-400 text-black font-semibold py-2 px-4 rounded-lg shadow-md w-48 text-left"
        >
          {selectedUser}
        </button>

        {showDropdown && (
          <ul className="absolute z-10 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
            {users.map((user, index) => (
              <li
                key={index}
                onClick={() => handleUserSelect(user)}
                className="px-4 py-2 hover:bg-amber-200 cursor-pointer rounded-lg"
              >
                {user}
              </li>
            ))}
            <li
              onClick={() => handleUserSelect("Reset")}
              className="px-4 py-2 hover:bg-red-200 text-red-600 cursor-pointer rounded-lg border-t border-gray-200"
            >
              Reset User
            </li>
          </ul>
        )}
      </div>

      {/* Table Section */}
      <div className="min-w-[600px] flex justify-between text-xl md:text-2xl p-4 border-b border-gray-300">
        <div className="w-1/4 text-center">Renter</div>
        <div className="w-1/4 text-center">File Stored</div>
        <div className="w-1/4 text-center">File Size</div>
        <div className="w-1/4 text-center">Last Accessed</div>
      </div>

      {files.length > 0 ? (
        files.map((file, index) => (
          <div
            key={index}
            className="min-w-[600px] flex justify-between text-base md:text-lg p-4 border-b border-gray-200"
          >
            <div className="w-1/4 text-center">{file.renterName}</div>
            <div className="w-1/4 text-center">{file.fileName}</div>
            <div className="w-1/4 text-center">{file.fileSize} KB</div>
            <div className="w-1/4 text-center">
              {file.uploadedAt
                ? new Date(file.uploadedAt).toLocaleString()
                : "N/A"}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-6 text-gray-400 text-lg">
          No files found.
        </div>
      )}
    </div>
  );
};

export default Provider_Storage;
