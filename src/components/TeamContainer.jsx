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
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [favTeams, setFavTeams] = useState([]);
  
  const navigate = useNavigate();
  
  const isTab = (name) => status === name;

  useEffect(() => {
    // Tüm verileri çek
    const fetchAllData = async () => {
      setLoading(true);
      
      try {
        // Favorileri çek
        if (currentUser) {
          const ref = doc(db, "users", currentUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setFavTeams(snap.data().favorites?.teams || []);
          }
        }

        // Coach ve Team verilerini paralel olarak çek
        const [coachDataRes, teamDataRes] = await Promise.all([
          getTeamCoach(id),
          getTeam(id)
        ]);

        // Coach data kontrolü
        console.log("Coach Data:", coachDataRes);
        if (coachDataRes) {
          setCoachData(coachDataRes);
        } else {
          console.log("Coach DATA YOK - Varsayılan veri kullanılıyor");
        }

        // Team data kontrolü
        console.log("Team Data:", teamDataRes);
        if (teamDataRes && teamDataRes.team) {
          setTeamData(teamDataRes);
        } else {
          console.log("TEAM DATA YOK - Varsayılan veri kullanılıyor");
        }

      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    //fetchAllData();
  }, [currentUser, id, season]);

  const toggleFav = async (e) => {
    e.stopPropagation();

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

  console.log(coachData.coach,teamData)
  // Loading durumu
  if (loading) {
    return (
      <div className="bg-[#3C096C] rounded-[12px] p-4 sm:p-6 md:p-[50px] h-full flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Veri yoksa
  if (!teamData || !teamData.team) {
    return (
      <div className="bg-[#3C096C] rounded-[12px] p-4 sm:p-6 md:p-[50px] h-full flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl">Takım bilgisi bulunamadı.</p>
        </div>
      </div>
    );
  }

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
              {coachData?.coach?.photo && (
                <img
                  src={coachData.coach?.photo}
                  alt=""
                  className="h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] object-contain rounded-[5px]"
                />
              )}
              <p className="font-normal text-lg sm:text-xl md:text-[30px]">
                {coachData?.coach?.name || "Teknik Direktör Bilgisi Yok"}
              </p>
            </div>
            <div className="flex gap-[10px] items-center">
              <img
                src={stadium}
                alt=""
                className="h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] object-contain"
              />
              <p className="font-normal text-lg sm:text-xl md:text-[30px]">
                {teamData?.vanue?.name || "Stadyum Bilgisi Yok"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-10 md:mt-[70px]">
          {teamData?.vanue?.image && (
            <img src={teamData.vanue?.image} alt="" className="rounded-[12px] w-full" />
          )}
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
                initialLeagueId={teamData?.team?.league?.id || id}
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