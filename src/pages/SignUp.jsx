import React, { useState } from "react";
import logo from "../assets/soccerBallSingLogo.png";
import { registerUser } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert("Tüm alanları doldur");
      return;
    }

    const result = await registerUser(email, password, username);

    if (result.success) {
      alert("Kayıt başarılı 🔥");
      navigate("/"); // ana sayfa
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row mt-0 md:mt-[-150px] w-full max-w-[1000px] md:h-[600px] bg-[#5A189A] rounded-[12px] px-4 sm:px-6 md:px-[30px] py-8 md:py-0">
        {/* SOL */}
        <div className="flex flex-col gap-8 md:gap-[120px] flex-1">
          <h1 className="mt-4 md:mt-[50px] text-white font-semibold text-2xl sm:text-3xl md:text-4xl text-center md:text-left">
            Kayıt Ol
          </h1>

          <div className="flex flex-col gap-4 md:gap-[20px]">
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="w-full md:w-[400px] h-[45px] md:h-[50px] bg-amber-50 rounded-[12px] px-4 text-base md:text-lg font-medium focus:outline-[#C77DFF]"
              type="text"
              placeholder="Kullanıcı Adı"
            />

            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-[400px] h-[45px] md:h-[50px] bg-amber-50 rounded-[12px] px-4 text-base md:text-lg font-medium focus:outline-[#C77DFF]"
              type="email"
              placeholder="Mail"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full md:w-[400px] h-[45px] md:h-[50px] bg-amber-50 rounded-[12px] px-4 text-base md:text-lg font-medium focus:outline-[#C77DFF]"
              type="password"
              placeholder="Şifre"
            />

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[100px] text-white">
              <p className="font-medium text-sm md:text-base text-center md:text-left">
                Hesabın varsa,{" "}
                <a onClick={()=>{navigate("/login")}} className="hover:text-blue-200 cursor-pointer">
                  Giriş Yap
                </a>
              </p>

              <button
                onClick={handleRegister}
                className="bg-gradient-to-r from-[#9D4EDD] to-[#E0AAFF] font-bold py-2 px-6 rounded-[24px] hover:scale-105 transition w-full md:w-auto text-sm md:text-base"
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>

        {/* AYRAÇ - Desktop Only */}
        <div className="hidden md:flex items-center px-8">
          <div className="w-[2px] h-[70%] bg-white/60 rounded-full"></div>
        </div>

        {/* SAĞ */}
        <div className="hidden md:flex justify-center items-center flex-1">
          <img src={logo} alt="Logo" className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] object-contain" />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
