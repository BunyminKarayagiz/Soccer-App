import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoArrowForward,
  IoLockClosedOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import logo from "../assets/soccerBallSingLogo.png";
import { registerUser } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

function SignUp() {
  const navigate = useNavigate();
  const { syncCurrentUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await registerUser(email, password, username);
      if (result.success) {
        await syncCurrentUser();
        navigate("/verify-email", {
          state: {
            emailSent: result.emailSent,
            message: result.warning || "",
          },
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center py-6 sm:py-10">
      <div className="card grid w-full max-w-5xl overflow-hidden lg:min-h-[38rem] lg:grid-cols-[1fr_0.9fr]">
        <section className="flex min-w-0 flex-col justify-center p-5 sm:p-8 lg:p-12">
          <div className="mb-7">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Takıma katıl
            </p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Hesap oluştur
            </h1>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Favorilerini kaydet, futbol gündemini takip et.
            </p>
          </div>

          <form onSubmit={handleRegister} className="w-full space-y-4">
            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-semibold">Kullanıcı adı</span>
              <span className="flex h-12 items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
                <IoPersonOutline className="shrink-0 text-muted" size={19} aria-hidden="true" />
                <input
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Kullanıcı adını gir"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="auth-field h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
              </span>
            </label>

            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-semibold">E-posta</span>
              <span className="flex h-12 items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
                <IoMailOutline className="shrink-0 text-muted" size={19} aria-hidden="true" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="auth-field h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
              </span>
            </label>

            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-semibold">Şifre</span>
              <span className="flex h-12 items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
                <IoLockClosedOutline className="shrink-0 text-muted" size={19} aria-hidden="true" />
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="auth-field h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-xl border border-lose/30 bg-lose/10 px-4 py-3 text-sm text-lose">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent min-h-12 w-full justify-between px-5 disabled:cursor-wait disabled:opacity-60"
            >
              <span>{loading ? "Hesap oluşturuluyor..." : "Hesap oluştur"}</span>
              {!loading && <IoArrowForward size={19} aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted sm:text-left">
            Zaten hesabın var mı?{" "}
            <Link to="/login" className="font-semibold text-accent hover:underline">
              Giriş yap
            </Link>
          </p>
        </section>

        <aside className="relative hidden min-w-0 flex-col items-center justify-center overflow-hidden border-l border-line bg-gradient-to-br from-primary/20 via-surface to-surface-2 p-8 text-center lg:flex">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-accent/10 blur-3xl" />
          <img src={logo} alt="" className="relative mb-6 size-64 max-w-full object-contain drop-shadow-2xl" />
          <h2 className="relative font-display text-2xl font-bold">Futbol topluluğuna katıl.</h2>
          <p className="relative mt-2 max-w-xs text-sm leading-relaxed text-muted">
            Favori liglerini, takımlarını ve oyuncularını takip etmek için hesabını oluştur.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default SignUp;
