import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { IoPersonOutline, IoLogOutOutline } from "react-icons/io5";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebase.js";
import defaultPp from "../assets/defaultPp.png";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import { NAV_ITEMS, isNavActive } from "../layout/navItems.js";

// Üst menü. Masaüstünde: logo + sekmeler + tema + profil.
// Mobilde: sadece logo + tema + profil (sekmeler alt çubukta, bkz. MobileTabBar).
function Navbar() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [photo, setPhoto] = useState(defaultPp);
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logoutUser();
    setOpenProfile(false);
    navigate("/");
  };

  // Profil menüsü dışına tıklayınca / Esc ile kapat
  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpenProfile(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Giriş yapan kullanıcının profil fotoğrafını Firestore'dan al
  useEffect(() => {
    if (!currentUser) {
      setPhoto(defaultPp);
      return;
    }
    const fetchUserPhoto = async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        setPhoto(snap.exists() && snap.data().photoURL ? snap.data().photoURL : defaultPp);
      } catch (err) {
        console.log("pp çekme hata:", err);
        setPhoto(defaultPp);
      }
    };
    fetchUserPhoto();
  }, [currentUser]);

  const items = NAV_ITEMS.filter((item) => !item.authOnly || currentUser);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          <span className="text-ink">Soccer</span>
          <span className="text-accent">Ball</span>
        </Link>

        {/* Masaüstü sekmeleri */}
        <nav aria-label="Ana menü" className="ml-6 hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const active = isNavActive(item, pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className="chip"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sağ taraf */}
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitcher />

          {!currentUser ? (
            <button type="button" onClick={() => navigate("/login")} className="btn-accent text-sm">
              Giriş Yap
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpenProfile((o) => !o)}
                aria-label="Profil menüsü"
                aria-expanded={openProfile}
                className="block rounded-full ring-2 ring-primary transition hover:ring-accent"
              >
                <img src={photo} alt="" className="size-10 rounded-full object-cover" />
              </button>

              {openProfile && (
                <div className="card absolute right-0 z-50 mt-2 w-48 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/profile");
                      setOpenProfile(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition hover:bg-surface-2"
                  >
                    <IoPersonOutline size={18} /> Profil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-lose transition hover:bg-surface-2"
                  >
                    <IoLogOutOutline size={18} /> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
