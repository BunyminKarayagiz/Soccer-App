import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { db, auth } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { uploadImageToCloudinary } from "../services/cloudinaryService.js";
import { IoCameraOutline, IoLockClosedOutline, IoMailOutline, IoPersonOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import defaultPp from "../assets/defaultPp.png";

function Profile() {
  const { currentUser } = useAuth();

  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(defaultPp);

  const fileRef = useRef();

  useEffect(() => {
    if (!(photo instanceof File)) {
      setPhotoPreview(photo || defaultPp);
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
  };
  // 🔥 user info çek
  useEffect(() => {
    const fetchUser = async () => {
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username);
        setPhoto(data.photoURL || "");
      }
    };

    if (currentUser) fetchUser();
  }, [currentUser]);

  // 🔥 CLOUDINARY UPLOAD

  // 🔥 KAYDET
  const handleSave = async () => {
    try {
      setLoading(true);

      let photoURL = photo;

      // yeni foto varsa yükle
      if (photo instanceof File) {
        photoURL = await uploadImageToCloudinary(photo);
      }

      // firestore update
      const ref = doc(db, "users", currentUser.uid);
      await updateDoc(ref, {
        username,
        photoURL,
      });

      // şifre değiştir
      if (newPassword.length >= 6) {
        await updatePassword(auth.currentUser, newPassword);
      }

      alert("Profil güncellendi 🔥");
      setNewPassword("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-4 text-ink sm:py-8">
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Hesabım
        </p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Profil ayarları</h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Hesap bilgilerini ve profil fotoğrafını buradan güncelleyebilirsin.
        </p>
      </div>

      <div className="card grid min-w-0 overflow-hidden lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.4fr)]">
        <aside className="relative flex flex-col items-center justify-center overflow-hidden border-b border-line bg-gradient-to-br from-primary/25 via-surface to-surface-2 p-6 text-center sm:p-8 lg:border-b-0 lg:border-r">
          <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <div className="rounded-full bg-gradient-to-br from-accent to-primary p-1 shadow-xl shadow-primary/20">
              <img
                src={photoPreview}
                alt="Profil fotoğrafı"
                className="size-28 rounded-full border-4 border-surface object-cover sm:size-36"
              />
            </div>
            <span className="absolute bottom-1 right-1 grid size-9 place-items-center rounded-full border-4 border-surface bg-accent text-on-accent">
              <IoShieldCheckmarkOutline size={17} aria-hidden="true" />
            </span>
          </div>
          <h2 className="relative mt-5 max-w-full truncate text-xl font-bold sm:text-2xl">
            {username || "Kullanıcı"}
          </h2>
          <p className="relative mt-1 max-w-full truncate text-sm text-muted">
            {currentUser?.email}
          </p>

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Profil fotoğrafı dosyası"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm font-semibold transition hover:border-primary/60 hover:bg-surface-3"
          >
            <IoCameraOutline size={18} aria-hidden="true" />
            Fotoğrafı değiştir
          </button>
          <p className="relative mt-2 text-xs text-muted">JPG, PNG veya WEBP</p>
        </aside>

        <form
          className="min-w-0 p-5 sm:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-6 border-b border-line pb-4">
            <h2 className="text-lg font-bold sm:text-xl">Hesap bilgileri</h2>
            <p className="mt-1 text-sm text-muted">
              E-posta adresin doğrulama bilgisi olarak kullanılır.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <IoMailOutline className="text-muted" aria-hidden="true" />
                E-posta adresi
              </span>
              <input
                type="email"
                disabled
                value={currentUser?.email || ""}
                className="h-12 w-full min-w-0 rounded-xl border border-line bg-surface-2/60 px-4 text-sm text-muted opacity-80"
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <IoPersonOutline className="text-muted" aria-hidden="true" />
                Kullanıcı adı
              </span>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 w-full min-w-0 rounded-xl border border-line bg-surface-2 px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/25"
                placeholder="Kullanıcı adını gir"
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <IoLockClosedOutline className="text-muted" aria-hidden="true" />
                Yeni şifre
              </span>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Değiştirmeyeceksen boş bırak"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 w-full min-w-0 rounded-xl border border-line bg-surface-2 px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/25"
              />
              <span className="mt-2 block text-xs text-muted">
                Şifre değişikliği için en az 6 karakter gir.
              </span>
            </label>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-accent min-h-11 w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
