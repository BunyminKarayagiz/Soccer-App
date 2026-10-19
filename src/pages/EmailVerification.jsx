import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ensureUserProfile,
  logoutUser,
  resendVerificationEmail,
} from "../services/authService.js";
import { auth } from "../firebase/firebase.js";

function EmailVerification() {
  const { currentUser, emailVerified, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(
    location.state?.message
      ? { type: "error", text: location.state.message }
      : location.state?.emailSent
        ? { type: "success", text: "Doğrulama e-postası gönderildi." }
        : null,
  );

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleResend = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      await resendVerificationEmail(currentUser);
      setFeedback({
        type: "success",
        text: "Yeni bir doğrulama bağlantısı e-posta adresinize gönderildi.",
      });
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const verified = await refreshUser();
      if (!verified) {
        setFeedback({
          type: "error",
          text: "Henüz doğrulama görünmüyor. E-postadaki bağlantıya tıklayıp tekrar deneyin.",
        });
        return;
      }

      await ensureUserProfile(auth.currentUser);
      navigate("/", { replace: true });
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center py-6 sm:py-10">
      <section className="card w-full max-w-xl p-5 text-center sm:p-9">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary">
          <IoMailOutline size={28} aria-hidden="true" />
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Hesap güvenliği
        </p>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          E-posta adresini doğrula
        </h1>
        <p className="mt-3 break-all text-sm text-muted sm:text-base">
          {emailVerified
            ? "E-posta adresiniz doğrulandı. Hesabınızı kullanmaya devam edebilirsiniz."
            : `Doğrulama bağlantısını ${currentUser.email} adresine gönderdik. E-postadaki bağlantıya tıkladıktan sonra bu sayfaya dönüp doğrulamayı tamamlayın. Gelen kutunuzu ve spam klasörünü kontrol edin.`}
        </p>

        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === "error"
                ? "border-lose/30 bg-lose/10 text-lose"
                : "border-win/30 bg-win/10 text-win"
            }`}
          >
            {feedback.text}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {emailVerified ? (
            <button
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="btn-accent min-h-12 px-4 disabled:cursor-wait disabled:opacity-60 sm:col-span-2"
            >
              {loading ? "Kontrol ediliyor..." : "Uygulamaya devam et"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleContinue}
                disabled={loading}
                className="btn-accent min-h-12 px-4 disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Kontrol ediliyor..." : "Doğrulamayı tamamladım"}
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="min-h-12 rounded-full border border-line px-4 font-semibold text-ink transition hover:bg-surface-2 disabled:cursor-wait disabled:opacity-60"
              >
                Doğrulama e-postasını yeniden gönder
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="mt-5 text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline disabled:opacity-60"
        >
          Farklı hesapla giriş yap
        </button>
      </section>
    </div>
  );
}

export default EmailVerification;
