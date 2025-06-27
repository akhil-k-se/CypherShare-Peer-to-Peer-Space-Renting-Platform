import React, { useState, useEffect } from "react";
import Dashboard from "./DashBoard";
import Upload from "./Upload";
import MyFiles from "./MyFiles";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled, MdOutlineFileUpload } from "react-icons/md";
import { FaFolderClosed } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import Renting from "./Renting";
import { MdOutlineSdStorage } from "react-icons/md";
import axios from "axios";

const Welcome = () => {
  const navigate = useNavigate();


  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage_user") || "dashboard";
  });


  useEffect(() => {
    localStorage.setItem("activePage_user", activePage);
  }, [activePage]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "upload":
        return <Upload />;
      case "myfiles":
        return <MyFiles />;
      case "renting":
        return <Renting />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/auth/logout",
        // "http://localhost:5000/auth/logout",

        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logging out");
      
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("activePage_user");
    navigate("/");
  };
  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full min-h-[90vh] bg-black rounded-xl border border-gray-600 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[20%] bg-black border-b md:border-b-0 md:border-r border-gray-700 p-4 flex flex-col items-center gap-6">
          <div className="flex items-center h-[100px] justify-center gap-3 pb-4 border-b border-gray-800 w-full">
            <img
              // src="assets/images/logo.png"
              src="assets/Logos/cs-no-bg.png"

              className="h-12 w-12 object-contain"
              alt="Logo"
            />
            <h1 className="text-white text-3xl font-bold font-manrope md:hidden lg:block">
              CypherShare
            </h1>
          </div>

          <nav className="flex flex-col items-center justify-center gap-4 text-gray-300 text-base sm:text-[20px] w-full font-manrope">
            <SidebarItem
              icon={<MdHomeFilled className="text-xl" />}
              label="Dashboard"
              page="dashboard"
              activePage={activePage}
              setActivePage={setActivePage}
            />
            
            <SidebarItem
              icon={<MdOutlineSdStorage className="text-xl"/>}
              label="Rent Storage"
              page="renting"
              activePage={activePage}
              setActivePage={setActivePage}
            />

            <SidebarItem
              icon={<FaFolderClosed className="text-xl" />}
              label="My Files"
              page="myfiles"
              activePage={activePage}
              setActivePage={setActivePage}
            />

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

const SidebarItem = ({ icon, label, page, activePage, setActivePage }) => (
  <div
    onClick={() => setActivePage(page)}
    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
      activePage === page ? "bg-[#121214] text-white" : "hover:bg-[#121214]"
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default Welcome;
