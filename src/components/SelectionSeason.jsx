import { useEffect, useRef, useState } from "react";
import { seasons } from "../datas/apiDatas.js";
import { IoCalendarOutline, IoChevronDown } from "react-icons/io5";

function SelectionSeason({ season, setSeason }) {
  const [isOpen, setIsOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const selectorRef = useRef(null);
  const current = seasons.find((value) => value === Number(season)) ?? season;

  const toggleOptions = () => {
    if (!isOpen && selectorRef.current) {
      const bounds = selectorRef.current.getBoundingClientRect();
      setOpensUpward(window.innerHeight - bounds.bottom < 340);
    }
    setIsOpen((open) => !open);
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!selectorRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative min-w-0" ref={selectorRef}>
      <button
        type="button"
        aria-label="Sezon seç"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggleOptions}
        className="flex min-w-0 items-center gap-2 rounded-xl border border-line bg-surface-2 p-1.5 pr-3 text-sm font-semibold shadow-sm transition hover:border-primary/50 hover:bg-surface-3"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
          <IoCalendarOutline size={18} aria-hidden="true" />
        </span>
        <span className="whitespace-nowrap">{current} - {Number(current) + 1}</span>
        <IoChevronDown
          className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Sezon seç"
          className={`custom-scroll overscroll-contain absolute left-0 z-50 max-h-80 w-52 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/40 ${
            opensUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted">
            Sezon seç
          </p>
          <div className="space-y-1">
            {[...seasons].reverse().map((value) => {
              const isSelected = value === Number(current);
              return (
                <button
                  key={value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setSeason(value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "border-accent/40 bg-surface-2 font-semibold text-ink ring-1 ring-accent/20"
                      : "border-transparent text-ink hover:bg-surface-2"
                  }`}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface-3 text-xs font-bold text-muted">
                    {String(value).slice(-2)}
                  </span>
                  <span className="flex-1">{value} - {value + 1}</span>
                  {isSelected && (
                    <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectionSeason;
