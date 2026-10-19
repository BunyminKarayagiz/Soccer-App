import React, { useEffect, useState } from "react";
import MyLeagues from "../components/MyLeagues.jsx";
import MyPlayers from "../components/MyPlayers.jsx";
import MyTeams from "../components/MyTeams.jsx";
import MyMatches from "../components/MyMatches.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

function Favorites() {
  const { currentUser, emailVerified } = useAuth();
  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    const getFavs = async () => {
      if (!currentUser || !emailVerified) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavorites(snap.data().favorites || {});
      }
    };

    getFavs();
  }, [currentUser, emailVerified]);

  if (!favorites) {
    return <div className="py-10 text-center text-muted">Yükleniyor...</div>;
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 md:grid-cols-2">
      <div className="min-w-0">
        <MyLeagues data={favorites.leagues || []} />
      </div>

      <div className="min-w-0">
        <MyPlayers data={favorites.players || []} />
      </div>

      <div className="min-w-0">
        <MyTeams data={favorites.teams || []} />
      </div>

      <div className="min-w-0">
        <MyMatches data={favorites.matches || []} />
      </div>
    </div>
  );
}

export default Favorites;
