import React, { useEffect, useState } from "react";
import { xcoachData, xteamData } from "../datas/apiDatas.js";
import stadium from "../assets/stadium.png";
import LeagueInfo from "./LeagueInfo.jsx";
import TeamMatches from "./TeamMatches.jsx";
import TeamPlayers from "./TeamPlayers.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getTeamCoach } from "../services/apiServices.js";
import { getTeam } from "../services/apiServices.js";
import FavButton from "./FavButton.jsx";

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
      <div className="card flex h-full items-center justify-center rounded-xl p-4 sm:p-6 md:p-12">
        <div className="text-center text-ink">
          <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-xl">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Veri yoksa
  if (!teamData || !teamData.team) {
    return (
      <div className="card flex h-full items-center justify-center rounded-xl p-4 sm:p-6 md:p-12">
        <div className="text-center text-ink">
          <p className="text-xl">Takım bilgisi bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card grid min-w-0 grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-12 lg:p-8">
      <div className="flex flex-col lg:col-span-4">
        <div className="flex flex-col gap-[15px] text-ink sm:flex-row">
          <div className="flex justify-center sm:justify-start">
            <img src={teamData?.team?.logo} alt="" className="size-24 shrink-0 object-contain sm:size-32" />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-4 sm:gap-[30px] items-center flex-wrap">
              <h1 className="font-black text-2xl sm:text-3xl md:text-[40px]">{teamData?.team?.name}</h1>
              <FavButton
                active={isFav}
                onClick={toggleFav}
                label={`${teamData.team.name} favorilere ekle`}
                activeLabel={`${teamData.team.name} favorilerden çıkar`}
              />
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

      <div className="mt-2 flex min-w-0 flex-col lg:col-span-8 lg:col-end-13 lg:mt-0">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1.5 text-xs font-medium text-ink sm:gap-2 sm:p-2 sm:text-sm">
          <button
            onClick={() => setStatus("puan")}
            className={`
    min-w-0 rounded-lg px-1.5 py-2 transition-all duration-300 sm:px-3

    ${
      isTab("puan")
        ? "scale-95 bg-surface text-accent shadow-md ring-1 ring-primary/40"
        : "hover:bg-surface-3"
    }
  `}
          >
            Puan Durumu
          </button>
          <button
            onClick={() => setStatus("fixture")}
            className={`
    min-w-0 rounded-lg px-1.5 py-2 transition-all duration-300 sm:px-3

    ${
      isTab("fixture")
        ? "scale-95 bg-surface text-accent shadow-md ring-1 ring-primary/40"
        : "hover:bg-surface-3"
    }
  `}
          >
            Fikstür
          </button>
          <button
            onClick={() => setStatus("players")}
            className={`
    min-w-0 rounded-lg px-1.5 py-2 transition-all duration-300 sm:px-3

    ${
      isTab("players")
        ? "scale-95 bg-surface text-accent shadow-md ring-1 ring-primary/40"
        : "hover:bg-surface-3"
    }
  `}
          >
            Oyuncular
          </button>
        </div>
        <div
          className="mt-2 min-h-80 overflow-y-auto"
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
              <TeamPlayers />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamContainer;