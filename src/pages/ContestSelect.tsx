import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getMatch, matchContests } from "@/lib/matchData";
import { portalStore, usePortal, UserTeam } from "@/lib/portalStore";
import { useState } from "react";
import { toast } from "sonner";
import { Trophy, Users } from "lucide-react";

const ContestSelect = () => {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const match = getMatch(params.get("match"));
  const { teams, balance } = usePortal();
  const myTeams = teams.filter((t) => t.matchId === match.id);
  const contests = matchContests(match.id);

  const [pickedContest, setPickedContest] = useState<string | null>(null);
  const [pickedTeam, setPickedTeam] = useState<string | null>(myTeams[0]?.id ?? null);

  const join = () => {
    if (!pickedContest) return toast.error("Select a contest");
    if (!pickedTeam) return toast.error("Select a team");
    const c = contests.find((x) => x.key === pickedContest)!;
    const t = myTeams.find((x) => x.id === pickedTeam)!;
    if (c.entry > balance) return toast.error("Insufficient balance");
    const ok = portalStore.joinContest({
      match: `${match.teamA} vs ${match.teamB}`,
      contestName: c.name,
      entry: c.entry,
      prize: c.prize,
      totalPlayers: c.totalPlayers,
      teamName: t.name,
    });
    if (ok) {
      toast.success(`Joined ${c.name} with ${t.name}`);
      nav("/my-contests");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="text-[10px] uppercase tracking-widest text-accent">{match.league}</div>
        <h1 className="font-display text-5xl md:text-6xl uppercase mt-1">
          Pick a Contest
        </h1>
        <p className="text-muted-foreground mb-8">
          {match.teamA} vs {match.teamB} • Choose contest, then team to enter.
        </p>

        {myTeams.length === 0 ? (
          <div className="border border-border-dim p-12 text-center">
            <p className="text-muted-foreground mb-4">You have no teams for this match yet.</p>
            <Link to={`/create-team?match=${match.id}`} className="bg-primary text-primary-foreground font-bold uppercase text-xs tracking-wider px-5 py-3">
              Create Team
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Contests */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-display text-2xl uppercase mb-2">1. Select Contest</h2>
              {contests.map((c) => {
                const sel = pickedContest === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setPickedContest(c.key)}
                    className={`w-full text-left bg-panel border p-5 transition-all ${sel ? "border-accent" : "border-border-dim hover:border-foreground/40"}`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-display text-3xl">{c.name}</div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
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
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Team picker */}
            <div className="space-y-4 h-fit lg:sticky lg:top-24">
              <div className="bg-panel border border-border-dim p-5">
                <h2 className="font-display text-2xl uppercase mb-3">2. Select Your Team</h2>
                <div className="space-y-2">
                  {myTeams.map((t: UserTeam) => {
                    const sel = pickedTeam === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setPickedTeam(t.id)}
                        className={`w-full text-left p-3 border ${sel ? "border-accent bg-accent/5" : "border-border-dim"}`}
                      >
                        <div className="font-bold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">C: {t.captain} • VC: {t.viceCaptain}</div>
                      </button>
                    );
                  })}
                </div>
                <Link to={`/create-team?match=${match.id}`} className="mt-3 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-accent border border-border-dim py-2">
                  + Create Another Team
                </Link>
              </div>

              <button
                onClick={join}
                className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wider py-4"
              >
                Confirm & Join
              </button>
              <div className="text-xs text-center text-muted-foreground">Wallet: ${balance.toLocaleString()}</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ContestSelect;
