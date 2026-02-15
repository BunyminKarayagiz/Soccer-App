import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { db, auth } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { uploadImageToCloudinary } from "../services/cloudinaryService.js";

function Profile() {
  const { currentUser } = useAuth();

  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();

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
      setLoading(false);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-[80px] bg-[#10002B] text-white">
      <div className="w-[600px] bg-[#240046] p-[40px] rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8">Profil Ayarları</h1>

        {/* FOTO */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <img
            src={
              photo instanceof File
                ? URL.createObjectURL(photo)
                : photo || "../assets/refree.png"
            }
            className="w-[120px] h-[120px] rounded-full object-cover border-4 border-purple-500"
          />

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* görünen buton */}
          <button
            onClick={() => fileRef.current.click()}
            className="border border-[#E0AAFF] hover:bg-[#7B2CBF] transition p-2 rounded-[12px] bg-[#5A189A]"
          >
            Fotoğraf Yükle
          </button>
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-sm text-gray-300">Email</label>
          <input
            disabled
            value={currentUser?.email}
            className="w-full mt-1 p-3 rounded-lg bg-[#3C096C] outline-none"
          />
        </div>

        {/* USERNAME */}
        <div className="mb-5">
          <label className="text-sm text-gray-300">Kullanıcı Adı</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-3 rounded-lg bg-[#3C096C] outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <label className="text-sm text-gray-300">Yeni Şifre</label>
          <input
            type="password"
            placeholder="Değiştirmek istemiyorsan boş bırak"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mt-1 p-3 rounded-lg bg-[#3C096C] outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-bold hover:scale-105 transition"
        >
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
