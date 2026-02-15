import React, { useState, useEffect } from "react";
import { xPlayerData } from "../datas/apiDatas";
import teamIcon from "../assets/teamIcon.png";
import birthday from "../assets/birthday.png";
import PlayerClubs from "./playerClubs";
import PlayerStatistics from "./PlayerStatistics";
import { xPlayerClubsData } from "../datas/apiDatas";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getPlayerClubs } from "../services/apiServices.js";
import SelectionSeason from "./SelectionSeason.jsx";
import { getPlayerStatistic } from "../services/apiServices.js";
import { xPlayerStatData } from "../datas/apiDatas";
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
    //fetchPlayerClubData();
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
    <div className="bg-[#3C096C] rounded-[12px] p-[50px] grid grid-cols-12 gap-4 h-full">
      <div className="flex flex-col col-span-4">
        <div className="flex text-white gap-[15px] ">
          <div>
            <img src={player.photo} alt="" className="rounded-[12px]" />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-[30px] items-center">
              <h1 className="font-black text-[50px]">{player.name}</h1>
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
            <h2 className="font-normal text-[30px]">{player.nationality}</h2>
            <div className="flex gap-[10px] items-center">
              {/* Buraya TD bilgileri çekilip verilecek */}
              <img
                src={teamIcon}
                alt=""
                className="h-[40px] w-[40px] object-contain rounded-[5px]"
              />
              <p className="font-normal text-[30px]">{player.position}</p>
            </div>
            <div className="flex gap-[10px] items-center">
              <img
                src={birthday}
                alt=""
                className="h-[40px] w-[40px] object-contain text-white"
              />
              <p className="font-normal text-[25px]">{player.birth}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-8 col-end-13 overflow-y-auto h-full flex flex-col">
        <div className="flex justify-around rounded-[12px] bg-[#5A189A] text-white font-normal text-[30px] px-[30px] py-[5px] items-center">
          <button
            onClick={() => setStatus("club")}
            className={`
    px-[15px] py-[5px] rounded-[12px] transition-all duration-300

    ${
      isTab("club")
        ? "bg-[#240046] scale-90 shadow-[0_0_15px_#9D4EDD]"
        : "hover:bg-[#350266]"
    }
  `}
          >
            Kulüpler
          </button>
          <button
            onClick={() => setStatus("istatistik")}
            className={`
    px-[15px] py-[5px] rounded-[12px] transition-all duration-300

    ${
      isTab("istatistik")
        ? "bg-[#240046] scale-90 shadow-[0_0_15px_#9D4EDD]"
        : "hover:bg-[#350266]"
    }
  `}
          >
            İstatistikler
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
          {/* TEAM */}
          {status === "club" && (
            <div className="">
              <PlayerClubs data={playerClubsData} />
            </div>
          )}

          {/* PLAYER */}
          {status === "istatistik" && (
            <div className="bg-[#4c0d82] p-6 rounded-xl text-white">
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
