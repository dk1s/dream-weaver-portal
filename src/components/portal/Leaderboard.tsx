import { useState } from "react";
import { Trophy } from "lucide-react";

const allPlayers = [
  { name: "NeonStrikers99", points: 892.5, win: "$1,000,000" },
  { name: "PitchInvader", points: 884.0, win: "$250,000" },
  { name: "ApexPredator", points: 879.5, win: "$100,000" },
  { name: "FantasyKing07", points: 871.2, win: "$50,000" },
  { name: "DraftMaster", points: 866.8, win: "$25,000" },
  { name: "BoundaryBoss", points: 861.4, win: "$10,000" },
  { name: "SixerKing", points: 855.9, win: "$5,000" },
  { name: "WicketWiz", points: 849.3, win: "$2,500" },
];

const tabs = ["Today", "This Week", "All Time"] as const;

const Leaderboard = () => {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Today");

  return (
    <section id="leaderboard" className="py-24 px-4 md:px-8 bg-surface border-t border-border-dim">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Trophy className="w-10 h-10 text-accent mx-auto mb-4" />
          <h2 className="font-display text-5xl md:text-6xl text-foreground uppercase tracking-tight leading-none mb-4">
            Current Leaders
          </h2>
          <div className="inline-flex bg-panel border border-border-dim">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-panel border border-border-dim">
          <div className="grid grid-cols-[60px_1fr_120px] gap-4 p-4 border-b border-border-dim bg-background/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <div className="text-center">Rank</div>
            <div>Team</div>
            <div className="text-right">Points</div>
          </div>
          {allPlayers.map((p, i) => (
            <div
              key={p.name}
              className={`grid grid-cols-[60px_1fr_120px] gap-4 p-4 border-b border-border-dim items-center transition-colors hover:bg-background/40 ${
                i === 0 ? "bg-accent/5" : ""
              }`}
            >
              <div className={`text-center font-display text-3xl tabular-nums leading-none ${i === 0 ? "text-accent" : "text-muted-foreground"}`}>
                {(i + 1).toString().padStart(2, "0")}
              </div>
              <div className="flex items-center gap-4 min-w-0">
                <div className={`size-10 bg-background border ${i === 0 ? "border-accent/50" : "border-border-dim"} flex items-center justify-center font-display text-lg text-foreground shrink-0`}>
                  {p.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-foreground font-bold tracking-wide uppercase truncate">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">Projected: {p.win}</div>
                </div>
              </div>
              <div className="text-right font-display text-2xl text-foreground tabular-nums leading-none">{p.points.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
