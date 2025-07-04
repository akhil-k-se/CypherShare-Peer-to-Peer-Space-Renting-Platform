import React, { useEffect, useState } from "react";
import axios from "axios";

const Provider_Earning = () => {
  const [totalEarning, setTotalEarning] = useState(0);
  const [monthlyEarning, setMonthlyEarning] = useState(0);

  useEffect(() => {
    const fetchEarning = async () => {
      try {
        const response = await axios.get("https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/provider/getInfo",{withCredentials:true});
        setTotalEarning(response.data.totalEarning || 0);

        setMonthlyEarning(response.data.monthlyEarning || 10);
      } catch (error) {
        console.error("Error fetching provider info:", error);
      }
    };

    fetchEarning();
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col font-manrope text-white gap-8 p-4">
      <div className="text-4xl md:text-7xl">Earning Overview</div>

      <div className="flex flex-col md:flex-row items-center justify-evenly gap-6 relative w-full h-auto md:h-[50%]">

        <div className="w-full h-40 md:h-full border border-gray-300 bg-[#0d0d0e] rounded-xl flex flex-col items-center justify-center gap-2 text-center">
          <div className="text-2xl md:text-4xl">Monthly Earning</div>
          <div className="text-xl md:text-3xl text-gray-400">Rs {monthlyEarning}</div>
        </div>

        <div className="w-full h-auto md:h-full border border-gray-300 bg-[#0d0d0e] rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 p-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="text-2xl md:text-4xl">Total Lifetime Earning</div>
            <div className="text-xl md:text-3xl text-gray-400">Rs {totalEarning}</div>
          </div>
          <button className="border border-gray-300 bg-[#0d0d0e] px-6 md:px-10 py-3 md:py-5 rounded-xl text-lg md:text-xl hover:cursor-pointer">
            Withdrawal
          </button>
        </div>
      </div>

      <div className="flex flex-col relative items-start w-full h-full border border-gray-300 rounded-xl overflow-hidden">
        <div className="w-full bg-[#0d0d0e] text-xl md:text-2xl p-4 md:p-5 border-b border-gray-300">
          Payment History
        </div>
        <div className="flex relative items-center justify-evenly w-full text-xl p-5 border-b border-gray-300">
          <div>Date</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
      </div>
    </div>
  );
};

export default Provider_Earning;
