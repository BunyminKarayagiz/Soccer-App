import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { xLiveMatchesData } from "../datas/apiDatas.js";
import { DEFAULT_SEASON } from "../config.js";
import FavButton from "./FavButton.jsx";
import stadImg from "../assets/stadium.png";
//import { getLiveMatchs, topLeagues_str } from "../services/apiServices.js";

function LiveMatches() {
  const [groupedMatchs, setGroupedMatchs] = useState({});
  const [favMatches, setFavMatches] = useState([]);
  const { currentUser, emailVerified } = useAuth();
  const navigate = useNavigate();

  const isFav = (matchId) => favMatches.some((m) => m.fixture_id === matchId);

  const handleFav = async (match) => {
    if (!currentUser || !emailVerified) {
      navigate(currentUser ? "/verify-email" : "/login");
      return;
    }

    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const currentFavs = snap.data().favorites?.matches || [];
    const exists = currentFavs.some((m) => m.fixture_id === match.fixture_id);

    // Kaldır ya da ekle (güncel Firestore listesi üzerinden)
    const updated = exists
      ? currentFavs.filter((m) => m.fixture_id !== match.fixture_id)
      : [...currentFavs, match];

    await updateDoc(ref, { "favorites.matches": updated });
    setFavMatches(updated);
  };

  useEffect(() => {
    const fetchFav = async () => {
      if (!currentUser || !emailVerified) return;
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setFavMatches(snap.data().favorites?.matches || []);
      }
    };

    /* Gerçek API çağrısı (tasarım aşamasında kapalı):
    const fetchLive = async () => {
      try {
        const data = await getLiveMatchs(topLeagues_str);
        if (data) setGroupedMatchs(data);
      } catch (err) {
        console.log("live match çekme hata:", err);
      }
    };
    fetchLive();*/
    setGroupedMatchs(xLiveMatchesData);
    fetchFav();
  }, [currentUser, emailVerified]);

  const groups = Object.values(groupedMatchs || {});

  if (groups.length === 0) {
    return (
      <p className="p-8 text-center text-muted">Şu anda canlı maç yok.</p>
    );
  }

  return (
    <div className="custom-scroll min-h-0 flex-1 space-y-5 overflow-y-auto p-3 sm:p-4">
      {groups.map((group) => (
        <section key={group.league.league_id}>
          {/* Lig başlığı */}
          <button
            type="button"
            onClick={() => navigate(`/league/${group.league.league_id}/${DEFAULT_SEASON}`)}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-surface-2"
          >
            <img src={group.league.league_logo} alt="" className="size-6 object-contain" />
            <h3 className="truncate text-sm font-bold uppercase tracking-wide text-muted">
              {group.league.league_name}
            </h3>
          </button>

          <ul className="space-y-2">
            {group.matches.map((match) => (
              <li
                key={match.fixture_id}
                className="row grid grid-cols-[auto_2.75rem_minmax(0,1fr)_auto] items-center gap-2 px-2 py-2.5 sm:gap-3 sm:px-3"
              >
                <FavButton
                  active={isFav(match.fixture_id)}
                  onClick={() => handleFav(match)}
                  label="Maçı favorilere ekle"
                />

                {/* Dakika (canlı göstergesi) */}
                <span className="tabular flex items-center gap-1 text-xs font-bold text-live">
                  <span className="size-1.5 animate-pulse rounded-full bg-live" aria-hidden="true" />
                  {match.elapsed}'
                </span>

                {/* Takımlar (alt alta) */}
                <div className="min-w-0 space-y-1.5">
                  {[match.home_team, match.away_team].map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => navigate(`/team/${team.id}/${DEFAULT_SEASON}`)}
                      className="flex w-full min-w-0 items-center gap-2 text-left text-sm font-semibold transition hover:text-accent"
                    >
                      <img src={team.logo} alt="" className="size-6 shrink-0 object-contain" />
                      <span className="truncate">{team.name}</span>
                    </button>
                  ))}
                  {/* Stadyum: sadece veride varsa gösterilir (hakem canlı maçta gösterilmez) */}
                  {match.venue && (
                    <p className="flex items-center gap-1.5 pt-0.5 text-xs text-muted">
                      <img src={stadImg} alt="" className="size-4 object-contain opacity-80" />
                      <span className="truncate">{match.venue}</span>
                    </p>
                  )}
                </div>

                {/* Skor */}
                <div className="tabular flex flex-col items-center gap-1.5 pr-1 font-display text-base font-bold">
                  <span className="grid h-6 min-w-6 place-items-center">{match.home_team.goal}</span>
                  <span className="grid h-6 min-w-6 place-items-center">{match.away_team.goal}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default LiveMatches;
