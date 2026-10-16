import {
  IoHomeOutline,
  IoHome,
  IoTrophyOutline,
  IoTrophy,
  IoShieldOutline,
  IoShield,
  IoPersonOutline,
  IoPerson,
  IoStarOutline,
  IoStar,
} from "react-icons/io5";

// Menü öğelerinin TEK kaynağı: üst menü (masaüstü) ve alt sekme çubuğu (mobil) bunu kullanır.
// - to:        tıklanınca gidilecek adres
// - match:     adres bu ile başlıyorsa öğe "aktif" sayılır (exact: true ise tam eşleşme)
// - authOnly:  true ise sadece giriş yapmış kullanıcıya gösterilir
export const NAV_ITEMS = [
  { to: "/", label: "Ana Sayfa", match: "/", exact: true, Icon: IoHomeOutline, ActiveIcon: IoHome },
  { to: "/leagues", label: "Ligler", match: "/league", Icon: IoTrophyOutline, ActiveIcon: IoTrophy },
  { to: "/teams", label: "Takımlar", match: "/team", Icon: IoShieldOutline, ActiveIcon: IoShield },
  { to: "/players", label: "Oyuncular", match: "/player", Icon: IoPersonOutline, ActiveIcon: IoPerson },
  { to: "/favorites", label: "Favoriler", match: "/favorite", authOnly: true, Icon: IoStarOutline, ActiveIcon: IoStar },
];

export function isNavActive(item, pathname) {
  return item.exact ? pathname === item.match : pathname.startsWith(item.match);
}
