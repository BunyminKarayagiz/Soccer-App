import React, { useState, useEffect } from "react";
import { xPlayerData } from "../datas/apiDatas.js";
import teamIcon from "../assets/teamIcon.png";
import birthday from "../assets/birthday.png";
import PlayerClubs from "./PlayerClubs.jsx";
import PlayerStatistics from "./PlayerStatistics.jsx";
import { xPlayerClubsData } from "../datas/apiDatas.js";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getPlayerClubs } from "../services/apiServices.js";
import SelectionSeason from "./SelectionSeason.jsx";
import { getPlayerStatistic } from "../services/apiServices.js";
import { xPlayerStatData } from "../datas/apiDatas.js";
import FavButton from "./FavButton.jsx";
function PlayerContainer({ id }) {
  const [player, setPlayer] = useState(xPlayerData);
  const [status, setStatus] = useState("club");
  const [playerClubsData, setPlayerClubsData] = useState(xPlayerClubsData);
  const [playerStatData, setPlayerStatData] = useState(xPlayerStatData);
  const [selectedSeason, setSelectedSeason] = useState(2023);
  const { currentUser } = useAuth();
  const [favPlayers, setFavPlayers] = useState([]);
  const navigate = useNavigate();

  const isTab = (name) => status === name;

  useEffect(() => {
    const fetchFavs = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavPlayers(snap.data().favorites?.players || []);
      }
    };

    async function fetchStatData() {
      try {
        const [playerStatDataRes, playerDataRes] = await getPlayerStatistic(
          id,
          selectedSeason,
        );

        console.log("SEASON:", selectedSeason);
        console.log("STAT:", playerStatDataRes);
        console.log("PLAYER:", playerDataRes);
        console.log(typeof selectedSeason);
        // stat yoksa bile player bilgisi kalsın
        if (playerDataRes) {
          setPlayer(playerDataRes);
        }

        if (playerStatDataRes) {
          setPlayerStatData(playerStatDataRes);
        } else {
          setPlayerStatData([]);
        }
      } catch (error) {
        console.error("STAT ERROR:", error);
        setPlayerStatData([]);
      }
    }

    async function fetchPlayerClubData() {
      try {
        const playerClubDataRes = await getPlayerClubs(id);
        console.log(playerClubDataRes);
        if (!playerClubDataRes) {
          // servisten boş döndüyse
          setPlayerClubsData([]);
        } else {
          setPlayerClubsData(playerClubDataRes);
        }
      } catch (error) {
        console.error("getLeaugue error:", error);
        setPlayerClubsData([]);
      }
    }
    //fetchStatData();
    fetchPlayerClubData();
    fetchFavs();
  }, [currentUser, selectedSeason, id]);

  const toggleFav = async (e) => {
    e.stopPropagation(); // karta tıklayıp player sayfasına gitmesin

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const ref = doc(db, "users", currentUser.uid);

    const exists = favPlayers.find((p) => p.id === player.player.id);

    let updated;

    if (exists) {
      // kaldır
      updated = favPlayers.filter((p) => p.id !== player.player.id);
    } else {
      // ekle
      const newFav = {
        id: player.player.id,
        name: player.player.name,
        photo: player.player.photo,
      };

      updated = [...favPlayers, newFav];
    }

    await updateDoc(ref, {
      "favorites.players": updated,
    });

    setFavPlayers(updated);
  };
  const isFav = favPlayers.some((p) => p.id === player.id);
  console.log(player);
  console.log(selectedSeason);
  return (
    <div className="card grid min-w-0 grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-12 lg:p-8">
      <div className="flex flex-col lg:col-span-4">
        <div className="flex flex-col gap-[15px] text-ink sm:flex-row">
          <div className="flex justify-center sm:justify-start">
            <img src={player.photo} alt="" className="size-32 shrink-0 rounded-xl object-cover sm:size-40" />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-4 sm:gap-[30px] items-center flex-wrap">
              <h1 className="font-black text-2xl sm:text-3xl md:text-[50px]">{player.name}</h1>
              <FavButton
                active={isFav}
                onClick={toggleFav}
                label={`${player.name} favorilere ekle`}
                activeLabel={`${player.name} favorilerden çıkar`}
              />
            </div>
            <h2 className="font-normal text-xl sm:text-2xl md:text-[30px]">{player.nationality}</h2>
            <div className="flex gap-[10px] items-center">
              {/* Buraya TD bilgileri çekilip verilecek */}
              <img
                src={teamIcon}
                alt=""
                className="h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] object-contain rounded-[5px]"
              />
              <p className="font-normal text-lg sm:text-xl md:text-[30px]">{player.position}</p>
            </div>
            <div className="flex gap-[10px] items-center">
              <img
                src={birthday}
                alt=""
                className="h-[30px] w-[30px] object-contain sm:h-[40px] sm:w-[40px]"
              />
              <p className="font-normal text-base sm:text-lg md:text-[25px]">{player.birth.date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex min-w-0 flex-col lg:col-span-8 lg:col-end-13 lg:mt-0">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1.5 text-xs font-medium text-ink sm:gap-2 sm:p-2 sm:text-sm">
          <button
            onClick={() => setStatus("club")}
            className={`
    min-w-0 rounded-lg px-1.5 py-2 transition-all duration-300 sm:px-3

    ${
      isTab("club")
        ? "scale-95 bg-surface text-accent shadow-md ring-1 ring-primary/40"
        : "hover:bg-surface-3"
    }
  `}
          >
            Kulüpler
          </button>
          <button
            onClick={() => setStatus("istatistik")}
            className={`
    min-w-0 rounded-lg px-1.5 py-2 transition-all duration-300 sm:px-3

    ${
      isTab("istatistik")
        ? "scale-95 bg-surface text-accent shadow-md ring-1 ring-primary/40"
        : "hover:bg-surface-3"
    }
  `}
          >
            İstatistikler
          </button>
        </div>
        <div
          className="mt-2 min-h-80 overflow-y-auto"
        >
          {/* TEAM */}
          {status === "club" && (
            <div className="">
              <PlayerClubs data={playerClubsData} />
            </div>
          )}

          {/* PLAYER */}
          {status === "istatistik" && (
            <div className="card rounded-xl p-4 text-ink sm:p-6">
              <div className="flex justify-center mb-6">
                <SelectionSeason
                  season={selectedSeason}
                  setSeason={setSelectedSeason}
                />
              </div>
              <PlayerStatistics key={selectedSeason} data={playerStatData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayerContainer;
