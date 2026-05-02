import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { usePortal } from "@/lib/portalStore";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const MyContests = () => {
  const { contests } = usePortal();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-6xl uppercase">My Contests</h1>
            <p className="text-muted-foreground mt-2">Track rank, points & projected winnings live.</p>
          </div>
          <Link to="/" className="bg-primary text-primary-foreground font-bold uppercase text-xs tracking-wider px-5 py-3">
            Join New Contest
          </Link>
        </div>

        {contests.length === 0 ? (
          <div className="border border-border-dim p-16 text-center text-muted-foreground">
            No contests joined yet. Head back to the lobby and pick a match.
          </div>
        ) : (
          <div className="space-y-4">
            {contests.map((c) => {
              const top10 = (c.rank / c.totalPlayers) * 100 <= 10;
              return (
                <div key={c.id} className="bg-panel border border-border-dim p-6 grid md:grid-cols-5 gap-6 items-center">
                  <div className="md:col-span-2">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.match}</div>
                    <div className="font-display text-3xl mt-1">{c.contestName}</div>
                    <div className="text-sm text-accent mt-1">Team: {c.teamName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Your Rank</div>
                    <div className={`font-display text-4xl tabular-nums ${top10 ? "text-accent" : "text-foreground"}`}>
                      #{c.rank.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">of {c.totalPlayers.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Points</div>
                    <div className="font-display text-4xl tabular-nums text-foreground">{c.points.toFixed(1)}</div>
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <TrendingUp className="w-3 h-3" /> Live
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Prize Pool</div>
                    <div className="font-display text-4xl text-primary tabular-nums">{c.prize}</div>
                    <div className="text-xs text-muted-foreground">Entry ${c.entry}</div>
                  </div>
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

export default MyContests;
