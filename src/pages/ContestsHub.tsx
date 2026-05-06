import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { usePortal } from "@/lib/portalStore";
import { matches, matchContests } from "@/lib/matchData";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Trophy, Users, TrendingUp } from "lucide-react";

type AvailableContest = {
  key: string;
  name: string;
  entry: number;
  prize: string;
  totalPlayers: number;
  winners: string;
  matchId: string;
  matchLabel: string;
  league: string;
  status: "LIVE" | "UPCOMING";
};

const ContestsHub = () => {
  const { contests } = usePortal();
  const nav = useNavigate();
  const [tab, setTab] = useState<"joined" | "available">("joined");

  const available: AvailableContest[] = matches.flatMap((m) =>
    matchContests(m.id).map((c) => ({
      ...c,
      matchId: m.id,
      matchLabel: `${m.teamA} vs ${m.teamB}`,
      league: m.league,
      status: m.status,
    }))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-6xl uppercase">Contests</h1>
            <p className="text-muted-foreground mt-2">Browse all contests. Track the ones you've joined.</p>
          </div>
        </div>

        <div className="flex border border-border-dim mb-8 max-w-md">
          <button
            onClick={() => setTab("joined")}
            className={`flex-1 py-3 font-bold uppercase tracking-wider text-xs ${
              tab === "joined" ? "bg-foreground text-background" : "text-muted-foreground"
            }`}
          >
            Joined ({contests.length})
          </button>
          <button
            onClick={() => setTab("available")}
            className={`flex-1 py-3 font-bold uppercase tracking-wider text-xs ${
              tab === "available" ? "bg-foreground text-background" : "text-muted-foreground"
            }`}
          >
            Available ({available.length})
          </button>
        </div>

        {tab === "joined" ? (
          contests.length === 0 ? (
            <div className="border border-border-dim p-16 text-center text-muted-foreground">
              No contests joined yet.
              <button onClick={() => setTab("available")} className="block mx-auto mt-4 text-accent uppercase text-xs tracking-widest font-bold">
                Browse Available →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {contests.map((c) => {
                const top10 = (c.rank / c.totalPlayers) * 100 <= 10;
                return (
                  <button
                    key={c.id}
                    onClick={() => nav(`/contest/${c.id}`)}
                    className="w-full text-left bg-panel border border-border-dim hover:border-accent p-6 grid md:grid-cols-5 gap-6 items-center transition-colors"
                  >
                    <div className="md:col-span-2">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.match}</div>
                      <div className="font-display text-3xl mt-1">{c.contestName}</div>
                      <div className="text-sm text-accent mt-1">Team: {c.teamName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Rank</div>
                      <div className={`font-display text-4xl tabular-nums ${top10 ? "text-accent" : "text-foreground"}`}>
                        #{c.rank.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">of {c.totalPlayers.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Points</div>
                      <div className="font-display text-4xl tabular-nums">{c.points.toFixed(1)}</div>
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <TrendingUp className="w-3 h-3" /> Live
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Prize</div>
                      <div className="font-display text-4xl text-primary tabular-nums">{c.prize}</div>
                      <div className="text-xs text-muted-foreground">Entry ${c.entry}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.map((c) => (
              <div key={c.key} className="bg-panel border border-border-dim p-5 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{c.league}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${c.status === "LIVE" ? "text-primary" : "text-accent"}`}>
                    {c.status}
                  </span>
                </div>
                <div className="font-display text-2xl mb-1">{c.matchLabel}</div>
                <div className="text-sm text-muted-foreground mb-4">{c.name}</div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="flex items-center gap-1.5"><Trophy className="w-3 h-3 text-accent" /> {c.prize}</div>
                  <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-muted-foreground" /> {c.totalPlayers.toLocaleString()}</div>
                </div>
                <div className="border-t border-border-dim pt-4 flex justify-between items-center mt-auto">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Entry</div>
                    <div className="font-display text-2xl text-accent tabular-nums">{c.entry === 0 ? "FREE" : `$${c.entry}`}</div>
                  </div>
                  <Link
                    to={`/create-team?match=${c.matchId}`}
                    className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-2"
                  >
                    Join →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ContestsHub;
