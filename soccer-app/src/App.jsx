import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Favorites from "./pages/Favorites.jsx";
import Teams from "./pages/Teams.jsx";
import Team from "./pages/Team.jsx";
import League from "./pages/League.jsx";
import Leagues from "./pages/Leagues.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./components/Profile.jsx";
import Player from "./pages/Player.jsx";
import Players from "./pages/Players.jsx";
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route path="/teams" element={<Teams />} />
        <Route path="/team/:id/:season" element={<Team />} />
        <Route path="/league/:id/:season" element={<League />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/players" element={<Players />} />
        <Route path="/player/:id" element={<Player />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
