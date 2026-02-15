import React, { useEffect, useState } from "react";
import MyLeagues from "../components/MyLeagues.jsx";
import MyPlayers from "../components/MyPlayers.jsx";
import MyTeams from "../components/MyTeams.jsx";
import MyMatches from "../components/MyMatches.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

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

  if (!favorites) return <div className="text-white text-center py-10">Yükleniyor...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <MyLeagues data={favorites.leagues || []} />
      </div>

      <div>
        <MyPlayers data={favorites.players || []} />
      </div>

      <div>
        <MyTeams data={favorites.teams || []} />
      </div>

      <div>
        <MyMatches data={favorites.matches || []} />
      </div>
    </div>
  );
}

export default Favorites;
