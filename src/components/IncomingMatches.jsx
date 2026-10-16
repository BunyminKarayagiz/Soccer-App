import teamImg from "../assets/team.png";
import flagImg from "../assets/flag.png";
import stadImg from "../assets/stadium.png";
import refreeImg from "../assets/refree.png";
import FavButton from "./FavButton.jsx";

// NOT: Bu bölüm henüz örnek (sabit) veri gösteriyor. Gerçek yaklaşan maç verisi
// bağlandığında aşağıdaki liste API'den gelen veriyle değiştirilir; satır tasarımı aynı kalır.
// Yaklaşan maçlarda stadyum ve hakem bilgisi gösterilir (canlı maçlarda hakem gösterilmez).
const SAMPLE = [
  {
    id: 1,
    league: "League Name",
    date: "23.01.2026",
    time: "20:00",
    home: "Manchester United",
    away: "Team B",
    venue: "Rams Park",
    referee: "Team B",
  },
];

function IncomingMatches() {
  return (
    <div className="custom-scroll min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
      {SAMPLE.map((m) => (
        <section key={m.id}>
          <div className="mb-2 flex items-center gap-3 px-2 py-1.5">
            <img src={flagImg} alt="" className="size-6 object-contain" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted">{m.league}</h3>
          </div>

          <div className="row px-2 py-2.5 sm:px-3">
            <div className="grid grid-cols-[auto_4.5rem_minmax(0,1fr)] items-center gap-2 sm:gap-3">
              <FavButton active={false} onClick={() => {}} label="Maçı favorilere ekle" />
              <div className="tabular text-center text-xs font-semibold leading-tight">
                <p className="text-muted">{m.date}</p>
                <p className="text-base font-bold text-accent">{m.time}</p>
              </div>
              <div className="min-w-0 space-y-1.5">
                {[m.home, m.away].map((name, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-semibold">
                    <img src={teamImg} alt="" className="size-6 shrink-0 object-contain" />
                    <span className="truncate">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stadyum ve hakem */}
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-2.5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <img src={stadImg} alt="Stadyum" className="size-4 object-contain opacity-80" />
                {m.venue || "Belirtilmemiş"}
              </span>
              <span className="flex items-center gap-1.5">
                <img src={refreeImg} alt="Hakem" className="size-4 object-contain opacity-80" />
                {m.referee || "Belirtilmemiş"}
              </span>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default IncomingMatches;
