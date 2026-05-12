import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { useEffect, useState } from "react";
import { usePortal } from "@/lib/portalStore";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentMatches, fetchMatchInfo, ApiMatch } from "@/lib/cricketApi";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, AlertCircle } from "lucide-react";

const LiveScore = () => {
  const { contests } = usePortal();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");

  const list = useQuery({
    queryKey: ["currentMatches"],
    queryFn: fetchCurrentMatches,
    refetchInterval: 30000,
  });

  // Auto-select first live match if none chosen
  useEffect(() => {
    if (!selectedId && list.data && list.data.length > 0) {
      setParams({ id: list.data[0].id }, { replace: true });
    }
  }, [list.data, selectedId, setParams]);

  const match = useQuery({
    queryKey: ["matchInfo", selectedId],
    queryFn: () => fetchMatchInfo(selectedId!),
    enabled: !!selectedId,
    refetchInterval: 15000,
  });

  const m = match.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="size-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Live • CricAPI</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl uppercase">Live Scores</h1>
          </div>
          <button
            onClick={() => { list.refetch(); match.refetch(); }}
            className="border border-border-dim p-3 hover:border-accent"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${list.isFetching || match.isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {list.isError && (
          <div className="border border-primary bg-primary/5 p-4 mb-6 flex gap-3 items-start">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-primary uppercase tracking-wider">API Error</div>
              <div className="text-muted-foreground mt-1">{(list.error as Error).message}</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Match list */}
          <div className="bg-panel border border-border-dim p-4 h-fit">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              Current Matches ({list.data?.length ?? 0})
            </div>
            {list.isLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {list.data?.map((mm) => (
                  <button
                    key={mm.id}
                    onClick={() => setParams({ id: mm.id })}
                    className={`w-full text-left p-3 border transition-colors ${
                      selectedId === mm.id ? "border-accent bg-accent/5" : "border-border-dim hover:border-foreground/30"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{mm.matchType}</div>
                    <div className="font-bold text-sm truncate">{mm.name}</div>
                    <div className="text-xs text-accent mt-1 truncate">{mm.status}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected match scorecard */}
          <div className="lg:col-span-2 space-y-6">
            {!m && match.isLoading && (
              <div className="bg-panel border border-border-dim p-12 text-center text-muted-foreground">
                Loading match…
              </div>
            )}
            {m && (
              <>
                <div className="bg-gradient-to-br from-panel to-surface border border-border-dim p-8">
                  <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{m.matchType} • {m.venue}</div>
                  <h2 className="font-display text-3xl md:text-4xl uppercase mb-1">{m.name}</h2>
                  <div className="text-xs text-primary font-bold uppercase tracking-wider mb-6">{m.status}</div>

                  {m.score && m.score.length > 0 ? (
                    <div className="space-y-4">
                      {m.score.map((s, i) => (
                        <ScoreRow key={i} inning={s.inning} runs={s.r} wickets={s.w} overs={s.o} teamInfo={m.teamInfo} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      Match {m.matchStarted ? "in progress" : "not started yet"}. Score not available.
                    </div>
                  )}
                </div>

                <div className="bg-panel border border-border-dim p-6">
                  <h3 className="font-display text-2xl uppercase mb-3">My Position</h3>
                  {contests.length === 0 ? (
                    <div className="text-muted-foreground text-sm">Join a contest to track rank here.</div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {contests.map((c) => (
                        <div key={c.id} className="border border-border-dim p-4">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.contestName}</div>
                          <div className="font-display text-xl mt-1 truncate">{c.teamName}</div>
                          <div className="flex justify-between mt-3">
                            <div>
                              <div className="text-[10px] uppercase text-muted-foreground">Rank</div>
                              <div className="font-display text-2xl text-accent">#{c.rank}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] uppercase text-muted-foreground">Pts</div>
                              <div className="font-display text-2xl">{c.points.toFixed(1)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ScoreRow = ({
  inning, runs, wickets, overs, teamInfo,
}: { inning: string; runs: number; wickets: number; overs: number; teamInfo?: ApiMatch["teamInfo"] }) => {
  const team = teamInfo?.find((t) => inning.toLowerCase().includes(t.name.toLowerCase()));
  return (
    <div className="flex items-center justify-between border-t border-border-dim pt-4">
      <div className="flex items-center gap-3">
        {team?.img && <img src={team.img} alt={team.name} className="size-10 object-contain" />}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{inning}</div>
          <div className="font-display text-xl">{team?.shortname ?? team?.name ?? inning.split(" Inning")[0]}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-4xl tabular-nums">
          {runs}<span className="text-muted-foreground text-2xl">/{wickets}</span>
        </div>
        <div className="text-accent text-sm tabular-nums">{overs} ov</div>
      </div>
    </div>
  );
};

export default LiveScore;
