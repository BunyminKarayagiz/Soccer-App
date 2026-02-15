# ⚽ SoccerBall – Futbol Takip ve Favori Uygulaması

SoccerBall, kullanıcıların ligleri, takımları ve oyuncuları keşfedebileceği ve kendi favorilerini oluşturabileceği modern bir futbol web uygulamasıdır.
Proje React, Firebase ve Cloudinary kullanılarak modern full-stack mimari ile geliştirilmiştir.

---

## 🚀 Özellikler

### 🔐 Kullanıcı Giriş & Kayıt Sistemi

* Firebase Authentication ile kayıt ve giriş
* Benzersiz email ve kullanıcı adı yapısı
* Otomatik UID oluşturma
* Context API ile global auth yönetimi
* Oturum açık kalma (persistent login)
* Protected route sistemi (giriş yapmadan favorilere erişilemez)

---

### 👤 Profil Sistemi

* Profil fotoğrafı yükleme
* Fotoğraflar **Cloudinary** üzerinde tutulur
* Fotoğraf URL bilgisi **Firestore** içinde saklanır
* Varsayılan profil fotoğrafı (default pp)
* Kullanıcı adı değiştirme
* Şifre değiştirme
* Çıkış yap (logout) sistemi
* Navbar profil dropdown menüsü

---

### ⭐ Favoriler Sistemi (Altyapı Hazır)

Her kullanıcıya özel favori yapısı Firestore’da tutulur:

* Favori Takımlar
* Favori Ligler
* Favori Oyuncular
* Favori Maçlar

Favoriler kullanıcı UID’sine bağlı olarak saklanır.

---

### 🧭 Navbar & UI

* Giriş yapılmış / yapılmamış duruma göre navbar değişir
* Profil fotoğrafına tıklayınca dropdown açılır
* Profil & çıkış yap butonları
* Modern mor tema UI
* TailwindCSS ile responsive tasarım

---

## 🛠 Kullanılan Teknolojiler

### Frontend

* React (Vite)
* React Router DOM
* TailwindCSS
* Context API

### Backend / Servisler

* Firebase Authentication
* Firebase Firestore Database
* Firebase Security Rules
* Cloudinary (profil fotoğrafı)

---

## 📁 Proje Klasör Yapısı

```
src
│
├── assets/            → Görseller
├── components/        → Navbar, ProtectedRoute vb.
├── context/           → AuthContext (global auth state)
├── firebase/          → Firebase config
├── services/          → authService (register/login/logout)
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── Profile.jsx
│   ├── Favorites.jsx
│   ├── Teams.jsx
│   ├── League.jsx
│   └── Leagues.jsx
│
└── App.jsx
```

---

## 🔥 Firebase Firestore Veri Yapısı

### users (collection)

Her kullanıcı için document id = **uid**

```
users
 └── uid
      ├── uid: string
      ├── email: string
      ├── username: string
      ├── photoURL: string
      ├── createdAt: timestamp
      └── favorites:
           ├── teams: []
           ├── leagues: []
           ├── players: []
           └── matches: []
```

---

## ☁️ Cloudinary Kullanımı

Profil fotoğrafları:

1. Cloudinary'e upload edilir
2. URL alınır
3. Firestore users → photoURL içine kaydedilir
4. Navbar ve profil sayfasında gösterilir

Firebase Storage kullanılmamıştır.

---

## 🔐 .env (Gizli Anahtarlar)

`.env` dosyası oluştur:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

⚠️ Güvenlik için `.env` github'a gönderilmez.

---

## 🧪 Projeyi Çalıştırma

```
npm install
npm run dev
```

---

## 📌 Yakında Eklenecek Özellikler

* Favorilere takım/oyuncu/lig ekleme
* Favoriler sayfası geliştirme
* Maç detay sistemi
* Performans optimizasyonu
* Mobil responsive iyileştirme
* Cloudinary eski foto silme sistemi

---

## 👨‍💻 Geliştirici

**Bünyamin Karayağız**
Bilgisayar Mühendisi

Modern React + Firebase mimarisi öğrenme ve portföy geliştirme amacıyla yapılmıştır.
