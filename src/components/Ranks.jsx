import { useNavigate } from "react-router-dom";
import FormDisplay from "./FormDisplay.jsx";
import { DEFAULT_SEASON } from "../config.js";

// Puan durumu tablosunun sütun düzeni. Başlık satırı (LeagueInfo) ile satırlar AYNI düzeni kullanır.
// Mobilde: sıra | takım | puan | form
// Geniş ekranda (sm+): sıra | takım | O | G | B | M | AV | puan | form
export const RANK_GRID =
  "grid grid-cols-[1.75rem_minmax(0,1fr)_2.5rem_5.5rem] sm:grid-cols-[2rem_minmax(8rem,1fr)_repeat(4,2.5rem)_2.75rem_3rem_7.5rem] items-center gap-x-2";

// İlk 3 sıra rozeti vurgulanır
const rankBadge = (rank) =>
  rank <= 3 ? "bg-primary-soft text-accent" : "text-muted";

function Ranks({ teams }) {
  const navigate = useNavigate();
  const t = teams.teams;

  return (
    <div className={`${RANK_GRID} row mb-1.5 px-2 py-2 text-sm`}>
      <span
        className={`grid size-6 place-items-center rounded-md text-xs font-bold tabular ${rankBadge(t.rank)}`}
      >
        {t.rank}
      </span>

      <button
        type="button"
        onClick={() => navigate(`/team/${t.id}/${DEFAULT_SEASON}`)}
        className="flex min-w-0 items-center gap-2 text-left"
      >
        <img src={t.logo} alt="" className="size-6 shrink-0 object-contain" />
        <span className="truncate font-medium">{t.name}</span>
      </button>

      <span className="tabular hidden text-center text-muted sm:block">{t.played}</span>
      <span className="tabular hidden text-center sm:block">{t.win}</span>
      <span className="tabular hidden text-center sm:block">{t.draw}</span>
      <span className="tabular hidden text-center sm:block">{t.lose}</span>
      <span className="tabular hidden text-center text-muted sm:block">{t.goalsdiff}</span>

      <span className="tabular text-center text-base font-bold text-accent">{t.points}</span>
      <FormDisplay form={t.form} />
    </div>
  );
}

export default Ranks;
