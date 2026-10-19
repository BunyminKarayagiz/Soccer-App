import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { NAV_ITEMS, isNavActive } from "../layout/navItems.js";

// Mobil (lg altı) için ekranın altına sabitlenen sekme çubuğu.
// Başparmakla erişilen yerde olduğu için mobilde hamburger menüden daha kullanışlı.
function MobileTabBar() {
  const { currentUser, emailVerified, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const items = NAV_ITEMS.filter(
    (item) =>
      (!item.authOnly || (currentUser && emailVerified)) &&
      (!item.adminOnly || isAdmin),
  );

  return (
    <nav
      aria-label="Alt menü"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-around px-2">
        {items.map((item) => {
          const active = isNavActive(item, pathname);
          const Icon = active ? item.ActiveIcon : item.Icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition ${
                  active ? "text-accent" : "text-muted hover:text-ink"
                }`}
              >
                <Icon size={22} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileTabBar;
