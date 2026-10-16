import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import MobileTabBar from "../components/MobileTabBar.jsx";
import { Outlet } from "react-router-dom";

// Sayfa iskeleti: üstte sabit menü, ortada içerik, altta sade footer,
// mobilde ekranın altında sekme çubuğu.
// Arka plandaki ışıma, aktif temanın --c-bg-glow rengini kullanır (bkz. index.css).
export default function MainLayout() {
  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{
        backgroundImage:
          "radial-gradient(60rem 30rem at 20% -10%, color-mix(in srgb, var(--c-bg-glow) 55%, transparent), transparent 70%), radial-gradient(40rem 24rem at 100% 0%, color-mix(in srgb, var(--c-primary) 18%, transparent), transparent 70%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
