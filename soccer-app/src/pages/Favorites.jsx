import React, { useEffect, useState } from "react";
import MyLeagues from "../components/MyLeagues";
import MyPlayers from "../components/MyPlayers";
import MyTeams from "../components/MyTeams";
import MyMatches from "../components/MyMatches";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Favorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    const getFavs = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavorites(snap.data().favorites || {});
      }
    };

    getFavs();
  }, [currentUser]);

  if (!favorites) return <div className="text-white">Yükleniyor...</div>;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <MyLeagues data={favorites.leagues || []} />
      </div>

      <div className="col-span-3">
        <MyPlayers data={favorites.players || []} />
      </div>

      <div className="col-span-3">
        <MyTeams data={favorites.teams || []} />
      </div>

      <div className="col-span-3">
        <MyMatches data={favorites.matches || []} />
      </div>
    </div>
  );
}

export default Favorites;
