import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main
        className="px-4 sm:px-8 md:px-12 lg:px-[120px] py-6 sm:py-8 md:py-[50px] min-h-[calc(100vh-280px)] md:h-[calc(120vh-140px)] bg-[url('/src/assets/mainBg.png')] bg-cover bg-center bg-no-repeat"
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
