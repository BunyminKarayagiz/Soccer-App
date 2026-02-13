import React, { useEffect, useState } from "react";
import { xcoachData, xteamData } from "../datas/apiDatas";
import stadium from "../assets/stadium.png";
import LeagueInfo from "./LeagueInfo";
import TeamMatches from "./TeamMatches";
import TeamPlayers from "./TeamPlayers";
import { useNavigate } from "react-router-dom";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function TeamContainer({ id, season }) {
  const [teamData, setTeamData] = useState(xteamData);
  const [coachData, setCoachData] = useState(xcoachData);
  const [status, setStatus] = useState("puan");
  const { currentUser } = useAuth();
  const [favTeams, setFavTeams] = useState([]);

  const navigate = useNavigate();

  const isTab = (name) => status === name;

  useEffect(() => {
    const fetchFavs = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavTeams(snap.data().favorites?.teams || []);
      }
    };
    fetchFavs();
  }, [currentUser]);

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
    <div className="bg-[#3C096C] rounded-[12px] p-[50px] grid grid-cols-12 gap-4 h-full">
      <div className="flex flex-col col-span-4">
        <div className="flex text-white gap-[15px] ">
          <div>
            <img src={teamData.team.logo} alt="" />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-[30px] items-center">
              <h1 className="font-black text-[50px]">{teamData.team.name}</h1>
              {isFav ? (
                <IoIosStar
                  onClick={toggleFav}
                  className="size-8 ml-[15px] text-yellow-400 cursor-pointer"
                />
              ) : (
                <IoIosStarOutline
                  onClick={toggleFav}
                  className="size-8 ml-[15px] text-white cursor-pointer"
                />
              )}
            </div>
            <h2 className="font-normal text-[30px]">{teamData.team.country}</h2>
            <div className="flex gap-[10px] items-center">
              {/* Buraya TD bilgileri çekilip verilecek */}
              <img
                src={coachData.photo}
                alt=""
                className="h-[40px] w-[40px] object-contain rounded-[5px]"
              />
              <p className="font-normal text-[30px]">{coachData.name}</p>
            </div>
            <div className="flex gap-[10px] items-center">
              <img
                src={stadium}
                alt=""
                className="h-[40px] w-[40px] object-contain"
              />
              <p className="font-normal text-[30px]">{teamData.venue.name}</p>
            </div>
          </div>
        </div>
        <div className="mt-[70px]">
          <img src={teamData.venue.image} alt="" className="rounded-[12px]" />
        </div>
      </div>

      <div className="col-span-8 col-end-13 overflow-y-auto h-full flex flex-col">
        <div className="flex justify-around rounded-[12px] bg-[#5A189A] text-white font-normal text-[30px] px-[30px] py-[5px] items-center">
          <button
            onClick={() => setStatus("puan")}
            className={`
    px-[15px] py-[5px] rounded-[12px] transition-all duration-300

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
    px-[15px] py-[5px] rounded-[12px] transition-all duration-300

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
    px-[15px] py-[5px] rounded-[12px] transition-all duration-300

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
          className="col-span-8 col-end-13 flex-1 
mt-[5px] 
overflow-y-auto 
scrollbar
scrollbar-thumb-[#974CE0]
scrollbar-track-transparent"
        >
          {status === "puan" && (
            <>
              <LeagueInfo syncUrl={false} />
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
              <TeamPlayers />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamContainer;
