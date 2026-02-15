import React, { useState } from "react";
import LiveMatches from "./LiveMatches.jsx";
import IncomingMatches from "./IncomingMatches.jsx";

function Matches() {
  const [matchesType, setMatchesType] = useState("live");

  return (
    <div
      className="bg-[#3C096C] rounded-[12px] px-[25px] py-[30px] h-full
flex flex-col"
    >
      <div className="flex align-center overflow-hidden">
        <h1 className="flex text-3xl font-bold text-white">Matches</h1>

        <div className="flex text-white text-xl gap-[20px] ml-[30px]">
          <button
            onClick={() => setMatchesType("live")}
            className="bg-[#5A189A] p-[10px] rounded-[12px] w-[140px] cursor-pointer hover:bg-[#974CE0]"
          >
            Live
          </button>
          <button
            onClick={() => setMatchesType("incoming")}
            className="bg-[#5A189A] p-[10px] rounded-[12px] w-[140px] cursor-pointer hover:bg-[#974CE0]"
          >
            Incoming
          </button>
        </div>
      </div>

      <span className="block mt-[15px] w-full h-[1px] bg-gray-300" />

      {matchesType === "live" ? (
        <LiveMatches />
      ) : matchesType === "incoming" ? (
        <IncomingMatches />
      ) : (
        <>
          <h1 className="flex text-white text-4xl justify-center mt-[20px] font-bold">
            No Matches Available
          </h1>
        </>
      )}
    </div>
  );
}

export default Matches;
