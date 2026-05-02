import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { useState } from "react";
import { portalStore, usePortal } from "@/lib/portalStore";
import { toast } from "sonner";

type Match = { id: string; teamA: string; teamB: string; league: string; oddsA: number; oddsB: number; oddsDraw?: number };

const MATCHES: Match[] = [
  { id: "m1", teamA: "VAL", teamB: "IRN", league: "T20 World Cup", oddsA: 1.85, oddsB: 2.05 },
  { id: "m2", teamA: "MON", teamB: "COR", league: "Premier League", oddsA: 2.1, oddsB: 3.2, oddsDraw: 3.5 },
  { id: "m3", teamA: "APX", teamB: "CRD", league: "NBA Playoffs", oddsA: 1.65, oddsB: 2.4 },
];

const Bet = () => {
  const { balance, bets } = usePortal();
  const [pick, setPick] = useState<{ matchId: string; team: string; odds: number } | null>(null);
  const [amount, setAmount] = useState("");

  const place = () => {
    if (!pick) return toast.error("Pick a winner first");
    const n = parseFloat(amount);
    if (!n || n <= 0) return toast.error("Enter stake");
    if (n > balance) return toast.error("Insufficient balance");
    const m = MATCHES.find((x) => x.id === pick.matchId)!;
    const ok = portalStore.placeBet({
      match: `${m.teamA} vs ${m.teamB}`,
      pickedTeam: pick.team,
      amount: n,
      odds: pick.odds,
    });
    if (ok) {
      toast.success(`Bet placed: $${n} on ${pick.team}`);
      setAmount("");
      setPick(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-display text-6xl uppercase">Bet on Match</h1>
        <p className="text-muted-foreground mb-8">Pick the winning side. Win odds × stake.</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {MATCHES.map((m) => {
              const opts: { team: string; odds: number }[] = [
                { team: m.teamA, odds: m.oddsA },
                ...(m.oddsDraw ? [{ team: "Draw", odds: m.oddsDraw }] : []),
                { team: m.teamB, odds: m.oddsB },
              ];
              return (
                <div key={m.id} className="bg-panel border border-border-dim p-5">
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.league}</span>
                    <span className="text-[10px] uppercase tracking-widest text-primary">Open</span>
                  </div>
                  <div className="font-display text-3xl mb-4">
                    {m.teamA} <span className="text-muted-foreground">vs</span> {m.teamB}
                  </div>
                  <div className={`grid ${opts.length === 3 ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
                    {opts.map((o) => {
                      const active = pick?.matchId === m.id && pick.team === o.team;
                      return (
                        <button
                          key={o.team}
                          onClick={() => setPick({ matchId: m.id, team: o.team, odds: o.odds })}
                          className={`p-4 border ${active ? "border-accent bg-accent/10 text-accent" : "border-border-dim hover:border-foreground/40"}`}
                        >
                          <div className="text-xs uppercase tracking-widest text-muted-foreground">{o.team}</div>
                          <div className="font-display text-3xl tabular-nums">{o.odds.toFixed(2)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-panel border border-border-dim p-6 h-fit sticky top-24">
            <h3 className="font-display text-3xl uppercase mb-4">Bet Slip</h3>
            {pick ? (
              <div className="border border-border-dim p-4 mb-4">
                <div className="text-xs text-muted-foreground uppercase">Picked</div>
                <div className="font-display text-2xl">{pick.team}</div>
                <div className="text-accent font-bold">@ {pick.odds.toFixed(2)}</div>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm mb-4">Tap an outcome to add it.</div>
            )}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Stake $"
              className="w-full bg-background border border-border-dim px-3 py-3 focus:border-accent outline-none font-display text-2xl"
            />
            {pick && amount && (
              <div className="mt-3 text-sm flex justify-between">
                <span className="text-muted-foreground">Potential payout</span>
                <span className="font-bold text-accent">${(parseFloat(amount || "0") * pick.odds).toFixed(2)}</span>
              </div>
            )}
            <button onClick={place} className="w-full mt-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider py-4">
              Place Bet
            </button>
            <div className="text-xs text-center text-muted-foreground mt-2">Balance ${balance.toLocaleString()}</div>
          </div>
        </div>

        <h2 className="font-display text-4xl uppercase mt-12 mb-4">My Bets</h2>
        <div className="border border-border-dim divide-y divide-border-dim">
          {bets.length === 0 && <div className="p-6 text-muted-foreground text-center bg-panel">No bets yet.</div>}
          {bets.map((b) => (
            <div key={b.id} className="p-4 bg-panel flex justify-between items-center">
              <div>
                <div className="font-bold">{b.match}</div>
                <div className="text-xs text-muted-foreground">
                  {b.pickedTeam} @ {b.odds.toFixed(2)} • {new Date(b.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl text-primary">${b.amount}</div>
                <div className="text-xs uppercase tracking-widest text-accent">{b.status}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bet;
