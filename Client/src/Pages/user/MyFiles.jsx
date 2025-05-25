import React from 'react';

const MyFiles = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center font-manrope text-white p-6 gap-6">
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-5xl font-semibold">My Files</h2>
        <input
          type="search"
          placeholder="Search"
          className="bg-[#121212] border border-gray-600 rounded-2xl px-3 py-3 text-white focus:outline-none focus:border-amber-400"
        />
      </div>
      <div className="w-full">
        {/* Files list or content goes here */}
      </div>
    </div>
  );
};

export default MyFiles;
