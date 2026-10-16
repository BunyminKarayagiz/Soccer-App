import { useEffect, useRef, useState } from "react";
import { topLeagues } from "../datas/apiDatas.js";
import { IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { DEFAULT_SEASON } from "../config.js";

function LeagueSelection({ selectedLeague, setLeague }) {
  const [isOpen, setIsOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const selectorRef = useRef(null);
  const navigate = useNavigate();
  const current =
    topLeagues.find((l) => l.id === Number(selectedLeague)) || topLeagues[0];

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
      <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-line bg-surface-2 p-1 shadow-sm transition hover:border-primary/50">
        <button
          type="button"
          onClick={() => navigate(`/league/${current?.id}/${DEFAULT_SEASON}`)}
          aria-label={`${current?.name} lig sayfasına git`}
          title="Lig sayfasına git"
          className="grid size-9 shrink-0 place-items-center rounded-lg transition hover:bg-surface-3"
        >
          <span className="grid size-7 place-items-center rounded-md border border-black/5 bg-white p-0.5 shadow-sm">
            <img src={current?.logo} alt="" className="size-full object-contain" />
          </span>
        </button>
        <button
          type="button"
          aria-label="Lig seç"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={toggleOptions}
          className="flex min-w-0 items-center gap-2 rounded-lg py-2 pl-1 pr-2 text-sm font-semibold transition hover:bg-surface-3"
        >
          <span className="max-w-32 truncate sm:max-w-44">{current?.name}</span>
          <IoChevronDown
            className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-label="Lig seç"
          className={`custom-scroll overscroll-contain absolute left-0 z-50 max-h-80 w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/40 ${
            opensUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted">
            Lig seç
          </p>
          <div className="space-y-1">
            {topLeagues.map((league) => {
              const isSelected = league.id === current?.id;
              return (
                <button
                  key={league.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setLeague(league.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "border border-accent/40 bg-surface-2 font-semibold text-ink ring-1 ring-accent/20"
                      : "border border-transparent text-ink hover:bg-surface-2"
                  }`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-black/5 bg-white p-1 shadow-sm">
                    <img
                      src={league.logo}
                      alt=""
                      className="size-full object-contain"
                    />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{league.name}</span>
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

export default LeagueSelection;
