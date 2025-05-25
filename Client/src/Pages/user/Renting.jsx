import React, { useState } from "react";

const Renting = () => {
  const [spaceSort, setSpaceSort] = useState("");
  const [ratingSort, setRatingSort] = useState("");

  return (
    <div className="w-full h-full flex p-6 flex-col font-manrope text-white gap-6">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <div className="text-6xl">Rent Storage Space</div>
          <div className="text-xl text-gray-400">
            Purchase Storage from one of the providers below
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={spaceSort}
            onChange={(e) => setSpaceSort(e.target.value)}
            className="bg-amber-400 text-black p-2 rounded-lg border border-gray-600"
          >
            <option value="">Sort by Available Space</option>
            <option value="asc">Smallest to Largest</option>
            <option value="desc">Largest to Smallest</option>
          </select>

          <select
            value={ratingSort}
            onChange={(e) => setRatingSort(e.target.value)}
            className="bg-amber-400 text-black p-2 rounded-lg border border-gray-600"
          >
            <option value="">Sort by Rating</option>
            <option value="asc">Lowest to Highest</option>
            <option value="desc">Highest to Lowest</option>
          </select>
        </div>
      </div>

      <div className="w-full h-full border border-gray-300 rounded-xl"></div>
      <div className="w-full flex h-[30%] border border-gray-300 rounded-xl relative p-5">
        <div className="h-full w-[35%] flex flex-col p-4">
          <div className="text-5xl mb-5">Summary</div>
          <div className="text-xl">DataBox</div>
          <div className="text-xl">200GB for Rs 8/GB per Month</div>
        </div>
        <div className="flex w-full h-full items-center justify-between p-5 rounded-xl border border-amber-400">
          <div className="h-full w-[35%] flex flex-col p-4 gap-2">
            <div className="text-5xl">DataBox</div>
            <div className="text-xl">200GB for Rs 8/GB per Month</div>
          </div>
          <button className='border border-gray-300 bg-amber-400 px-6 sm:px-10 py-3 sm:py-5 rounded-xl text-lg sm:text-xl hover:cursor-pointer text-black'>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Renting;
