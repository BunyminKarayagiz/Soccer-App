import React from "react";
import { IoIosStarOutline } from "react-icons/io";
import pp from "../assets/pp.jpg";
import flag from "../assets/flag.png";
import team from "../assets/team.png";
function MyPlayers() {
  return (
    <div className="flex flex-col p-[25px]  bg-[#3C096C] rounded-[12px]">
      <h1 className="text-[32px] font-bold text-white mb-[10px] border-b border-b-[.1vh] border-gray-600">
        My Players
      </h1>
      <div className="flex bg-[#5A189A] rounded-[12px] mt-[5px] p-[6px] gap-[15px] items-center justify-between">
        <IoIosStarOutline className="text-white text-2xl cursor-pointer" />
        <div className="flex items-center gap-1">
          <img
            className="w-[30px] h-[30px] object-contain"
            src={pp}
            alt="Player"
          />
          <h1 className="text-white font-bold text-[15px]">Player Name</h1>
        </div>
        <div className="flex items-center gap-1">
          {" "}
          <img
            className="w-[30px] h-[30px] object-contain"
            src={team}
            alt="Player"
          />
          <h1 className="text-white font-bold text-[15px]">Team Name</h1>
        </div>
        <img
          className="w-[30px] h-[30px] object-contain"
          src={flag}
          alt="Flag"
        />
      </div>
    </div>
  );
}

export default MyPlayers;
