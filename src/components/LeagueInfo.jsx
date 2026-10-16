import React, { useState, useEffect } from "react";
import LeagueSelection from "./LeagueSelection.jsx";
import SelectionSeason from "./SelectionSeason.jsx";
import { league_info, ranksdata } from "../datas/apiDatas.js";
import Ranks, { RANK_GRID } from "./Ranks.jsx";
import FavButton from "./FavButton.jsx";
import { DEFAULT_SEASON } from "../config.js";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getLeaugueRanksAndInfo } from "../services/apiServices.js";

function LeagueInfo({
  initialLeagueId,
  initialLeagueSeason,
  syncUrl = true,
  hideSelectors = false,
}) {
  const [selectLeagueId, setSelectLeagueId] = useState(initialLeagueId || 39);
  const [selectSeason, setSelectSeason] = useState(initialLeagueSeason || DEFAULT_SEASON);
  const [leagueInfo, setLeagueInfo] = useState({});
  const [teamRanks, setTeamRanks] = useState([]);
  const [favLeagues, setFavLeagues] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const toggleLeagueFav = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const current = data.favorites?.leagues || [];

    const exists = current.some((l) => l.id === leagueInfo.id);

    let updated;

    if (exists) {
      // ❌ kaldır
      updated = current.filter((l) => l.id !== leagueInfo.id);
    } else {
      // ⭐ ekle
      const newLeague = {
        id: leagueInfo.id,
        league_name: leagueInfo.league_name,
        logo: leagueInfo.logo,
      };

      updated = [...current, newLeague];
    }

    await updateDoc(ref, {
      "favorites.leagues": updated,
    });

    setFavLeagues(updated);
  };

  const isFavLeague = favLeagues.some((l) => l.id === leagueInfo.id);

  useEffect(() => {
    if (!selectLeagueId || !selectSeason) return;
    const fetchFavLeagues = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setFavLeagues(data.favorites?.leagues || []);
      }
    };
    async function fetchData() {
      try {
        const [leagueRes, teamRes] = await getLeaugueRanksAndInfo(
          selectLeagueId,
          selectSeason,
        );
        if (!leagueRes) {
          // servisten boş döndüyse
          setLeagueInfo({});
          setTeamRanks([]);
        } else {
          setLeagueInfo(leagueRes);
          setTeamRanks(teamRes || []);
        }
      } catch (error) {
        console.error("getLeaugue error:", error);
        setLeagueInfo({});
        setTeamRanks([]);
      }
    }
    //fetchData();
    setLeagueInfo(league_info || []);
    setTeamRanks(ranksdata || []);
    fetchFavLeagues();
    if (syncUrl) {
      navigate(`/league/${selectLeagueId}/${selectSeason}`, { replace: true });
    }
  }, [selectLeagueId, selectSeason, currentUser, navigate]);

  return (
    <section className="card flex h-full min-h-0 flex-col p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Lig adı, ülke, sezon */}
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={leagueInfo.logo}
              alt=""
              className="size-12 shrink-0 rounded-xl bg-white/90 object-contain p-1.5"
            />
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-bold sm:text-2xl">
                <button
                  type="button"
                  onClick={() => navigate(`/league/${leagueInfo.id}/${selectSeason}`)}
                  className="transition hover:text-accent"
                >
                  {leagueInfo.league_name}
                </button>
              </h2>
              <p className="text-sm text-muted">
                {leagueInfo.country} · {selectSeason} - {selectSeason + 1}
              </p>
            </div>
            <FavButton
              active={isFavLeague}
              onClick={toggleLeagueFav}
              label="Ligi favorilere ekle"
            />
          </div>

          {/* Seçiciler */}
          <div className="flex flex-wrap items-center gap-2">
            {!hideSelectors && (
              <LeagueSelection
                selectedLeague={selectLeagueId}
                setLeague={setSelectLeagueId}
              />
            )}
            <SelectionSeason season={selectSeason} setSeason={setSelectSeason} />
          </div>
        </div>

        {/* Başlık satırı: satırlarla aynı sütun düzeni */}
        <div
          className={`${RANK_GRID} border-b border-line px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted`}
        >
          <span>#</span>
          <span>Takım</span>
          <span className="hidden text-center sm:block" title="Oynanan">O</span>
          <span className="hidden text-center sm:block" title="Galibiyet">G</span>
          <span className="hidden text-center sm:block" title="Beraberlik">B</span>
          <span className="hidden text-center sm:block" title="Mağlubiyet">M</span>
          <span className="hidden text-center sm:block" title="Averaj">AV</span>
          <span className="text-center">P</span>
          <span className="text-center">Form</span>
        </div>
      </div>

      <div className="custom-scroll mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
        {teamRanks.map((teams) => (
          <Ranks key={teams.teams.id} teams={teams} />
        ))}
      </div>
    </section>
  );
}

export default LeagueInfo;
