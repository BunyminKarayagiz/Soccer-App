import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Favorites from "./pages/Favorites";
import Teams from "./pages/Teams";
import Team from "./pages/Team";
import League from "./pages/League";
import Leagues from "./pages/Leagues";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Player from "./pages/Player";
import Players from "./pages/Players";
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
