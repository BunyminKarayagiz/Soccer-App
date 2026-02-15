import React, { useState, useEffect } from "react";
import { xTeamFixtureData } from "../datas/apiDatas";
import { useNavigate } from "react-router-dom";
import { IoIosStarOutline } from "react-icons/io";
import stadium from "../assets/stadium.png";
import refree from "../assets/refree.png";
import { getFixtureByTeam } from "../services/apiServices";
function TeamMatches({ id, season }) {
  const [fixtureData, setFixtureData] = useState(null);
  const navigate = useNavigate();


  if (!fixtureData) return <div> Fixture Verisi Yok</div>;
  useEffect(() => {

    {/* Fikstür çeken api gelecek */}

    /* const fetchFixtureByTeam = async () => {
      try {
        const dataRes = await getFixtureByTeam(id,season);
        // örnek: premier league + laliga + bundesliga

        if (dataRes) {
          setFixtureData(dataRes);
          console.log(dataRes)
        }
      } catch (err) {
        console.log("live match çekme hata:", err);
      }
    }; */
    //fetchLive();

    setFixtureData(xTeamFixtureData);
  }, [season]);

  console.log(fixtureData);
  return (
    <div>
      {fixtureData.map((match) => (
        <div
          key={match.fixture.id}
          className="flex bg-[#5A189A] p-3 rounded-xl text-white hover:bg-[#7B2CBF] mt-[5px] font-medium text-[15px]
          grid grid-cols-[50px_100px_1fr_50px_300px] gap-[20px] items-center"
        >
          <div className="flex cursor-pointer justify-center">
            <IoIosStarOutline className="size-7" />
          </div>

          <div className="flex flex-col text-red-600">
            <p className="flex justify-center">
              {new Date(match.fixture.date).toLocaleDateString("tr-TR")}
            </p>
            <p className="flex justify-center">
              {new Date(match.fixture.date).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex flex-col gap-[10px] w-[250px]">
            <div className="flex gap-[10px]">
              <img
                src={match.teams.home.logo}
                alt=""
                className="h-[30px] w-[30px] object-contain"
              />
              <p>{match.teams.home.name}</p>
            </div>
            <div className="flex gap-[10px]">
              <img
                src={match.teams.away.logo}
                alt=""
                className="h-[30px] w-[30px] object-contain"
              />
              <p>{match.teams.away.name}</p>
            </div>
          </div>
          <div className="flex flex-col gap-[10px] text-red-600">
            <div className="flex justify-center">
              <p>{match.score.fulltime.home}</p>
            </div>
            <div className="flex justify-center">
              <p>{match.score.fulltime.away}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-[5px]">
              <img
                src={stadium}
                alt=""
                className="h-[30px] w-[30px] object-contain"
              />
              <p>{match.fixture.venue.name}</p>
            </div>
            <div className="flex gap-[5px]">
              <img
                src={refree}
                alt=""
                className="h-[30px] w-[30px] object-contain"
              />
              <p>{match.fixture.referee}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamMatches;
