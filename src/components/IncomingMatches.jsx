import React from "react";
import { IoIosStarOutline } from "react-icons/io";
import flagImg from "../assets/flag.png";
import teamImg from "../assets/team.png";
import refreeImg from "../assets/refree.png";
import stadImg from "../assets/stadium.png";

function IncomingMatches() {
  return (
    <div className="overflow-hidden">
      <div className="flex bg-[#5A189A] rounded-[12px] mt-[25px] p-[5px] gap-[15px] items-center">
        <IoIosStarOutline className="text-white text-2xl cursor-pointer" />
        <img
          className="w-[30px] h-[30px] object-contain"
          src={flagImg}
          alt="Flag"
        />
        <h1 className="text-white font-bold text-[15px]">League Name</h1>
      </div>
      <div className="flex px-[25px] py-[8px] items-center gap-[10px] grid grid-cols-[25px_85px_1fr_20px_120px]">
        <IoIosStarOutline className="text-white text-2xl cursor-pointer" />
        <div className="flex flex-col gap-[18px] text-white font-bold justify-center items-center">
          <p>23.01.2026</p>
          <p>20:00</p>
        </div>

        {/* Teams */}
        <div className=" flex flex-col gap-[10px] font-semibold overflow-hidden">
          {/* Home Team */}
          <div className="flex items-center gap-[10px]">
            <img
              className="w-[30px] h-[30px] object-contain"
              src={teamImg}
              alt="Team"
            />
            <p className="text-white">Manchester United</p>
          </div>

          {/* Away Team */}
          <div>
            <div className="flex items-center gap-[10px]">
              <img
                className="w-[30px] h-[30px] object-contain"
                src={teamImg}
                alt="Team"
              />
              <p className="text-white">Team B</p>
            </div>
          </div>
        </div>
        <span className="mx-6 h-15 w-[1px] bg-white/70" />

        <div className=" flex flex-col gap-[10px] font-semibold">
          {/* Stad */}
          <div className="flex items-center gap-[10px]">
            <img
              className="w-[30px] h-[30px] object-contain"
              src={stadImg}
              alt="Team"
            />
            <p className="text-white">Rams Park</p>
          </div>

          {/* Ref */}
          <div>
            <div className="flex items-center gap-[10px]">
              <img
                className="w-[30px] h-[30px] object-contain"
                src={refreeImg}
                alt="Team"
              />
              <p className="text-white">Team B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomingMatches;
