import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { useEffect, useState } from "react";
import { usePortal } from "@/lib/portalStore";

type Ball = { over: number; ball: number; runs: number; event?: string };

const LiveScore = () => {
  const { contests } = usePortal();
  const [score, setScore] = useState({ runs: 142, wickets: 4, overs: 14.2, target: 178 });
  const [recent, setRecent] = useState<Ball[]>([
    { over: 14, ball: 2, runs: 4 },
    { over: 14, ball: 1, runs: 1 },
    { over: 13, ball: 6, runs: 0, event: "W" },
    { over: 13, ball: 5, runs: 6 },
    { over: 13, ball: 4, runs: 2 },
  ]);

  // Simulate live updates
  useEffect(() => {
    const id = setInterval(() => {
      const outcomes = [0, 1, 1, 2, 4, 6, "W"] as const;
      const r = outcomes[Math.floor(Math.random() * outcomes.length)];
      const isW = r === "W";
      const runs = isW ? 0 : (r as number);
      setScore((s) => {
        const totalBalls = Math.round(s.overs * 10) + 1;
        const overs = Math.floor(totalBalls / 10) + (totalBalls % 10) / 10;
        return {
          runs: s.runs + runs,
          wickets: Math.min(10, s.wickets + (isW ? 1 : 0)),
          overs,
          target: s.target,
        };
      });
      setRecent((p) => [{ over: Math.floor(score.overs), ball: ((Math.round(score.overs * 10) % 10) % 6) + 1, runs, event: isW ? "W" : undefined }, ...p].slice(0, 12));
    }, 3500);
    return () => clearInterval(id);
  }, [score.overs]);

  const need = score.target - score.runs;
  const ballsLeft = (20 - score.overs) * 6;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="size-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-primary font-bold">Live</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">T20 World Cup • 2nd Innings</span>
        </div>
        <h1 className="font-display text-6xl uppercase">VAL vs IRN</h1>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-panel to-surface border border-border-dim p-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Iran (chasing)</div>
                <div className="font-display text-7xl tabular-nums leading-none mt-2">
                  {score.runs}<span className="text-muted-foreground text-4xl">/{score.wickets}</span>
                </div>
                <div className="text-accent font-display text-3xl tabular-nums">{score.overs.toFixed(1)} ov</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Target</div>
                <div className="font-display text-5xl text-primary">{score.target}</div>
              </div>
            </div>
            <div className="border-t border-border-dim pt-4 grid grid-cols-3 text-center">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Need</div>
                <div className="font-display text-3xl text-accent">{need}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Balls Left</div>
                <div className="font-display text-3xl">{ballsLeft.toFixed(0)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">RRR</div>
                <div className="font-display text-3xl">{(need / (ballsLeft / 6)).toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Recent Balls</div>
              <div className="flex gap-2 flex-wrap">
                {recent.map((b, i) => (
                  <div
                    key={i}
                    className={`size-10 flex items-center justify-center font-bold text-sm border ${
                      b.event === "W"
                        ? "bg-primary text-primary-foreground border-primary"
                        : b.runs >= 4
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-border-dim"
                    }`}
                  >
                    {b.event ?? b.runs}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-panel border border-border-dim p-6">
            <h3 className="font-display text-3xl uppercase mb-4">My Position</h3>
            {contests.length === 0 ? (
              <div className="text-muted-foreground text-sm">Join a contest to track rank here.</div>
            ) : (
              <div className="space-y-4">
                {contests.map((c) => (
                  <div key={c.id} className="border border-border-dim p-4">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.contestName}</div>
                    <div className="font-display text-2xl mt-1">{c.teamName}</div>
                    <div className="flex justify-between mt-3">
                      <div>
                        <div className="text-[10px] uppercase text-muted-foreground">Rank</div>
                        <div className="font-display text-3xl text-accent">#{c.rank}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase text-muted-foreground">Points</div>
                        <div className="font-display text-3xl">{c.points.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LiveScore;
