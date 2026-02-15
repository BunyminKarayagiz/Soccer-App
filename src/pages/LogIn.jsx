import React, { useState } from "react";
import logo from "../assets/soccerBallSingLogo.png";
import { loginUser } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

function LogIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const result = await loginUser(email, password);

    if (result.success) {
      navigate("/"); // login sonrası home
    } else {
      setError(result.error);
    }

    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex mt-[-150px] w-[1000px] h-[600px] bg-[#5A189A] rounded-[12px] px-[30px]">
        {/* SOL */}
        <div className="flex flex-col gap-[120px] flex-1">
          <h1 className="mt-[50px] text-white font-semibold text-4xl">
            Giriş Yapın
          </h1>

          <div className="flex flex-col gap-[20px]">
            <input
              className="w-[400px] h-[50px] bg-amber-50 rounded-[12px] px-4 text-lg font-medium focus:outline-[#C77DFF]"
              type="email"
              placeholder="Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-[400px] h-[50px] bg-amber-50 rounded-[12px] px-4 text-lg font-medium focus:outline-[#C77DFF]"
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center gap-[100px] text-white">
              <p className="font-medium">
                Hesabınız yok mu?{" "}
                <a href="/signup" className="hover:text-blue-200">
                  Kayıt Ol!
                </a>
              </p>
              {error && <p className="text-red-300 font-medium">{error}</p>}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-gradient-to-r from-[#9D4EDD] to-[#E0AAFF] font-bold py-2 px-4 rounded-[24px] hover:from-[#7B2CBF] hover:to-[#9D4EDD] hover:scale-105 hover:shadow-xl transition duration-300"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
          </div>
        </div>

        {/* AYRAÇ */}
        <div className="flex items-center px-8">
          <div className="w-[2px] h-[70%] bg-white/60 rounded-full"></div>
        </div>

        {/* SAĞ LOGO */}
        <div className="flex justify-center items-center flex-1">
          <img
            src={logo}
            alt="Logo"
            className="w-[400px] h-[400px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default LogIn;
