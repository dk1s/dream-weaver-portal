import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { usePortal } from "@/lib/portalStore";
import { matches } from "@/lib/matchData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, Trophy } from "lucide-react";

const ContestsHub = () => {
  const { contests } = usePortal();
  const nav = useNavigate();
  const [tab, setTab] = useState<"UPCOMING" | "LIVE">("UPCOMING");

  const filtered = matches.filter((m) => m.status === tab);
  const joinedCount = (matchLabel: string) =>
    contests.filter((c) => c.match === matchLabel).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <div className="text-[10px] uppercase tracking-widest text-accent">Cricket</div>
          <h1 className="font-display text-5xl md:text-6xl uppercase mt-1">Matches</h1>
          <p className="text-muted-foreground mt-2">
            Pick a match → choose a contest → create your team → join.
          </p>
        </div>

        <div className="flex border border-border-dim mb-8 max-w-md">
          {(["UPCOMING", "LIVE"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 font-bold uppercase tracking-wider text-xs ${
                tab === t ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              {t} ({matches.filter((m) => m.status === t).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="border border-border-dim p-16 text-center text-muted-foreground">
            No {tab.toLowerCase()} matches.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => {
              const label = `${m.teamA} vs ${m.teamB}`;
              const joined = joinedCount(label);
              const myContests = contests.filter((c) => c.match === label);
              return (
                <div key={m.id} className="bg-panel border border-border-dim p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {m.league}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                        m.status === "LIVE" ? "text-primary" : "text-accent"
                      }`}
                    >
                      <span
                        className={`size-1.5 ${
                          m.status === "LIVE" ? "bg-primary animate-pulse-glow" : "bg-accent"
                        }`}
                      />
                      {m.detail}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-5">
                    <div className="font-display text-4xl leading-none">{m.teamA}</div>
                    <div className="text-muted-foreground font-display text-2xl">v</div>
                    <div className="font-display text-4xl leading-none">{m.teamB}</div>
                  </div>

                  <div className="border-t border-border-dim pt-4 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Prize Pool</div>
                      <div className="font-display text-xl text-accent tabular-nums leading-none mt-1">
                        {m.prize}
                      </div>
                    </div>
                    <button
                      onClick={() => nav(`/contests?match=${m.id}`)}
                      className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-2"
                    >
                      {m.status === "UPCOMING" ? "Join Contest →" : "View Contests →"}
                    </button>
                  </div>

                  {joined > 0 && (
                    <div className="mt-4 border-t border-border-dim pt-3">
                      <div className="text-[10px] uppercase tracking-widest text-accent mb-2 flex items-center gap-1.5">
                        <Trophy className="w-3 h-3" /> Joined {joined} contest{joined > 1 ? "s" : ""}
                      </div>
                      <div className="space-y-1.5">
                        {myContests.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => nav(`/contest/${c.id}`)}
                            className="w-full flex justify-between items-center text-xs border border-border-dim hover:border-accent px-3 py-2 transition-colors"
                          >
                            <span className="font-bold truncate">{c.contestName}</span>
                            <span className="flex items-center gap-1 text-accent">
                              <Eye className="w-3 h-3" /> Watch
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ContestsHub;
