import { useState } from "react";
import LiveMatches from "./LiveMatches.jsx";
import IncomingMatches from "./IncomingMatches.jsx";

const TABS = [
  { id: "live", label: "Canlı" },
  { id: "incoming", label: "Yaklaşan" },
];

// Maçlar kartı: "Canlı" ve "Yaklaşan" sekmeleri. Aktif sekme neon renkle belirginleşir.
function Matches() {
  const [matchesType, setMatchesType] = useState("live");

  return (
    <section className="card flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
        <h2 className="font-display text-xl font-bold sm:text-2xl">Maçlar</h2>
        <div role="tablist" aria-label="Maç türü" className="flex gap-1 rounded-full bg-surface-2 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={matchesType === tab.id}
              onClick={() => setMatchesType(tab.id)}
              className="chip"
            >
              {tab.id === "live" && (
                <span className="size-2 animate-pulse rounded-full bg-live" aria-hidden="true" />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {matchesType === "live" ? <LiveMatches /> : <IncomingMatches />}
    </section>
  );
}

export default Matches;
