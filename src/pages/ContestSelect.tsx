import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getMatch, matchContests } from "@/lib/matchData";
import { usePortal } from "@/lib/portalStore";
import { Trophy, Users, Eye } from "lucide-react";

const ContestSelect = () => {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const match = getMatch(params.get("match"));
  const { contests } = usePortal();
  const list = matchContests(match.id);
  const matchLabel = `${match.teamA} vs ${match.teamB}`;
  const joinedHere = contests.filter((c) => c.match === matchLabel);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="text-[10px] uppercase tracking-widest text-accent">{match.league}</div>
        <h1 className="font-display text-5xl md:text-6xl uppercase mt-1">
          {match.teamA} <span className="text-muted-foreground">vs</span> {match.teamB}
        </h1>
        <p className="text-muted-foreground mb-8">
          Select a contest. You'll create your team next.
        </p>

        {joinedHere.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-2xl uppercase mb-3">Your Joined Contests</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {joinedHere.map((c) => (
                <button
                  key={c.id}
                  onClick={() => nav(`/contest/${c.id}`)}
                  className="text-left bg-panel border border-accent p-4 flex justify-between items-center hover:bg-accent/5"
                >
                  <div>
                    <div className="font-bold">{c.contestName}</div>
                    <div className="text-xs text-muted-foreground">Team: {c.teamName}</div>
                  </div>
                  <span className="flex items-center gap-1 text-accent text-xs uppercase tracking-widest">
                    <Eye className="w-3 h-3" /> Watch
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <h2 className="font-display text-2xl uppercase mb-3">Available Contests</h2>
        <div className="space-y-3">
          {list.map((c) => (
            <button
              key={c.key}
              onClick={() => nav(`/create-team?match=${match.id}&contest=${c.key}`)}
              className="w-full text-left bg-panel border border-border-dim hover:border-accent p-5 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-display text-3xl">{c.name}</div>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {c.prize}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.totalPlayers.toLocaleString()}</span>
                    <span>{c.winners}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Entry</div>
                  <div className="font-display text-3xl text-accent tabular-nums">
                    {c.entry === 0 ? "FREE" : `$${c.entry}`}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-primary mt-1">Create Team →</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContestSelect;
