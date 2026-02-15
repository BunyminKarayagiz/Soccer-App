import React from "react";
import { seasons } from "../datas/apiDatas.js";
import { IoChevronDown } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";

function SelectionSeason({ season, setSeason }) {

  const current = seasons.find((l) => l === season);
  return (
    <div className="relative w-fit cursor-pointer">
      <div
        className="flex items-center bg-white/5 px-[2vh] py-[1vh] rounded-xl 
                     backdrop-blur-md shadow-sm hover:bg-white/10 transition pr-[2vh]"
      >
        {/* SELECT */}
        <select
          value={current}
          onChange={(e) => setSeason(Number(e.target.value))}
          className="bg-transparent text-white outline-none cursor-pointer text-[1.5vh]
                       appearance-none w-full"
          style={{
            colorScheme: "dark",
          }}
        >
          {seasons.map((s, i) => (
            <option key={i} value={s} className="bg-[#5A189A]">
              {s} - {s + 1}
            </option>
          ))}
        </select>

        <MdOutlineDateRange className="text-[25px] text-gray-300" />
        <IoChevronDown className="text-[2vh] text-gray-300 pointer-events-none ml-[10px]" />
      </div>
    </div>
  );
}

export default SelectionSeason;
