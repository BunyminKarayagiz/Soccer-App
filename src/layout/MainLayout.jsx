import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main
        className="px-[120px] py-[50px] h-[calc(120vh-140px)] bg-[url('/src/assets/mainBg.png')] bg-cover bg-center bg-no-repeat"
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
