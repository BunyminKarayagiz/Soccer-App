import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoMailOutline,
  IoPeopleOutline,
  IoRefreshOutline,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
  IoStarOutline,
  IoTrashOutline,
} from "react-icons/io5";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import defaultPp from "../assets/defaultPp.png";
import { useAuth } from "../context/AuthContext.jsx";

const FAVORITE_SECTIONS = [
  { key: "teams", label: "Takımlar", getName: (item) => item.name },
  {
    key: "leagues",
    label: "Ligler",
    getName: (item) => item.league_name || item.name,
  },
  { key: "players", label: "Oyuncular", getName: (item) => item.name },
  {
    key: "matches",
    label: "Maçlar",
    getName: (item) =>
      `${item.home_team?.name || "Ev sahibi"} - ${item.away_team?.name || "Deplasman"}`,
  },
];

function formatDate(value) {
  if (!value) return "Bilgi yok";
  if (typeof value?.toDate === "function") return formatDate(value.toDate());
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Bilgi yok"
    : date.toLocaleString("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function AdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [archivedEmails, setArchivedEmails] = useState([]);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [roleUpdatingUid, setRoleUpdatingUid] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "deletedUserProfiles")),
    ])
      .then(([snapshot, archiveSnapshot]) => {
        if (!active) return;
        setUsers(
          snapshot.docs.map((userDoc) => ({
            uid: userDoc.id,
            ...userDoc.data(),
            role: userDoc.data().role === "admin" ? "admin" : "user",
          })),
        );
        setArchivedEmails(
          archiveSnapshot.docs.map((emailDoc) => ({
            uid: emailDoc.id,
            ...emailDoc.data(),
          })),
        );
      })
      .catch((err) => {
        if (!active) return;
        console.error("Admin kullanıcıları alınamadı:", err);
        setError(
          err.code === "permission-denied"
            ? "Bu listeye erişim yetkiniz yok."
            : err.message || "Kullanıcılar yüklenirken bir hata oluştu.",
        );
        setUsers([]);
        setArchivedEmails([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const normalizedQuery = appliedQuery.toLocaleLowerCase("tr-TR");
  const filteredUsers = users
    .map((user) => {
      const fields = [user.email, user.username, user.uid].map((value) =>
        typeof value === "string" ? value.toLocaleLowerCase("tr-TR") : "",
      );
      if (!normalizedQuery || !fields.some((field) => field.includes(normalizedQuery))) {
        return normalizedQuery ? null : { user, score: 0 };
      }
      const score = fields.some((field) => field === normalizedQuery)
        ? 0
        : fields.some((field) => field.startsWith(normalizedQuery))
          ? 1
          : 2;
      return { user, score };
    })
    .filter(Boolean)
    .sort((first, second) => first.score - second.score)
    .map(({ user }) => user);
  const filteredArchivedEmails = archivedEmails.filter((entry) => {
    if (!normalizedQuery) return true;
    return [entry.email, entry.username, entry.uid].some(
      (value) =>
        typeof value === "string" &&
        value.toLocaleLowerCase("tr-TR").includes(normalizedQuery),
    );
  });
  const PAGE_SIZE = 50;
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const visibleUsers = filteredUsers.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE,
  );

  const handleSearch = (event) => {
    event.preventDefault();
    setPageIndex(0);
    setAppliedQuery(query.trim());
  };

  const handleClearSearch = () => {
    setQuery("");
    setPageIndex(0);
    setAppliedQuery("");
  };

  const verifiedCount = users.filter((user) => user.emailVerified === true).length;

  const handleRoleChange = async (user) => {
    const nextRole = user.role === "admin" ? "user" : "admin";
    if (
      nextRole === "admin" &&
      !window.confirm(`${user.email || user.uid} kullanıcısını admin yapmak istiyor musunuz?`)
    ) {
      return;
    }

    setRoleUpdatingUid(user.uid);
    setError("");
    setNotice("");
    try {
      await updateDoc(doc(db, "users", user.uid), { role: nextRole });
      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.uid === user.uid ? { ...item, role: nextRole } : item,
        ),
      );
      setNotice(
        nextRole === "admin"
          ? `${user.email || user.uid} admin yapıldı.`
          : `${user.email || user.uid} kullanıcı rolüne alındı.`,
      );
    } catch (err) {
      console.error("Kullanıcı rolü değiştirilemedi:", err);
      setError(err.message || "Kullanıcı rolü değiştirilemedi.");
    } finally {
      setRoleUpdatingUid("");
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.uid === currentUser?.uid) {
      setError("Kendi profilinizi bu sayfadan silemezsiniz.");
      return;
    }

    const confirmed = window.confirm(
      `${user.email || user.uid} kullanıcısının Firestore profilini ve favorilerini silmek istiyor musunuz? Firebase Authentication hesabı silinmez.`,
    );
    if (!confirmed) return;

    setRoleUpdatingUid(user.uid);
    setError("");
    setNotice("");
    try {
      const profileRef = doc(db, "users", user.uid);
      const archiveRef = doc(db, "deletedUserProfiles", user.uid);
      const batch = writeBatch(db);
      batch.set(archiveRef, {
        uid: user.uid,
        email: user.email || "",
        username: user.username || user.displayName || "",
        deletedAt: serverTimestamp(),
        deletedBy: currentUser.uid,
      });
      batch.delete(profileRef);
      await batch.commit();

      const archivedEntry = {
        uid: user.uid,
        email: user.email || "",
        username: user.username || user.displayName || "",
        deletedAt: new Date(),
        deletedBy: currentUser.uid,
      };
      setUsers((currentUsers) =>
        currentUsers.filter((item) => item.uid !== user.uid),
      );
      setArchivedEmails((currentEntries) => [
        archivedEntry,
        ...currentEntries.filter((item) => item.uid !== user.uid),
      ]);
      setNotice(
        `${user.email || user.uid} Firestore profili silindi. Firebase Authentication hesabı silinmedi; e-posta arşivde tutuluyor.`,
      );
    } catch (err) {
      console.error("Kullanıcı profili silinemedi:", err);
      setError(err.message || "Kullanıcı profili silinemedi.");
    } finally {
      setRoleUpdatingUid("");
    }
  };

  return (
    <div className="space-y-5">
      <header className="card relative overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <IoShieldCheckmarkOutline aria-hidden="true" />
              Yönetim paneli
            </div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Kullanıcılar
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
              Hesap bilgilerini, doğrulama durumlarını ve favori kayıtlarını görüntüleyin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              setRefreshKey((key) => key + 1);
            }}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface-2 px-4 text-sm font-semibold text-ink transition hover:bg-surface-3 disabled:opacity-60"
          >
            <IoRefreshOutline className={loading ? "animate-spin" : ""} aria-hidden="true" />
            Yenile
          </button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="card flex items-center gap-4 p-4">
          <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
            <IoPeopleOutline size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-2xl font-bold tabular">{users.length}</p>
            <p className="text-sm text-muted">
              {appliedQuery ? "Eşleşen hesap" : "Bu sayfadaki hesaplar"}
            </p>
          </div>
        </article>
        <article className="card flex items-center gap-4 p-4">
          <span className="grid size-11 place-items-center rounded-xl bg-win/10 text-win">
            <IoCheckmarkCircleOutline size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-2xl font-bold tabular">{verifiedCount}</p>
            <p className="text-sm text-muted">Doğrulanmış e-posta</p>
          </div>
        </article>
        <article className="card flex items-center gap-4 p-4">
          <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent">
            <IoStarOutline size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-2xl font-bold tabular">
              {users.reduce(
                (sum, user) =>
                  sum +
                  FAVORITE_SECTIONS.reduce(
                    (count, section) => count + (user.favorites?.[section.key]?.length || 0),
                    0,
                  ),
                0,
              )}
            </p>
            <p className="text-sm text-muted">Bu sayfadaki favoriler</p>
          </div>
        </article>
      </section>

      <section className="card p-4 sm:p-5">
        <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
          <label className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
            <IoSearchOutline className="shrink-0 text-muted" aria-hidden="true" />
            <input
              type="search"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="E-posta, kullanıcı adı veya UID ile ara"
              aria-label="E-posta, kullanıcı adı veya UID ile ara"
              className="auth-field min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </label>
          <button type="submit" className="btn-accent min-h-12 px-5">
            Ara
          </button>
          {appliedQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="min-h-12 rounded-xl border border-line px-4 font-semibold text-muted transition hover:bg-surface-2 hover:text-ink"
            >
              Aramayı temizle
            </button>
          )}
        </form>
        {appliedQuery && (
          <p className="mt-2 text-xs text-muted">
            E-posta, kullanıcı adı ve UID içinde aranıyor: {appliedQuery}
          </p>
        )}
      </section>

      {error && (
        <div role="alert" className="rounded-xl border border-lose/30 bg-lose/10 p-4 text-sm text-lose">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl border border-win/30 bg-win/10 p-4 text-sm text-win">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="card flex min-h-40 items-center justify-center gap-3 p-6 text-muted">
          <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Kullanıcılar yükleniyor...
        </div>
      ) : filteredUsers.length === 0 && !error ? (
        <div className="card flex min-h-40 flex-col items-center justify-center p-6 text-center">
          <IoMailOutline size={28} className="mb-2 text-muted" aria-hidden="true" />
          <p className="font-semibold">Kullanıcı bulunamadı</p>
          <p className="mt-1 text-sm text-muted">
            {appliedQuery ? "Farklı bir e-posta, kullanıcı adı veya UID deneyin." : "Henüz kullanıcı hesabı yok."}
          </p>
        </div>
      ) : (
        <section aria-label="Kullanıcı listesi" className="space-y-3">
          {visibleUsers.map((user) => {
            const favoriteCount = FAVORITE_SECTIONS.reduce(
              (count, section) => count + (user.favorites?.[section.key]?.length || 0),
              0,
            );

            return (
              <article key={user.uid} className="card min-w-0 overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
                  <img
                    src={user.photoURL || defaultPp}
                    alt=""
                    className="size-12 shrink-0 rounded-full border border-line bg-surface-2 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="min-w-0 break-words text-lg font-bold">
                        {user.displayName || user.username || "İsimsiz kullanıcı"}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.emailVerified === true
                            ? "bg-win/10 text-win"
                            : user.emailVerified === false
                              ? "bg-lose/10 text-lose"
                              : "bg-surface-3 text-muted"
                        }`}
                      >
                        {user.emailVerified === true ? (
                          <IoCheckmarkCircleOutline aria-hidden="true" />
                        ) : user.emailVerified === false ? (
                          <IoCloseCircleOutline aria-hidden="true" />
                        ) : null}
                        {user.emailVerified === true
                          ? "Doğrulanmış"
                          : user.emailVerified === false
                            ? "Doğrulanmamış"
                            : "Doğrulama bilgisi yok"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-primary/15 text-primary"
                            : "bg-surface-3 text-muted"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Kullanıcı"}
                      </span>
                      {currentUser?.uid !== user.uid && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRoleChange(user)}
                            disabled={
                              roleUpdatingUid === user.uid ||
                              (user.emailVerified !== true && user.role !== "admin")
                            }
                            title={
                              user.emailVerified !== true && user.role !== "admin"
                                ? "Admin yapmak için e-posta doğrulanmış olmalı."
                                : undefined
                            }
                            className={`min-h-8 rounded-lg border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.role === "admin"
                                ? "border-line text-muted hover:bg-surface-2 hover:text-ink"
                                : "border-primary/30 text-primary hover:bg-primary/10"
                            }`}
                          >
                            {roleUpdatingUid === user.uid
                              ? "Güncelleniyor..."
                              : user.role === "admin"
                                ? "Kullanıcı yap"
                                : "Admin yap"}
                          </button>
                          {user.emailVerified !== true && user.role !== "admin" && (
                            <span className="text-xs text-muted">
                              Admin yetkisi için e-posta doğrulanmalı.
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={roleUpdatingUid === user.uid}
                            className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-lose/30 px-3 text-xs font-semibold text-lose transition hover:bg-lose/10 disabled:cursor-wait disabled:opacity-50"
                          >
                            <IoTrashOutline aria-hidden="true" />
                            {roleUpdatingUid === user.uid
                              ? "İşleniyor..."
                              : "Profili sil"}
                          </button>
                        </>
                      )}
                    </div>
                    <p className="mt-1 break-all text-sm text-muted">{user.email || "E-posta yok"}</p>
                    <p className="mt-1 break-all font-mono text-xs text-muted/80">
                      UID: {user.uid}
                    </p>

                    <dl className="mt-4 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <dt className="text-xs text-muted">Hesap oluşturuldu</dt>
                        <dd className="mt-0.5 font-medium">{formatDate(user.createdAt)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Kullanıcı adı</dt>
                        <dd className="mt-0.5 font-medium">{user.username || "Belirtilmemiş"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Favoriler</dt>
                        <dd className="mt-0.5 font-medium">{favoriteCount} kayıt</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <details className="border-t border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold transition hover:bg-surface-2 sm:px-5">
                    <span>Favori detaylarını görüntüle</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                      {favoriteCount}
                    </span>
                  </summary>
                  <div className="grid gap-3 border-t border-line bg-bg/30 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
                    {FAVORITE_SECTIONS.map((section) => {
                      const items = user.favorites?.[section.key] || [];
                      return (
                        <section
                          key={section.key}
                          className="min-w-0 rounded-xl border border-line bg-surface p-3"
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <h3 className="text-sm font-bold">{section.label}</h3>
                            <span className="text-xs text-muted">{items.length}</span>
                          </div>
                          {items.length ? (
                            <ul className="custom-scroll max-h-48 space-y-1 overflow-y-auto pr-1">
                              {items.map((item, index) => (
                                <li
                                  key={`${item.id || item.fixture_id || section.key}-${index}`}
                                  className="truncate rounded-lg bg-surface-2 px-2.5 py-2 text-xs text-ink"
                                  title={section.getName(item) || "İsimsiz kayıt"}
                                >
                                  {section.getName(item) || "İsimsiz kayıt"}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="rounded-lg bg-surface-2 px-2.5 py-2 text-xs text-muted">
                              Favori yok
                            </p>
                          )}
                        </section>
                      );
                    })}
                  </div>
                </details>
              </article>
            );
          })}
        </section>
      )}

      {!loading && filteredUsers.length > PAGE_SIZE && (
        <nav aria-label="Kullanıcı sayfaları" className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Sayfa {pageIndex + 1} / {pageCount}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
              disabled={pageIndex === 0}
              className="min-h-10 rounded-xl border border-line px-4 text-sm font-semibold text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Önceki
            </button>
            <button
              type="button"
              onClick={() => setPageIndex((index) => Math.min(pageCount - 1, index + 1))}
              disabled={pageIndex >= pageCount - 1}
              className="min-h-10 rounded-xl border border-line px-4 text-sm font-semibold text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        </nav>
      )}

      <section className="card overflow-hidden">
        <div className="border-b border-line p-4 sm:p-5">
          <h2 className="text-lg font-bold sm:text-xl">Kayıtlı e-posta arşivi</h2>
          <p className="mt-1 text-sm text-muted">
            Silinen Firestore profillerinin e-posta adresleri burada saklanır.
            Auth hesabı silinmediği için bu adresler hâlâ Firebase Authentication’da kayıtlı olabilir.
          </p>
        </div>
        {filteredArchivedEmails.length ? (
          <ul className="divide-y divide-line">
            {filteredArchivedEmails.map((entry) => (
              <li
                key={entry.uid}
                className="flex min-w-0 flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <p className="break-all font-medium text-ink">
                    {entry.email || "E-posta kaydı yok"}
                  </p>
                  <p className="mt-1 break-all text-xs text-muted">
                    {entry.username || "Kullanıcı adı belirtilmemiş"} · UID: {entry.uid}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    Firestore profili silinmiş
                  </span>
                  <p className="mt-1 text-xs text-muted sm:text-right">
                    {formatDate(entry.deletedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-5 text-sm text-muted">
            {normalizedQuery
              ? "Aramayla eşleşen arşiv e-postası yok."
              : "Arşivde e-posta bulunmuyor."}
          </p>
        )}
      </section>
    </div>
  );
}

export default AdminUsers;
