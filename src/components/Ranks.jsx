import React from 'react'
import { useNavigate } from 'react-router-dom';
import FormDisplay from './FormDisplay.jsx';

function Ranks({teams}) {
  const navigate = useNavigate();
  return (
    <>
      {/* Desktop View */}
      <div
        className="
        hidden sm:grid
        grid-cols-[40px_minmax(150px,1fr)_50px_40px_50px_30px_50px_40px_140px]
        items-center text-white bg-[#240046]
        px-2 py-1.5 w-full
        rounded-lg
        hover:bg-[#5A189A] transition 
        border border-gray-700
        mb-1
      "
      >

      {/* Rank */}
      <p className="text-sm text-start font-bold">{teams.teams.rank}</p>

      {/* Team Name + Logo */}
      <div
        onClick={() => {
          navigate(`/team/${teams.teams.id}/2023`);  
        }}
        className="cursor-pointer flex items-center gap-2 justify-start"
      >
        <img
          src={teams.teams.logo}
          alt={teams.teams.name}
          className="w-[25px] h-[25px] object-contain flex-shrink-0"
        />
        <p className="text-sm truncate">{teams.teams.name}</p>
      </div>

      {/* Stats */}
      <p className="text-sm text-center">{teams.teams.played}</p>
      <p className="text-sm text-center text-green-400">
        {teams.teams.win}
      </p>
      <p className="text-sm text-center">{teams.teams.draw}</p>
      <p className="text-sm text-center text-red-400">
        {teams.teams.lose}
      </p>
      <p className="text-sm text-center">{teams.teams.goalsdiff}</p>
      <p className="text-sm text-center font-bold text-yellow-400">
        {teams.teams.points}
      </p>

      {/* FORM */}
      <div className="flex justify-center">
        <FormDisplay form={teams.teams.form} />
      </div>
    </div>
    
    {/* Mobile View */}
    <div
      className="
      grid sm:hidden
      grid-cols-[35px_minmax(100px,1fr)_45px_90px]
      items-center text-white bg-[#240046]
      px-2 py-2 w-full
      rounded-md
      hover:bg-[#5A189A] transition 
      border border-gray-700
      mb-1
      gap-1
    "
    >
      {/* Rank */}
      <p className="text-xs text-start font-bold">{teams.teams.rank}</p>

      {/* Team Name + Logo */}
      <div
        onClick={() => {
          navigate(`/team/${teams.teams.id}/2023`);  
        }}
        className="cursor-pointer flex items-center gap-1.5 min-w-0"
      >
        <img
          src={teams.teams.logo}
          alt={teams.teams.name}
          className="w-[18px] h-[18px] object-contain flex-shrink-0"
        />
        <p className="text-xs truncate">{teams.teams.name}</p>
      </div>

      {/* Points */}
      <p className="text-xs text-center font-bold text-yellow-400">
        {teams.teams.points}
      </p>

      {/* FORM - Mobile */}
      <div className="flex justify-end">
        <FormDisplay form={teams.teams.form} />
      </div>
    </div>
    </>
  );
}

export default Ranks