import React from 'react'
import { useNavigate } from 'react-router-dom';
import FormDisplay from './FormDisplay';

function Ranks({teams}) {
  const navigate = useNavigate();
  return (
<div
  className="
  grid grid-cols-[35px_1fr_45px_45px_45px_45px_45px_45px_120px]
  items-center text-center text-white bg-[#240046]
  px-[5px] w-full box-border
  rounded-[1vh]
  hover:bg-[#5A189A] overflow-hidden transition 
  border-[.1vh] border-gray-700
"
>

      {/* Rank */}
      <p className="text-[1.5vh] text-start font-bold">{teams.teams.rank}</p>

      {/* Team Name + Logo */}
      <div
        onClick={() => {
          navigate(`/team/${teams.teams.id}`);  
        }}
        className="cursor-pointer flex items-start gap-[1vh] w-fit"
      >
        <img
          src={teams.teams.logo}
          alt={teams.teams.name}
          className="w-[30px] h-[30px] object-contain"
        />
        <p className="text-[2vh]">{teams.teams.name}</p>
      </div>

      {/* Stats */}
      <p className="text-[1.5vh] text-center">{teams.teams.played}</p>
      <p className="text-[1.5vh] text-center text-green-400">
        {teams.teams.win}
      </p>
      <p className="text-[1.5vh] text-center">{teams.teams.draw}</p>
      <p className="text-[1.5vh] text-center text-red-400">
        {teams.teams.lose}
      </p>
      <p className="text-[1.5vh] text-center">{teams.teams.goalsdiff}</p>
      <p className="text-[1.5vh] text-center font-bold text-yellow-400">
        {teams.teams.points}
      </p>

      {/* FORM */}
      <FormDisplay form={teams.teams.form} />
    </div>
  );
}

export default Ranks