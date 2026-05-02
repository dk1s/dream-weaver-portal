import { useState } from "react";
import { toast } from "sonner";

type Match = {
  league: string;
  status: "LIVE" | "UPCOMING";
  detail: string;
  teamA: string;
  teamB: string;
  contests: number;
  prize: string;
};

const matches: Match[] = [
  { league: "T20 World Cup", status: "LIVE", detail: "Q3 • 14.2 OV", teamA: "VAL", teamB: "IRN", contests: 124, prize: "$5M" },
  { league: "Premier League", status: "LIVE", detail: "84'", teamA: "MON", teamB: "COR", contests: 89, prize: "$2M" },
  { league: "NBA Playoffs", status: "UPCOMING", detail: "Starts in 2h", teamA: "APX", teamB: "CRD", contests: 64, prize: "$1.5M" },
  { league: "Pro Kabaddi", status: "UPCOMING", detail: "Starts in 5h", teamA: "TIT", teamB: "RGR", contests: 32, prize: "$500K" },
];

const filters = ["All", "Cricket", "Football", "Basketball", "Kabaddi"] as const;

const LiveMatches = () => {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  return (
    <section id="matches" className="py-24 px-4 md:px-8 bg-surface border-t border-border-dim">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
          <div>
            <h2 className="font-display text-5xl md:text-6xl text-foreground uppercase tracking-tight leading-none mb-2">
              Live & Upcoming
            </h2>
            <p className="text-muted-foreground font-medium">Pick a match. Build your XI. Win big.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
                  filter === f ? "bg-foreground text-background border-foreground" : "border-border-dim text-muted-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {matches.map((m, i) => (
            <div key={i} className="bg-panel border border-border-dim p-5 hover:border-primary/50 transition-all group flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m.league}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${m.status === "LIVE" ? "text-primary" : "text-accent"}`}>
                  <span className={`size-1.5 ${m.status === "LIVE" ? "bg-primary animate-pulse-glow" : "bg-accent"}`} />
                  {m.detail}
                </span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="font-display text-4xl text-foreground leading-none">{m.teamA}</div>
                <div className="text-muted-foreground font-display text-2xl">v</div>
                <div className="font-display text-4xl text-foreground leading-none">{m.teamB}</div>
              </div>
              <div className="border-t border-border-dim pt-4 flex justify-between items-center mt-auto">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Prize Pool</div>
                  <div className="font-display text-xl text-accent tabular-nums leading-none mt-1">{m.prize}</div>
                </div>
                <button
                  onClick={() => toast.success(`Joining ${m.teamA} vs ${m.teamB}`)}
                  className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-2 group-hover:shadow-fire transition-all"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveMatches;
