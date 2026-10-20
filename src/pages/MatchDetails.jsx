import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoCalendarOutline,
  IoFootballOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoStatsChartOutline,
  IoTimeOutline,
} from "react-icons/io5";
import {
  fixtureDetailsApiData,
  fixtureDetailsData,
  xTeamFixtureData,
  xLiveMatchesData,
} from "../datas/apiDatas.js";

const TABS = [
  { id: "events", label: "Maç olayları", icon: <IoTimeOutline aria-hidden="true" /> },
  { id: "statistics", label: "İstatistikler", icon: <IoStatsChartOutline aria-hidden="true" /> },
  { id: "lineups", label: "Kadro", icon: <IoPeopleOutline aria-hidden="true" /> },
];

const EVENT_STYLES = {
  Goal: "bg-win/15 text-win",
  Card: "bg-accent/15 text-accent",
  subst: "bg-primary/15 text-primary",
  Var: "bg-live/15 text-live",
};

const POSITION_LABELS = {
  G: "Kaleciler",
  D: "Defans",
  M: "Orta saha",
  F: "Forvet",
};

const POSITION_ORDER = ["Kaleciler", "Defans", "Orta saha", "Forvet", "Diğer"];

function groupSubstitutes(substitutes = []) {
  const groups = new Map();

  substitutes.forEach(({ player }) => {
    const position = POSITION_LABELS[player.pos] || "Diğer";
    const players = groups.get(position) || [];
    players.push(player);
    groups.set(position, players);
  });

  return [...groups.entries()].sort(
    ([firstPosition], [secondPosition]) =>
      POSITION_ORDER.indexOf(firstPosition) - POSITION_ORDER.indexOf(secondPosition),
  );
}

function getEventIcon(event) {
  if (event.type === "Goal") return "⚽";
  if (event.type === "Card") return event.detail?.toLowerCase().includes("red") ? "🟥" : "🟨";
  if (event.type === "subst") return "↕";
  if (event.type === "Var") return "VAR";
  return "•";
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function EventTimeline({ events, homeTeam, awayTeam }) {
  if (!events?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-8 text-center">
        <IoFootballOutline className="mx-auto mb-3 size-8 text-muted" />
        <p className="font-semibold">Henüz maç olayı yok</p>
        <p className="mt-1 text-sm text-muted">
          Olaylar maç başladıktan sonra burada listelenir.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {events.map((event, index) => {
        const isHome = event.team?.id === homeTeam.id;
        const teamName = isHome ? homeTeam.name : awayTeam.name;
        const eventName =
          event.type === "subst"
            ? "Oyuncu değişikliği"
            : event.detail || event.type;
        return (
          <li
            key={`${event.time?.elapsed}-${event.type}-${index}`}
            className={`flex items-center gap-3 ${isHome ? "" : "flex-row-reverse"}`}
          >
            <div className={`flex min-w-0 flex-1 ${isHome ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-sm rounded-2xl border border-line bg-surface p-3 ${isHome ? "text-right" : ""}`}>
                <p className="truncate text-xs font-semibold text-muted">{teamName}</p>
                <p className="mt-1 font-bold">{eventName}</p>
                {event.player?.name && (
                  <p className="mt-1 truncate text-xs text-muted">{event.player.name}</p>
                )}
                {event.assist?.name && (
                  <p className="truncate text-xs text-muted">Asist: {event.assist.name}</p>
                )}
                {event.comments && event.comments !== "Örnek olay" && (
                  <p className="mt-1 text-xs text-muted">{event.comments}</p>
                )}
              </div>
            </div>
            <div className="z-10 flex shrink-0 flex-col items-center">
              <span
                className={`grid size-9 place-items-center rounded-full ${EVENT_STYLES[event.type] || "bg-surface-2 text-ink"}`}
                aria-label={eventName}
              >
                {getEventIcon(event)}
              </span>
              <span className="mt-1 tabular text-xs font-bold text-muted">
                {event.time?.elapsed ?? "—"}'
              </span>
            </div>
            <div className="min-w-0 flex-1" />
          </li>
        );
      })}
    </ol>
  );
}

function StatisticsPanel({ statistics, homeTeam, awayTeam }) {
  if (!statistics?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-8 text-center">
        <IoStatsChartOutline className="mx-auto mb-3 size-8 text-muted" />
        <p className="font-semibold">İstatistikler henüz hazır değil</p>
        <p className="mt-1 text-sm text-muted">
          Maç başladıktan sonra istatistikler burada görüntülenir.
        </p>
      </div>
    );
  }

  const homeStats = statistics.find((team) => team.team.id === homeTeam.id)?.statistics || [];
  const awayStats = statistics.find((team) => team.team.id === awayTeam.id)?.statistics || [];
  const awayByType = new Map(awayStats.map((stat) => [stat.type, stat.value]));
  const metrics = homeStats.map((stat) => ({
    type: stat.type,
    home: stat.value,
    away: awayByType.get(stat.type),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2 text-xs font-bold sm:text-sm">
        <span className="truncate text-left">{homeTeam.name}</span>
        <span className="text-muted">KARŞILAŞTIRMA</span>
        <span className="truncate text-right">{awayTeam.name}</span>
      </div>
      {metrics.map((metric) => {
        const homeNumber = Number.parseFloat(String(metric.home ?? "").replace("%", ""));
        const awayNumber = Number.parseFloat(String(metric.away ?? "").replace("%", ""));
        const total = (Number.isFinite(homeNumber) ? homeNumber : 0) +
          (Number.isFinite(awayNumber) ? awayNumber : 0);
        const homeWidth = total > 0 ? (homeNumber / total) * 100 : 50;
        const awayWidth = total > 0 ? (awayNumber / total) * 100 : 50;

        return (
          <div key={metric.type} className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <span className="tabular text-left text-sm font-bold text-primary">
                {formatValue(metric.home)}
              </span>
              <h3 className="text-center text-xs font-semibold text-muted sm:text-sm">
                {metric.type}
              </h3>
              <span className="tabular text-right text-sm font-bold text-accent">
                {formatValue(metric.away)}
              </span>
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-surface-3">
              <div className="h-full rounded-l-full bg-primary transition-[width] duration-700" style={{ width: `${homeWidth}%` }} />
              <div className="h-full rounded-r-full bg-accent transition-[width] duration-700" style={{ width: `${awayWidth}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function parseGrid(player, index) {
  const match = /^(\d+):(\d+)$/.exec(player.grid || "");
  if (match) {
    return { line: Number(match[1]), column: Number(match[2]) };
  }

  const fallbackLines = { G: 1, D: 2, M: 3, F: 4 };
  return { line: fallbackLines[player.pos] || 3, column: index + 1 };
}

function isHexColor(value) {
  return typeof value === "string" && /^[\da-f]{6}$/i.test(value);
}

function LineupsField({ lineups }) {
  const [home, away] = lineups;
  const teams = [home, away].filter(Boolean);
  const mappedPlayers = teams.map((lineup, teamIndex) => {
    const players = (lineup.startXI || []).map(({ player }, index) => ({
      ...player,
      ...parseGrid(player, index),
    }));
    const maxLine = Math.max(1, ...players.map((player) => player.line));
    const playersByLine = new Map();
    players.forEach((player) => {
      const playersInLine = playersByLine.get(player.line) || [];
      playersInLine.push(player);
      playersByLine.set(player.line, playersInLine);
    });

    return {
      lineup,
      teamIndex,
      players: players.map((player) => {
        const lineProgress = maxLine === 1 ? 0 : (player.line - 1) / (maxLine - 1);
        const playersInLine = playersByLine.get(player.line) || [];
        const orderedLine = [...playersInLine].sort(
          (first, second) => first.column - second.column,
        );
        const verticalSpread = { G: 0, D: 68, M: 42, F: 64 }[player.pos] ?? 56;
        const linePosition = orderedLine.findIndex((item) => item.id === player.id);
        const columnProgress = orderedLine.length <= 1
          ? 0.5
          : linePosition / (orderedLine.length - 1);
        const y =
          50 + (columnProgress - 0.5) * verticalSpread;
        const x = teamIndex === 0
          ? 7 + lineProgress * 37
          : 93 - lineProgress * 37;
        const colors = lineup.team.colors;
        const kit = player.pos === "G" ? colors?.goalkeeper : colors?.player;

        return {
          ...player,
          x,
          y,
          shirtColor: isHexColor(kit?.primary) ? `#${kit.primary}` : "#ffffff",
          numberColor: isHexColor(kit?.number) ? `#${kit.number}` : "#111827",
          borderColor: isHexColor(kit?.border) ? `#${kit.border}` : "#ffffff",
        };
      }),
    };
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {mappedPlayers.map(({ lineup, teamIndex }) => (
          <div
            key={lineup.team.id}
            className={`flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3 ${
              teamIndex === 1 ? "sm:flex-row-reverse sm:text-right" : ""
            }`}
          >
            <div className={`flex min-w-0 items-center gap-2 ${teamIndex === 1 ? "sm:flex-row-reverse" : ""}`}>
              {lineup.team.logo && (
                <img src={lineup.team.logo} alt="" className="size-8 shrink-0 object-contain" />
              )}
              <div className="min-w-0">
                <h3 className="truncate font-bold">{lineup.team.name}</h3>
                <p className="truncate text-xs text-muted">
                  {lineup.coach?.name || "Teknik direktör belirtilmedi"}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              {lineup.formation || "Diziliş yok"}
            </span>
          </div>
        ))}
      </div>

      <div className="lineup-field relative isolate mx-auto aspect-[0.68/1] min-h-[28rem] w-full max-w-md overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-emerald-800 to-emerald-950 shadow-inner sm:mx-0 sm:aspect-[2/1] sm:min-h-0 sm:max-w-none">
        <svg
          aria-hidden="true"
          viewBox="0 0 68 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full sm:hidden"
        >
          <g
            fill="none"
            stroke="white"
            strokeOpacity="0.48"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          >
            <rect x="2" y="2" width="64" height="96" rx="1" />
            <path d="M2 50h64M14 2v17h40V2M22 2v7h24V2M14 98V81h40v17M22 98v-7h24v7" />
            <circle cx="34" cy="50" r="9.15" />
          </g>
          <g fill="white" fillOpacity="0.55">
            <circle cx="34" cy="50" r="0.45" />
          </g>
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden size-full sm:block"
        >
          <g
            fill="none"
            stroke="white"
            strokeOpacity="0.48"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          >
            <rect x="1.5" y="1.5" width="97" height="47" rx="1" />
            <path d="M50 1.5v47M1.5 12.5h17v25h-17M1.5 18.5h7v13h-7M98.5 12.5h-17v25h17M98.5 18.5h-7v13h7" />
            <circle cx="50" cy="25" r="8.5" />
          </g>
          <circle cx="50" cy="25" r="0.45" fill="white" fillOpacity="0.55" />
        </svg>

        {mappedPlayers.flatMap(({ lineup, players }) =>
          players.map((player) => (
            <div
              key={`${lineup.team.id}-${player.id}`}
              className="lineup-player absolute z-10 flex w-[20%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 text-center sm:w-[10%]"
              style={{
                "--player-x": `${player.x}%`,
                "--player-y": `${player.y}%`,
                "--portrait-x": `${player.y}%`,
                "--portrait-y": `${100 - player.x}%`,
              }}
              title={`${player.number ?? ""} ${player.name}`}
            >
              <span
                className="grid size-7 place-items-center rounded-full border-2 text-[10px] font-extrabold shadow-md sm:size-9 sm:text-xs"
                style={{
                  backgroundColor: player.shirtColor,
                  color: player.numberColor,
                  borderColor: player.borderColor,
                }}
              >
                {player.number ?? "•"}
              </span>
              <span className="max-w-full rounded bg-black/60 px-1 text-[8px] font-semibold leading-tight text-white [overflow-wrap:anywhere] sm:text-[10px]">
                {player.name}
              </span>
            </div>
          )),
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {teams.map((lineup) => {
          const substituteGroups = groupSubstitutes(lineup.substitutes);

          return (
            <section
              key={lineup.team.id}
              className="min-w-0 rounded-2xl border border-line bg-surface p-3"
            >
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted">
                {lineup.team.name} · Yedekler
              </h4>
              {substituteGroups.length ? (
                <div className="mt-3 space-y-3">
                  {substituteGroups.map(([position, players]) => (
                    <div key={position}>
                      <h5 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {position}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {players.map((player) => (
                          <span
                            key={player.id}
                            className="rounded-lg bg-surface-2 px-2 py-1 text-xs"
                          >
                            {player.number} · {player.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted">Yedek listesi yok.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MatchDetails() {
  const { fixtureId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("events");
  const fixture = fixtureDetailsData[fixtureId];
  const savedApiData = fixtureDetailsApiData[fixtureId];
  const liveMatch =
    Object.values(xLiveMatchesData)
      .flatMap((group) => group.matches)
      .find((item) => String(item.fixture_id) === fixtureId);
  const teamFixture = xTeamFixtureData.find(
    (item) => String(item.fixture.id) === fixtureId,
  );
  const match =
    location.state?.match ||
    liveMatch ||
    (teamFixture && {
      fixture_id: teamFixture.fixture.id,
      fixture: teamFixture.fixture,
      league: {
        league_id: teamFixture.league.id,
        league_name: teamFixture.league.name,
        league_logo: teamFixture.league.logo,
      },
      date: teamFixture.fixture.date,
      referee: teamFixture.fixture.referee,
      venue: teamFixture.fixture.venue?.name,
      home_team: { ...teamFixture.teams.home, goal: teamFixture.goals.home },
      away_team: { ...teamFixture.teams.away, goal: teamFixture.goals.away },
    });
  const homeTeam = fixture?.teams.home || match?.home_team;
  const awayTeam = fixture?.teams.away || match?.away_team;

  if (!homeTeam || !awayTeam) {
    return (
      <section className="card mx-auto max-w-3xl p-8 text-center">
        <p className="font-semibold">Maç bilgisi bulunamadı.</p>
        <button type="button" onClick={() => navigate(-1)} className="btn-primary mt-4">
          Geri dön
        </button>
      </section>
    );
  }

  const status = fixture?.fixture.status || match?.fixture?.status || match?.status;
  const statusLabel =
    status?.long ||
    (match?.elapsed != null ? "Canlı maç" : "Başlama saati bekleniyor");
  const homeScore = fixture?.goals.home ?? match?.home_team?.goal;
  const awayScore = fixture?.goals.away ?? match?.away_team?.goal;
  const hasScore = homeScore != null && awayScore != null;
  const events = savedApiData ? savedApiData.events || [] : fixture?.events || [];
  const statistics = savedApiData
    ? savedApiData.statistics || []
    : fixture?.statistics || [];
  const rawLineups = savedApiData ? savedApiData.lineups || [] : fixture?.lineups || [];
  const lineups = [homeTeam, awayTeam]
    .map((team) => rawLineups.find((lineup) => lineup.team?.id === team.id))
    .filter(Boolean);
  const kickoffDate = match?.date || fixture?.fixture.date;
  const kickoffLabel = kickoffDate
    ? kickoffDate.includes("T")
      ? new Date(kickoffDate).toLocaleString("tr-TR", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : `${kickoffDate} ${match?.time || ""}`.trim()
    : null;

  return (
    <main className="mx-auto max-w-6xl space-y-5 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink"
      >
        <IoArrowBackOutline aria-hidden="true" />
        Maçlara dön
      </button>

      <section className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="relative">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(fixture?.league.logo || match?.league?.league_logo) && (
                <img
                  src={fixture?.league.logo || match.league.league_logo}
                  alt=""
                  className="size-6 object-contain"
                />
              )}
              <span className="text-sm font-semibold text-muted">
                {fixture?.league.name ||
                  match?.league?.league_name ||
                  match?.league?.name ||
                  "Karşılaşma"}
                {fixture?.league.country ? ` · ${fixture.league.country}` : ""}
              </span>
            </div>
            <span className="rounded-full border border-line bg-bg/50 px-3 py-1 text-xs font-bold text-primary">
              Sabit örnek veri
            </span>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-6">
            {[homeTeam, awayTeam].map((team, index) => (
              <div key={team.id} className={`flex min-w-0 flex-col items-center gap-2 text-center ${index === 1 ? "col-start-3" : ""}`}>
                {team.logo ? (
                  <img src={team.logo} alt="" className="size-14 object-contain sm:size-20" />
                ) : (
                  <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 font-display text-xl font-bold text-primary sm:size-20 sm:text-2xl">
                    {team.name.slice(0, 1)}
                  </span>
                )}
                <h1 className="max-w-full break-words text-sm font-extrabold sm:text-xl">{team.name}</h1>
              </div>
            ))}
            <div className="col-start-2 row-start-1 flex flex-col items-center">
              <span className="font-display text-3xl font-extrabold tabular sm:text-5xl">
                {hasScore
                  ? `${homeScore} - ${awayScore}`
                  : "VS"}
              </span>
              <span className={`mt-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${status?.short === "2H" ? "bg-live/15 text-live" : "bg-surface-2 text-muted"}`}>
                {status?.elapsed ? `${status.elapsed}' · ` : ""}
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-muted">
            {(fixture?.fixture.venue?.name || match?.venue) && (
              <span className="inline-flex items-center gap-1.5">
                <IoLocationOutline aria-hidden="true" />
                {fixture?.fixture.venue?.name || match.venue}
              </span>
            )}
            {fixture?.fixture.venue?.city && <span>{fixture.fixture.venue.city}</span>}
            {(fixture?.fixture.referee || match?.referee) && (
              <span>Hakem: {fixture?.fixture.referee || match.referee}</span>
            )}
            {kickoffLabel && (
              <span className="inline-flex items-center gap-1.5">
                <IoCalendarOutline aria-hidden="true" />
                {kickoffLabel}
              </span>
            )}
          </div>
        </div>
      </section>

      <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-xs leading-relaxed text-muted">
        {savedApiData
          ? "Bu maçın başarılı API yanıtları önceden çekilerek sabit veriye kaydedilmiştir. API'de henüz bulunmayan bilgiler boş görünebilir."
          : "Bu maç için kaydedilmiş API detay verisi yok. Örnek veriler varsa yalnızca arayüz gösterimi içindir."}
      </p>

      <section className="card min-w-0 overflow-hidden">
        <div
          role="tablist"
          aria-label="Maç detay bölümleri"
          className="grid grid-cols-3 gap-1 border-b border-line p-2 sm:flex sm:overflow-x-auto sm:p-3"
        >
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-label={label}
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold leading-tight transition sm:shrink-0 sm:flex-row sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                activeTab === id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {icon}
              <span className="truncate">{id === "events" ? "Olaylar" : id === "statistics" ? "İstatistik" : "Kadro"}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" className="min-w-0 p-3 sm:p-5">
          {activeTab === "events" && (
            <EventTimeline events={events} homeTeam={homeTeam} awayTeam={awayTeam} />
          )}
          {activeTab === "statistics" && (
            <StatisticsPanel statistics={statistics} homeTeam={homeTeam} awayTeam={awayTeam} />
          )}
          {activeTab === "lineups" && (
            lineups.length ? (
              <LineupsField lineups={lineups} />
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-8 text-center">
                <IoPeopleOutline className="mx-auto mb-3 size-8 text-muted" />
                <p className="font-semibold">Kadrolar henüz açıklanmadı</p>
                <p className="mt-1 text-sm text-muted">
                  Kadro verileri maçtan önce yayınlandığında burada gösterilir.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}

export default MatchDetails;
