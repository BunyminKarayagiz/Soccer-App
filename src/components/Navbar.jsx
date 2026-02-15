import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import defaultPp from "../assets/defaultPp.png";

import { auth, db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
function Navbar() {
  const [photo, setPhoto] = useState(defaultPp);
  const { currentUser, logoutUser } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  const handleLogout = async () => {
    await logoutUser();
    navigate("/"); // çıkış yaptıktan sonra ana sayfaya yönlendir
  };
  useEffect(() => {
    // 🔽 dropdown dışına tıklayınca kapat
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // 🔽 firestore'dan profil foto çek
    const fetchUserPhoto = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();

          if (data.photoURL && data.photoURL !== "") {
            setPhoto(data.photoURL);
          } else {
            setPhoto(defaultPp);
          }
        }
      } catch (err) {
        console.log("pp çekme hata:", err);
        setPhoto(defaultPp);
      }
    };

    fetchUserPhoto();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[140px] md:h-[140px] sm:h-[80px] bg-[#240046]">
      <div className="h-full px-4 sm:px-6 md:px-12 lg:px-[83px] py-4 sm:py-6 md:py-[42px] flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl cursor-pointer z-50"
          onClick={() => {
            navigate(`/`);
          }}
        >
          <span className="text-white">Soccer</span>
          <span className="text-[#E1FF00] font-bold">Ball</span>
        </h1>

        {/* Hamburger Menu Button - Mobile Only */}
        <button
          className="lg:hidden text-white z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center text-white">
          <button
            onClick={() => {
              navigate(`/leagues/`);
            }}
            className={`flex items-center gap-[10px]
    text-lg xl:text-[25px] font-normal font-inter
    px-2 xl:px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
     ${
       isActive("/league")
         ? "bg-[#3C096C] shadow-[0_0_15px_#9D4EDD] scale-105"
         : "hover:bg-[#350266]"
     }`}
          >
            <span>Ligler</span>
            {!isActive("/league") ? (
              <IoIosArrowDown size={30} />
            ) : (
              <IoIosArrowUp size={30} />
            )}
          </button>

          <span className="mx-3 xl:mx-6 h-8 w-[2px] bg-white/70" />

          <button
            onClick={() => {
              navigate(`/teams/`);
            }}
            className={`    flex items-center gap-[10px]
    text-lg xl:text-[25px] font-normal font-inter
    px-2 xl:px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
     ${
       isActive("/team")
         ? "bg-[#3C096C] shadow-[0_0_15px_#9D4EDD] scale-105"
         : "hover:bg-[#350266]"
     }`}
          >
            <span>Takımlar</span>
            {!isActive("/team") ? (
              <IoIosArrowDown size={30} />
            ) : (
              <IoIosArrowUp size={30} />
            )}
          </button>

          <span className="mx-3 xl:mx-6 h-8 w-[2px] bg-white/70" />

          <button
            onClick={() => {
              navigate(`/players/`);
            }}
            className={`    flex items-center gap-[10px]
    text-lg xl:text-[25px] font-normal font-inter
    px-2 xl:px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
     ${
       isActive("/player")
         ? "bg-[#3C096C] shadow-[0_0_15px_#9D4EDD] scale-105"
         : "hover:bg-[#350266]"
     }`}
          >
            <span>Oyuncular</span>
            {!isActive("/player") ? (
              <IoIosArrowDown size={30} />
            ) : (
              <IoIosArrowUp size={30} />
            )}
          </button>

          {!currentUser ? (
            <></>
          ) : (
            <>
              <span className="mx-3 xl:mx-6 h-8 w-[2px] bg-white/70" />
              <button
                onClick={() => {
                  navigate(`/favorites/`);
                }}
                className={`    flex items-center gap-[10px]
    text-lg xl:text-[25px] font-normal font-inter
    px-2 xl:px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
     ${
       isActive("/favorite")
         ? "bg-[#3C096C] shadow-[0_0_15px_#9D4EDD] scale-105"
         : "hover:bg-[#350266]"
     }`}
              >
                <span>Favoriler</span>
                {!isActive("/favorite") ? (
                  <IoIosArrowDown size={30} />
                ) : (
                  <IoIosArrowUp size={30} />
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } lg:hidden fixed inset-0 bg-[#240046] z-40 flex-col items-center justify-center gap-6 text-white`}
        >
          <button
            onClick={() => {
              navigate(`/leagues/`);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-[10px]
    text-2xl font-normal font-inter
    px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
     ${
       isActive("/league")
         ? "bg-[#3C096C] shadow-[0_0_15px_#9D4EDD] scale-105"
         : "hover:bg-[#350266]"
     }`}
          >
            <span>Ligler</span>
            {!isActive("/league") ? (
              <IoIosArrowDown size={30} />
            ) : (
              <IoIosArrowUp size={30} />
            )}
          </button>

          <button
            onClick={() => {
              navigate(`/teams/`);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-[10px]
    text-2xl font-normal font-inter
    px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
     ${
       isActive("/team")
         ? "bg-[#3C096C] shadow-[0_0_15px_#9D4EDD] scale-105"
         : "hover:bg-[#350266]"
     }`}
          >
            <span>Takımlar</span>
            {!isActive("/team") ? (
              <IoIosArrowDown size={30} />
            ) : (
              <IoIosArrowUp size={30} />
            )}
          </button>

          <button
            onClick={() => {
              navigate(`/players/`);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-[10px]
    text-2xl font-normal font-inter
    px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
     ${
       isActive("/player")
         ? "bg-[#3C096C] shadow-[0_0_15px_#9D4EDD] scale-105"
         : "hover:bg-[#350266]"
     }`}
          >
            <span>Oyuncular</span>
            {!isActive("/player") ? (
              <IoIosArrowDown size={30} />
            ) : (
              <IoIosArrowUp size={30} />
            )}
          </button>

          {currentUser && (
            <button
              onClick={() => {
                navigate(`/favorites/`);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-[10px]
    text-2xl font-normal font-inter
    px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
     ${
       isActive("/favorite")
         ? "bg-[#3C096C] shadow-[0_0_15px_#9D4EDD] scale-105"
         : "hover:bg-[#350266]"
     }`}
            >
              <span>Favoriler</span>
              {!isActive("/favorite") ? (
                <IoIosArrowDown size={30} />
              ) : (
                <IoIosArrowUp size={30} />
              )}
            </button>
          )}

          {!currentUser ? (
            <button
              onClick={() => {
                navigate(`/login`);
                setMobileMenuOpen(false);
              }}
              className="bg-gradient-to-r from-[#9D4EDD] to-[#E0AAFF] font-bold py-2 px-6 rounded-[24px] hover:scale-105 transition"
            >
              Giriş Yap
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/profile");
                  setMobileMenuOpen(false);
                }}
                className="w-[200px] text-center px-4 py-3 bg-white text-[#240046] rounded-xl hover:bg-gray-100 font-medium"
              >
                👤 Profil
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-[200px] text-center px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                🚪 Çıkış Yap
              </button>
            </>
          )}
        </div>

        {/* Desktop Login/Profile */}
        <div className="hidden lg:block">
          {!currentUser ? (
            <button
              onClick={() => {
                navigate(`/login`);
              }}
              className="bg-gradient-to-r from-[#9D4EDD] to-[#E0AAFF] font-bold py-2 px-4 xl:px-6 rounded-[24px] hover:scale-105 transition text-sm xl:text-base"
            >
              Giriş Yap
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <img
                src={photo}
                alt="profile"
                onClick={() => setOpenProfile(!openProfile)}
                className="w-[50px] h-[50px] xl:w-[70px] xl:h-[70px] rounded-full object-cover cursor-pointer border-2 border-purple-500"
              />

              {/* DROPDOWN */}
              {openProfile && (
                <div className="absolute right-0 mr-[-50px] mt-1 w-[180px] bg-white rounded-xl shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenProfile(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 font-medium"
                  >
                    👤 Profil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-100 text-red-600 font-medium"
                  >
                    🚪 Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
