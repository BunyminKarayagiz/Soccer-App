import { useState } from "react";
import {
  IoChevronDownOutline,
  IoFootballOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { getFixturePrediction } from "../services/apiServices.js";

const COMPARISON_METRICS = [
  ["form", "Form"],
  ["att", "Hücum"],
  ["def", "Savunma"],
  ["poisson", "Poisson"],
  ["h2h", "İkili rekabet"],
];

function percentage(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.min(100, parsed));
}

function ProbabilityCard({ label, value, color, textColor }) {
  const amount = percentage(value);
  if (amount === null) return null;

  return (
    <div className="min-w-0 rounded-2xl border border-line bg-surface p-2.5 sm:p-4">
      <p className="break-words text-[11px] font-semibold uppercase leading-snug tracking-wide text-muted [overflow-wrap:anywhere] sm:text-xs">
        {label}
      </p>
      <p className={`mt-1.5 tabular text-2xl font-extrabold leading-none sm:mt-2 sm:text-3xl ${textColor}`}>
        {value}
      </p>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3 sm:mt-4 sm:h-2"
        role="img"
        aria-label={`${label}: ${value}`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${color}`}
          style={{ width: `${amount}%` }}
        />
      </div>
    </div>
  );
}

function ComparisonChart({ comparison, homeName, awayName }) {
  if (!comparison) return null;

  const metrics = COMPARISON_METRICS.flatMap(([key, label]) => {
    const home = percentage(comparison[key]?.home);
    const away = percentage(comparison[key]?.away);
    return home === null && away === null
      ? []
      : [{ key, label, home: home ?? 0, away: away ?? 0 }];
  });

  if (!metrics.length) return null;

  const center = 150;
  const radius = 88;
  const labelRadius = 126;
  const metricAngle = (index) =>
    (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
  const point = (index, value) => {
    const angle = metricAngle(index);
    const distance = (radius * value) / 100;
    return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
  };
  const polygon = (key) =>
    metrics.map((metric, index) => point(index, metric[key])).join(" ");

  return (
    <section className="rounded-2xl border border-line bg-bg/35 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold">Takım karşılaştırması</h4>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            {homeName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" />
            {awayName}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="mx-auto w-full max-w-md">
          <svg
            viewBox="0 0 300 300"
            role="img"
            aria-label={`Radar karşılaştırması (${metrics.map((metric) => metric.label).join(", ")}): ${homeName} ve ${awayName}`}
            className="w-full"
          >
            {[25, 50, 75, 100].map((level) => (
              <polygon
                key={level}
                points={metrics
                  .map((_, index) => point(index, level))
                  .join(" ")}
                fill="none"
                stroke="var(--c-border)"
                strokeWidth="1"
              />
            ))}
            {metrics.map((metric, index) => {
              const angle = metricAngle(index);
              const x = center + Math.cos(angle) * radius;
              const y = center + Math.sin(angle) * radius;
              return (
                <line
                  key={metric.key}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="var(--c-border)"
                  strokeWidth="1"
                />
              );
            })}
            {metrics.map((metric, index) => {
              const angle = metricAngle(index);
              const x = center + Math.cos(angle) * labelRadius;
              const y = center + Math.sin(angle) * labelRadius;
              return (
                <text
                  key={metric.key}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--c-muted)"
                  fontSize="10"
                  fontWeight="600"
                >
                  {metric.label}
                </text>
              );
            })}
            <polygon
              points={polygon("home")}
              fill="var(--c-primary)"
              fillOpacity="0.22"
              stroke="var(--c-primary)"
              strokeWidth="2"
              className="prediction-polygon"
            />
            <polygon
              points={polygon("away")}
              fill="var(--c-accent)"
              fillOpacity="0.18"
              stroke="var(--c-accent)"
              strokeWidth="2"
              className="prediction-polygon prediction-polygon-delay"
            />
          </svg>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.key}
              className="min-w-0 space-y-2 rounded-xl border border-line bg-surface p-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
                <span className="font-semibold text-muted">{metric.label}</span>
                <span className="tabular font-bold text-ink">
                  <span className="text-primary">{metric.home}%</span>
                  <span className="px-1.5 text-muted">/</span>
                  <span className="text-accent">{metric.away}%</span>
                </span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-l-full bg-primary transition-[width] duration-700"
                  style={{
                    width: `${metric.home + metric.away ? (metric.home / (metric.home + metric.away)) * 100 : 50}%`,
                  }}
                />
                <div
                  className="h-full rounded-r-full bg-accent transition-[width] duration-700"
                  style={{
                    width: `${metric.home + metric.away ? (metric.away / (metric.home + metric.away)) * 100 : 50}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MatchPrediction({ fixtureId, homeName, awayName }) {
  const [open, setOpen] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);
    if (prediction || loading || error) return;

    setLoading(true);
    setError("");
    try {
      const result = await getFixturePrediction(fixtureId);
      setPrediction(result.data);
    } catch (requestError) {
      console.error("Maç tahmini alınamadı:", requestError);
      setError(requestError.message || "Tahmin verisi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const probabilities = prediction?.predictions?.percent || {};
  const hasPercentages = ["home", "draw", "away"].some(
    (key) => probabilities[key] != null,
  );

  return (
    <div className="col-span-full min-w-0 border-t border-line/70 pt-2">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className="group flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="inline-flex items-center gap-1.5">
          <IoSparklesOutline aria-hidden="true" />
          Maç tahminini {open ? "gizle" : "göster"}
          <span className="font-normal text-muted">
            (sabit demo verisi)
          </span>
        </span>
        <IoChevronDownOutline
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="prediction-panel mt-2 space-y-4 overflow-hidden rounded-2xl border border-line bg-surface p-3 sm:p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-8 text-sm text-muted">
              <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Tahmin verisi alınıyor...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-xl border border-lose/25 bg-lose/10 p-3 text-sm text-lose"
            >
              {error}
            </div>
          ) : prediction ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                    <IoFootballOutline aria-hidden="true" />
                    Karşılaşma analizi
                  </div>
                  <h3 className="text-sm font-bold text-ink sm:text-base">
                    {homeName || "Ev sahibi"}{" "}
                    <span className="text-muted">-</span>{" "}
                    {awayName || "Deplasman"}
                  </h3>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  Sabit örnek veri
                </span>
              </div>

              {hasPercentages && (
                <section className="rounded-2xl border border-line bg-bg/35 p-3 sm:p-4">
                  <div className="mb-3">
                    <h4 className="text-sm font-bold sm:text-base">Maç sonucu olasılıkları</h4>
                    <p className="mt-1 text-[11px] text-muted">
                      Ev sahibi · Beraberlik · Deplasman
                    </p>
                  </div>
                  <div className="grid min-w-0 grid-row-1 gap-2 lg:grid-row-3 sm:gap-3">
                    <ProbabilityCard
                      label={homeName || "Ev sahibi"}
                      value={probabilities.home}
                      color="bg-primary"
                      textColor="text-primary"
                    />
                    <ProbabilityCard
                      label="Beraberlik"
                      value={probabilities.draw}
                      color="bg-muted"
                      textColor="text-muted"
                    />
                    <ProbabilityCard
                      label={awayName || "Deplasman"}
                      value={probabilities.away}
                      color="bg-accent"
                      textColor="text-accent"
                    />
                  </div>
                </section>
              )}

              <ComparisonChart
                comparison={prediction.comparison}
                homeName={homeName || "Ev sahibi"}
                awayName={awayName || "Deplasman"}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                {prediction.predictions?.winner?.name && (
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Öne çıkan takım
                    </p>
                    <p className="mt-1 font-bold text-primary">
                      {prediction.predictions.winner.name}
                    </p>
                    {prediction.predictions.winner.comment && (
                      <p className="mt-1 text-xs text-muted">
                        {prediction.predictions.winner.comment}
                      </p>
                    )}
                  </div>
                )}
                {(prediction.predictions?.advice ||
                  prediction.predictions?.under_over ||
                  prediction.predictions?.goals?.home ||
                  prediction.predictions?.goals?.away) && (
                  <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Tahmin önerisi
                    </p>
                    {prediction.predictions.advice && (
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {prediction.predictions.advice}
                      </p>
                    )}
                    {prediction.predictions.under_over && (
                      <p className="mt-1 text-xs text-muted">
                        Alt / üst: {prediction.predictions.under_over}
                      </p>
                    )}
                    {prediction.predictions.goals && (
                      <p className="mt-1 text-xs text-muted">
                        Beklenen goller:{" "}
                        {prediction.predictions.goals.home || "—"} -{" "}
                        {prediction.predictions.goals.away || "—"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {!hasPercentages &&
                !prediction.comparison &&
                !prediction.predictions?.advice &&
                !prediction.predictions?.winner?.name && (
                  <p className="rounded-xl bg-surface-2 p-3 text-sm text-muted">
                    API bu karşılaşma için gösterilebilir tahmin veya karşılaştırma
                    verisi döndürmedi.
                  </p>
                )}

              <p className="text-[11px] leading-relaxed text-muted">
                Bu grafikler geliştirme aşamasındaki sabit örnek değerlerdir,
                gerçek maç tahmini değildir.
              </p>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default MatchPrediction;
