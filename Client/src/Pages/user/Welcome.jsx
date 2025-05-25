import React, { useState } from "react";
import Dashboard from "./DashBoard";
import Upload from "./Upload";
import MyFiles from "./MyFiles";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaFolderClosed } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";

const Welcome = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "upload":
        return <Upload />;
      case "myfiles":
        return <MyFiles />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full min-h-[90vh] bg-black rounded-xl border border-gray-600 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[20%] bg-black border-b md:border-b-0 md:border-r border-gray-700 p-4 flex flex-col items-center gap-6">
          <div className="flex items-center h-[100px] justify-center gap-3 pb-4 border-b border-gray-800 w-full">
            <img
              src="assets/images/logo.png"
              className="h-12 w-12 object-contain"
              alt="Logo"
            />
            <h1 className="text-white text-3xl font-bold font-manrope md:hidden lg:block">
              CypherShare
            </h1>
          </div>

          <nav className="flex flex-col items-center justify-center gap-4 text-gray-300 text-base sm:text-[20px] w-full font-manrope">
            <div
              onClick={() => setActivePage("dashboard")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activePage === "dashboard"
                  ? "bg-[#121214] text-white"
                  : "hover:bg-[#121214]"
              }`}
            >
              <MdHomeFilled className="text-xl" />
              <span>Dashboard</span>
            </div>

            {/* <div
              onClick={() => setActivePage("upload")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activePage === "upload"
                  ? "bg-[#121214] text-white"
                  : "hover:bg-[#121214]"
              }`}
            >
              <MdOutlineFileUpload className="text-xl" />
              <span>Upload</span>
            </div> */}

            <div
              onClick={() => setActivePage("myfiles")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activePage === "myfiles"
                  ? "bg-[#121214] text-white"
                  : "hover:bg-[#121214]"
              }`}
            >
              <FaFolderClosed className="text-xl" />
              <span>My Files</span>
            </div>

            <div
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer hover:bg-red-500 transition-all duration-200"
            >
              <RxExit className="text-xl" />
              <span>Logout</span>
            </div>
          </nav>
        </div>

        <div className="flex-1 bg-black p-4 md:p-6 overflow-y-auto relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
