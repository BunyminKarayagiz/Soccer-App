import React from "react";
import { xTeamFixtureData } from "../datas/apiDatas.js";
import { IoIosStarOutline } from "react-icons/io";
import stadium from "../assets/stadium.png";
import refree from "../assets/refree.png";

function TeamMatches() {
  const fixtureData = xTeamFixtureData;

  console.log(fixtureData);
  return (
    <div>
      {fixtureData.map((match) => (
        <div
          key={match.fixture.id}
          className="row mt-2 grid min-w-0 grid-cols-[auto_4.5rem_minmax(0,1fr)_auto] items-center gap-2 p-2.5 text-sm font-medium sm:gap-3 sm:p-3"
        >
          <div className="flex justify-center">
            <IoIosStarOutline className="size-7" />
          </div>

          <div className="tabular flex flex-col text-center text-xs text-muted">
            <p>
              {new Date(match.fixture.date).toLocaleDateString("tr-TR")}
            </p>
            <p className="font-semibold text-accent">
              {new Date(match.fixture.date).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex min-w-0 items-center gap-2">
              <img
                src={match.teams.home.logo}
                alt=""
                className="size-6 shrink-0 object-contain"
              />
              <p className="truncate">{match.teams.home.name}</p>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <img
                src={match.teams.away.logo}
                alt=""
                className="size-6 shrink-0 object-contain"
              />
              <p className="truncate">{match.teams.away.name}</p>
            </div>
          </div>
          <div className="tabular flex flex-col gap-2 text-center font-bold text-accent">
            <div className="flex justify-center">
              <p>{match.score.fulltime.home}</p>
            </div>
            <div className="flex justify-center">
              <p>{match.score.fulltime.away}</p>
            </div>
          </div>
          <div className="col-span-full flex min-w-0 flex-wrap gap-x-4 gap-y-1 border-t border-line pt-2 text-xs text-muted sm:col-start-3 sm:col-end-5">
            <div className="flex min-w-0 items-center gap-1.5">
              <img
                src={stadium}
                alt=""
                className="size-4 shrink-0 object-contain"
              />
              <p className="truncate">{match.fixture.venue?.name || "Stadyum belirtilmemiş"}</p>
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
              <img
                src={refree}
                alt=""
                className="size-4 shrink-0 object-contain"
              />
              <p className="truncate">{match.fixture.referee || "Hakem belirtilmemiş"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamMatches;
