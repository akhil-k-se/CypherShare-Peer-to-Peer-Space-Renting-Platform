import React, { useEffect, useState } from 'react';
import FileDragUpload from './FileDragUpload';
import axios from 'axios';

const DashBoard = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/user/getInfo', {
          withCredentials: true,
        });
        setName(response.data.name);
      } catch (e) {
        console.log(e?.response?.data?.msg || 'Error fetching user info');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-start justify-center text-white font-manrope gap-6 sm:gap-8 py-5 px-4 sm:px-6 md:px-10">

      <div className="text-3xl sm:text-5xl md:text-7xl py-3 sm:py-4">
        Welcome{ name ? `, ${name}` : '...' }
      </div>

      <div className="flex flex-col bg-[#0d0d0e] w-full rounded-xl border border-gray-600 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 gap-4 sm:gap-6 relative">
        <div className="text-2xl sm:text-3xl md:text-4xl">Storage Usage</div>
        
        <div className="w-full h-3 bg-[#131415] rounded-xl border border-gray-600 relative overflow-hidden">
          <div className="h-full w-[40%] bg-gradient-to-r from-gray-400 to-amber-400 rounded-r-lg"></div>
        </div>

        <div className="text-sm sm:text-base md:text-xl text-gray-300">
          Used 80GB of 200GB
        </div>
      </div>

      <div className="w-full min-h-[120px] sm:min-h-[150px] flex items-center justify-center">
        <FileDragUpload />
      </div>

      <div className="w-full flex-1 bg-[#0d0d0e] rounded-xl border border-gray-600"></div>
    </div>
  );
};

export default DashBoard;
