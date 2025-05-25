import React, { useState } from "react";

const Provider_DashBoard = () => {
  const [isOnline, setIsOnline] = useState(true);

  const handleToggle = () => {
    setIsOnline(prev => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col font-manrope justify-center text-white gap-12 p-5">
      <div className="text-5xl">Provider DashBoard</div>

      <div className="w-full h-full flex-1 bg-[#0d0d0e] border border-gray-300 rounded-xl relative flex flex-col lg:flex-row items-center justify-center p-4 gap-4">

        <div className="w-full lg:w-[55%] h-full flex items-center justify-center p-5">
          <div className="w-full h-full bg-black rounded-xl border border-gray-300 flex items-center justify-center p-5 gap-6 flex-col">
            <div className="text-2xl">Active Renters</div>
            <div className="w-full h-full min-h-[200px] border border-gray-300 rounded-xl bg-[#0d0d0e]"></div>
          </div>
        </div>


        <div className="w-full h-full flex flex-col items-center justify-center p-5 pt-0 lg:pl-0 gap-5">
          <div className="w-full flex flex-col xl:flex-row items-center justify-evenly gap-5">

            <div className="w-full xl:w-1/2 h-full bg-black rounded-xl border border-gray-300 flex flex-col items-center justify-center gap-6 p-5">
              <div className="text-3xl">Monthly Earning</div>
              <div className="text-4xl font-bold">Rs. 10,000</div>
            </div>


            <div className="w-full xl:w-1/2 h-full bg-black rounded-xl border border-gray-300 flex flex-col justify-center items-center gap-4 p-6">
              <div className="text-center flex flex-col items-center justify-center gap-2">
                <div className="text-3xl">Status</div>
                <div className={`text-2xl font-semibold ${isOnline ? "text-amber-400" : "text-red-500"}`}>
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>

              <div className="flex items-center justify-center gap-10 flex-wrap">
                <div className="text-3xl">Sharing Space</div>
                <label className="relative inline-flex items-center cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isOnline}
                    onChange={handleToggle}
                  />
                  <div className="w-11 h-10 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-amber-400 transition-colors duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 transform peer-checked:translate-x-full"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="w-full h-full bg-black rounded-xl border border-gray-300 flex justify-center gap-10 flex-col p-5">
            <div className="text-4xl">Current Storage Rented Out</div>
            <div className="text-2xl">200GB Of 500GB Used</div>
            <div className="w-full h-[1.5%] bg-gray-300 relative rounded-xl overflow-hidden">
              <div className="w-[40%] h-full bg-gradient-to-r from-gray-300 to-amber-400 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Provider_DashBoard;
