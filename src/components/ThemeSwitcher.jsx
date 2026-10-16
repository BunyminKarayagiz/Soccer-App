import { useEffect, useRef, useState } from "react";
import { IoColorPaletteOutline } from "react-icons/io5";
import { THEMES, applyTheme, getSavedTheme } from "../theme/themes.js";

// Renk teması seçici: Navbar'daki palet düğmesi.
function ThemeSwitcher() {
  const [theme, setTheme] = useState(getSavedTheme);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Seçilen temayı sayfaya uygula
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Dışarı tıklayınca / Esc ile kapat
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Renk temasını değiştir"
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-full border border-line bg-surface-2 text-ink transition hover:bg-surface-3"
      >
        <IoColorPaletteOutline size={20} />
      </button>

      {open && (
        <div className="card absolute right-0 z-50 mt-2 w-56 p-2">
          <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted">
            Tema
          </p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition hover:bg-surface-2 ${
                theme === t.id ? "bg-surface-2 font-semibold" : ""
              }`}
            >
              <span
                className="size-6 rounded-full border border-line"
                style={{
                  background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)`,
                }}
              />
              {t.name}
              {theme === t.id && <span className="ml-auto text-accent">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
