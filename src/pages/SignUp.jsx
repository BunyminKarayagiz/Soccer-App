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
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex mt-[-150px] w-[1000px] h-[600px] bg-[#5A189A] rounded-[12px] px-[30px]">
        {/* SOL */}
        <div className="flex flex-col gap-[120px] flex-1">
          <h1 className="mt-[50px] text-white font-semibold text-4xl">
            Kayıt Ol
          </h1>

          <div className="flex flex-col gap-[20px]">
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="w-[400px] h-[50px] bg-amber-50 rounded-[12px] px-4 text-lg font-medium"
              type="text"
              placeholder="Kullanıcı Adı"
            />

            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-[400px] h-[50px] bg-amber-50 rounded-[12px] px-4 text-lg font-medium"
              type="email"
              placeholder="Mail"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-[400px] h-[50px] bg-amber-50 rounded-[12px] px-4 text-lg font-medium"
              type="password"
              placeholder="Şifre"
            />

            <div className="flex items-center gap-[100px] text-white">
              <p className="font-medium">
                Hesabın varsa,{" "}
                <a onClick={()=>{navigate("/login")}} className="hover:text-blue-200">
                  Giriş Yap
                </a>
              </p>

              <button
                onClick={handleRegister}
                className="bg-gradient-to-r from-[#9D4EDD] to-[#E0AAFF] font-bold py-2 px-6 rounded-[24px] hover:scale-105 transition"
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>

        {/* AYRAÇ */}
        <div className="flex items-center px-8">
          <div className="w-[2px] h-[70%] bg-white/60 rounded-full"></div>
        </div>

        {/* SAĞ */}
        <div className="flex justify-center items-center flex-1">
          <img src={logo} alt="Logo" className="w-[400px] h-[400px]" />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
