import React, { useEffect, useState } from "react";
import { xcoachData, xteamData } from "../datas/apiDatas.js";
import stadium from "../assets/stadium.png";
import LeagueInfo from "./LeagueInfo.jsx";
import TeamMatches from "./TeamMatches.jsx";
import TeamPlayers from "./TeamPlayers.jsx";
import { useNavigate } from "react-router-dom";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getTeamCoach } from "../services/apiServices.js";
import { getTeam } from "../services/apiServices.js";

function TeamContainer({ id, season }) {
  const [teamData, setTeamData] = useState(xteamData);
  const [coachData, setCoachData] = useState(xcoachData);
  const [status, setStatus] = useState("puan");
  const { currentUser } = useAuth();
  const [favTeams, setFavTeams] = useState([]);

  const navigate = useNavigate();
  if (!teamData || !coachData) {
    return <div className="text-white p-20">Loading...</div>;
  }
  const isTab = (name) => status === name;

  useEffect(() => {
    {
      /* Coach Data verisi alınacak, Takım verisi alınacak */
    }
    const fetchFavs = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavTeams(snap.data().favorites?.teams || []);
      }
    };

    async function fetchCoachData() {
      try {
        const coachDataRes = await getTeamCoach(id);

        console.log(coachDataRes);

        if (coachDataRes && coachData.name ) {
          setCoachData(coachDataRes);
        }else{
          console.log("Coach DATA YOK");
        }
      } catch (error) {
        console.error("getLeaugue error:", error);
      }
    }

    async function fetchTeamData() {
      try {
        const teamDataRes = await getTeam(id);

        if (teamDataRes && teamDataRes.team) {
          setTeamData(teamDataRes);
        } else {
          console.log("TEAM DATA YOK");
        }
      } catch (error) {
        console.error("TEAM ERROR:", error);
      }
    }
    fetchCoachData();
    fetchTeamData();
    fetchFavs();
  }, [currentUser, id, season]);
  console.log(teamData, coachData);
  const toggleFav = async (e) => {
    e.stopPropagation(); // karta tıklayıp player sayfasına gitmesin

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const ref = doc(db, "users", currentUser.uid);

    const exists = favTeams.find((p) => p.id === teamData.team.id);

    let updated;

    if (exists) {
      // kaldır
      updated = favTeams.filter((p) => p.id !== teamData.team.id);
    } else {
      // ekle
      const newFav = {
        id: teamData.team.id,
        name: teamData.team.name,
        photo: teamData.team.logo,
      };

      updated = [...favTeams, newFav];
    }

    await updateDoc(ref, {
      "favorites.teams": updated,
    });

    setFavTeams(updated);
  };
  const isFav = favTeams.some((p) => p.id === teamData.team.id);
  return (
    <div className="bg-[#3C096C] rounded-[12px] p-4 sm:p-6 md:p-[50px] grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      <div className="flex flex-col lg:col-span-4">
        <div className="flex text-white gap-[15px] flex-col sm:flex-row">
          <div className="flex justify-center sm:justify-start">
            <img src={teamData?.team?.logo} alt="" className="w-24 h-24 sm:w-auto sm:h-auto" />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-4 sm:gap-[30px] items-center flex-wrap">
              <h1 className="font-black text-2xl sm:text-3xl md:text-[40px]">{teamData?.team?.name}</h1>
              {isFav ? (
                <IoIosStar
                  onClick={toggleFav}
                  className="size-6 sm:size-8 text-yellow-400 cursor-pointer"
                />
              ) : (
                <IoIosStarOutline
                  onClick={toggleFav}
                  className="size-6 sm:size-8 text-white cursor-pointer"
                />
              )}
            </div>
            <h2 className="font-normal text-xl sm:text-2xl md:text-[30px]">
              {teamData?.team?.country}
            </h2>
            <div className="flex gap-[10px] items-center">
              {/* Buraya TD bilgileri çekilip verilecek */}
              <img
                src={coachData?.photo}
                alt=""
                className="h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] object-contain rounded-[5px]"
              />
              <p className="font-normal text-lg sm:text-xl md:text-[30px]">{coachData?.name}</p>
            </div>
            <div className="flex gap-[10px] items-center">
              <img
                src={stadium}
                alt=""
                className="h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] object-contain"
              />
              <p className="font-normal text-lg sm:text-xl md:text-[30px]">{teamData?.venue?.name}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-10 md:mt-[70px]">
          <img src={teamData?.venue?.image} alt="" className="rounded-[12px] w-full" />
        </div>
      </div>

      <div className="lg:col-span-8 lg:col-end-13 overflow-y-auto h-full flex flex-col mt-6 lg:mt-0">
        <div className="flex flex-col sm:flex-row justify-around rounded-[12px] bg-[#5A189A] text-white font-normal text-lg sm:text-xl md:text-[30px] px-4 sm:px-[30px] py-2 sm:py-[5px] items-center gap-2 sm:gap-0">
          <button
            onClick={() => setStatus("puan")}
            className={`
    w-full sm:w-auto px-[15px] py-[5px] rounded-[12px] transition-all duration-300

    ${
      isTab("puan")
        ? "bg-[#240046] scale-90 shadow-[0_0_15px_#9D4EDD]"
        : "hover:bg-[#350266]"
    }
  `}
          >
            Puan Durumu
          </button>
          <button
            onClick={() => setStatus("fixture")}
            className={`
    w-full sm:w-auto px-[15px] py-[5px] rounded-[12px] transition-all duration-300

    ${
      isTab("fixture")
        ? "bg-[#240046] bg-[#240046] scale-90 shadow-[0_0_15px_#9D4EDD]"
        : "hover:bg-[#350266]"
    }
  `}
          >
            Fikstür
          </button>
          <button
            onClick={() => setStatus("players")}
            className={`
    w-full sm:w-auto px-[15px] py-[5px] rounded-[12px] transition-all duration-300

    ${
      isTab("players")
        ? "bg-[#240046] bg-[#240046] scale-90 shadow-[0_0_15px_#9D4EDD]"
        : "hover:bg-[#350266]"
    }
  `}
          >
            Oyuncular
          </button>
        </div>
        <div
          className="flex-1 
mt-[5px] 
overflow-y-auto 
scrollbar
scrollbar-thumb-[#974CE0]
scrollbar-track-transparent"
        >
          {status === "puan" && (
            <>
              <LeagueInfo
                initialLeagueId={id}
                initialLeagueSeason={season}
                syncUrl={false}
                hideSelectors={true}
              />
            </>
          )}

          {/* TEAM */}
          {status === "fixture" && (
            <div className="">
              <TeamMatches id={id} season={season} />
            </div>
          )}

          {/* PLAYER */}
          {status === "players" && (
            <>
              <TeamPlayers id={id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamContainer;
