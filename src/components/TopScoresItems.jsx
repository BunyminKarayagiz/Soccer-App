import { useNavigate } from "react-router-dom";
import { DEFAULT_SEASON } from "../config.js";

// Gol krallığı tablosunun sütun düzeni (başlık satırı TopScores'ta aynısını kullanır).
// Mobilde takım sütunu gizlenir; takım adı oyuncunun altında küçük yazı olarak görünür.
export const SCORE_GRID =
  "grid grid-cols-[1.75rem_minmax(0,1fr)_2.5rem_2.5rem_2.5rem] sm:grid-cols-[2rem_minmax(8rem,1fr)_minmax(8rem,1fr)_3rem_3rem_3rem] items-center gap-x-2";

function TopScoresItems({ topScores, index }) {
  const navigate = useNavigate();
  const { player, team, stat } = topScores;

  return (
    <div className={`${SCORE_GRID} row mb-1.5 px-2 py-2 text-sm`}>
      <span
        className={`grid size-6 place-items-center rounded-md text-xs font-bold tabular ${
          index < 3 ? "bg-primary-soft text-accent" : "text-muted"
        }`}
      >
        {index + 1}
      </span>

      <button
        type="button"
        onClick={() => navigate(`/player/${player.id}`)}
        className="flex min-w-0 items-center gap-2 text-left"
      >
        <img src={player.photo} alt="" className="size-8 shrink-0 rounded-full bg-surface-3 object-cover" />
        <span className="min-w-0">
          <span className="block truncate font-medium">{player.name}</span>
          <span className="block truncate text-xs text-muted sm:hidden">{team.name}</span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => navigate(`/team/${team.id}/${DEFAULT_SEASON}`)}
        className="hidden min-w-0 items-center gap-2 text-left sm:flex"
      >
        <img src={team.logo} alt="" className="size-6 shrink-0 object-contain" />
        <span className="truncate text-muted">{team.name}</span>
      </button>

      <span className="tabular text-center text-muted">{stat.appearances}</span>
      <span className="tabular text-center text-base font-bold text-accent">{stat.goals}</span>
      <span className="tabular text-center">{stat.assists}</span>
    </div>
  );
}

export default TopScoresItems;
