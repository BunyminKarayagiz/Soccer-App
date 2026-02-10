import React, { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultPp from "../assets/defaultPp.png";

import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [photo, setPhoto] = useState(defaultPp);
  const { currentUser, logoutUser } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  console.log(photo)
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
    <div className="h-[140px] bg-[#240046]">
      <div className="h-[140px] px-[83px] py-[42px] flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-4xl cursor-pointer"
          onClick={() => {
            navigate(`/`);
          }}
        >
          <span className="text-white">Soccer</span>
          <span className="text-[#E1FF00] font-bold">Ball</span>
        </h1>

        {/* Menu */}
        <div className="flex items-center text-white">
          <button
            onClick={() => {
              navigate(`/leagues/`);
            }}
            className="
    flex items-center gap-[10px]
    text-[25px] font-normal font-inter
    px-4 py-2
    rounded-[12px]
    transition-colors duration-200
    hover:bg-[#350266]
  "
          >
            <span>Ligler</span>
            <IoMdArrowDropdown size={30} />
          </button>

          <span className="mx-6 h-8 w-[2px] bg-white/70" />

          <button
            onClick={() => {
              navigate(`/teams/`);
            }}
            className="
  flex items-center gap-[10px]
  text-[25px] font-normal font-inter
  px-4 py-2
  rounded-[12px]
  transition-colors duration-200
  hover:bg-[#350266]
"
          >
            <span>Takımlar</span>
            <IoMdArrowDropdown size={30} />
          </button>

          <span className="mx-6 h-8 w-[2px] bg-white/70" />

          <button
            className="
  flex items-center gap-[10px]
  text-[25px] font-normal font-inter
  px-4 py-2
  rounded-[12px]
  transition-colors duration-200
  hover:bg-[#350266]
"
          >
            <span>Oyuncular</span>
            <IoMdArrowDropdown size={30} />
          </button>

          {!currentUser ? (
            <></>
          ) : (
            <>
              <span className="mx-6 h-8 w-[2px] bg-white/70" />
              <button
                onClick={() => {
                  navigate(`/favorites/`);
                }}
                className="
  flex items-center gap-[10px]
  text-[25px] font-normal font-inter
  px-4 py-2
  rounded-[12px]
  transition-colors duration-200
  hover:bg-[#350266]
"
              >
                <span>Favoriler</span>
                <IoMdArrowDropdown size={30} />
              </button>
            </>
          )}
        </div>

        {!currentUser ? (
          <button
            onClick={() => {
              navigate(`/login`);
            }}
            className="bg-gradient-to-r from-[#9D4EDD] to-[#E0AAFF] font-bold py-2 px-6 rounded-[24px] hover:scale-105 transition"
          >
            Giriş Yap
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <img
              src={photo}
              alt="profile"
              onClick={() => setOpenProfile(!openProfile)}
              className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-purple-500"
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
  );
}

export default Navbar;
