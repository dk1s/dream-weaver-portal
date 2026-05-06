import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { useParams, Link } from "react-router-dom";
import { usePortal } from "@/lib/portalStore";
import { useEffect, useMemo, useState } from "react";
import { Crown, TrendingUp, TrendingDown, Minus, ArrowLeft, Target, CircleDot } from "lucide-react";

type Row = {
  rank: number;
  user: string;
  team: string;
  points: number;
  isMe?: boolean;
  trend: "up" | "down" | "flat";
};

const NAMES = [
  "rohit_99", "hitman_x", "viratking", "msdhoni7", "pandya_hd",
  "bumrah_boom", "kl_rahul", "rishabh_p", "sky_360", "jadeja_sir",
  "gambhir_g", "yuvi_six", "ashwin_off", "shubman_g", "ishan_k",
  "iyer_shreyas", "samson_s", "axar_p", "siraj_m", "chahal_yz",
];

const ContestDetail = () => {
  const { id } = useParams();
  const { contests, profile } = usePortal();
  const contest = contests.find((c) => c.id === id);

  const [score, setScore] = useState({ runs: 142, wickets: 4, overs: 14.2, target: 178 });
  const [compareId, setCompareId] = useState<number | null>(null);

  // Derive batting/bowling team names from contest.match e.g. "VAL vs IRN"
  const [teamA, teamB] = (contest?.match ?? "TEAM A vs TEAM B").split(" vs ");
  const battingTeam = teamB; // 2nd innings = chasing team
  const bowlingTeam = teamA;
  const striker = ["R. Sharma", "V. Kohli", "S. Gill", "K. Rahul", "S. Iyer"][Math.floor(score.overs) % 5];
  const nonStriker = ["H. Pandya", "R. Pant", "S. Yadav", "J. Bumrah"][Math.floor(score.overs) % 4];
  const bowler = ["J. Archer", "T. Boult", "R. Jadeja", "M. Wood", "A. Khan"][Math.floor(score.overs) % 5];

  useEffect(() => {
    const t = setInterval(() => {
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
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Build leaderboard around the user's rank
  const rows: Row[] = useMemo(() => {
    if (!contest) return [];
    const seed = (n: number) => Math.abs(Math.sin(n * 9999) * 10000) % 1;
    const list: Row[] = [];
    // Top 10
    for (let i = 1; i <= 10; i++) {
      list.push({
        rank: i,
        user: NAMES[i % NAMES.length],
        team: ["Thunder XI", "Striker Squad", "Apex Hunters", "Royal Pride", "Storm Riders"][i % 5],
        points: +(contest.points + 200 - i * 12 + seed(i) * 8).toFixed(1),
        trend: seed(i) > 0.5 ? "up" : seed(i) > 0.25 ? "down" : "flat",
      });
    }
    // Around me
    if (contest.rank > 12) {
      [-2, -1, 0, 1, 2].forEach((d) => {
        const r = contest.rank + d;
        if (r < 1) return;
        list.push({
          rank: r,
          user: d === 0 ? profile.username.replace("@", "") : NAMES[(r * 3) % NAMES.length],
          team: d === 0 ? contest.teamName : ["Power Play", "Boundary Boys", "Sixer Squad"][(r) % 3],
          points: +(contest.points + (-d) * 0.7 + seed(r) * 0.5).toFixed(1),
          isMe: d === 0,
          trend: d < 0 ? "up" : d > 0 ? "down" : "flat",
        });
      });
    } else {
      // Me already in top 10 — ensure marked
      const idx = list.findIndex((r) => r.rank === contest.rank);
      if (idx >= 0) list[idx] = { ...list[idx], user: profile.username.replace("@", ""), team: contest.teamName, points: contest.points, isMe: true, trend: "flat" };
    }
    return list;
  }, [contest, profile]);

  if (!contest) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-4xl uppercase mb-4">Contest not found</h1>
          <Link to="/contests-hub" className="text-accent uppercase text-sm tracking-widest">← Back to contests</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const me = rows.find((r) => r.isMe);
  const above = me ? rows.find((r) => r.rank === me.rank - 1) : null;
  const leader = rows[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <Link to="/contests-hub" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-accent mb-4">
          <ArrowLeft className="w-3 h-3" /> All contests
        </Link>

        {/* SCORECARD (top) */}
        <div className="bg-gradient-to-br from-panel to-surface border border-border-dim p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="size-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Live</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{contest.match}</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">2nd Innings</div>
              <div className="font-display text-6xl md:text-7xl tabular-nums leading-none mt-2">
                {score.runs}<span className="text-muted-foreground text-3xl">/{score.wickets}</span>
              </div>
              <div className="text-accent font-display text-2xl tabular-nums">{score.overs.toFixed(1)} ov</div>
            </div>
            <div className="grid grid-cols-3 gap-3 md:col-span-2 text-center">
              <div className="border border-border-dim p-3">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Target</div>
                <div className="font-display text-3xl text-primary">{score.target}</div>
              </div>
              <div className="border border-border-dim p-3">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Need</div>
                <div className="font-display text-3xl text-accent">{Math.max(0, score.target - score.runs)}</div>
              </div>
              <div className="border border-border-dim p-3">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Balls Left</div>
                <div className="font-display text-3xl">{Math.max(0, (20 - score.overs) * 6).toFixed(0)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Leaderboard + Details */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-panel border border-border-dim">
            <div className="p-5 border-b border-border-dim flex justify-between items-center">
              <h2 className="font-display text-3xl uppercase">Leaderboard</h2>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {contest.totalPlayers.toLocaleString()} players
              </span>
            </div>
            <div className="divide-y divide-border-dim">
              <div className="grid grid-cols-12 gap-2 px-5 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <div className="col-span-2">Rank</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-3">Team</div>
                <div className="col-span-2 text-right">Points</div>
              </div>
              {rows.map((r) => (
                <div
                  key={`${r.rank}-${r.user}`}
                  className={`grid grid-cols-12 gap-2 px-5 py-3 items-center text-sm ${
                    r.isMe ? "bg-accent/10 border-l-4 border-accent" : ""
                  }`}
                >
                  <div className="col-span-2 font-display text-xl tabular-nums flex items-center gap-2">
                    {r.rank === 1 && <Crown className="w-4 h-4 text-accent" />}
                    #{r.rank}
                  </div>
                  <div className="col-span-5 font-bold truncate">
                    {r.user} {r.isMe && <span className="text-[10px] uppercase tracking-widest text-accent ml-1">You</span>}
                  </div>
                  <div className="col-span-3 text-muted-foreground text-xs truncate">{r.team}</div>
                  <div className="col-span-2 text-right font-display text-xl tabular-nums flex items-center justify-end gap-1">
                    {r.trend === "up" && <TrendingUp className="w-3 h-3 text-accent" />}
                    {r.trend === "down" && <TrendingDown className="w-3 h-3 text-primary" />}
                    {r.trend === "flat" && <Minus className="w-3 h-3 text-muted-foreground" />}
                    {r.points.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side: Details + Compare */}
          <div className="space-y-4">
            <div className="bg-panel border border-border-dim p-5">
              <h3 className="font-display text-2xl uppercase mb-3">Contest Details</h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between"><dt className="text-muted-foreground">Contest</dt><dd className="font-bold">{contest.contestName}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Match</dt><dd>{contest.match}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Entry</dt><dd>${contest.entry}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Prize Pool</dt><dd className="text-primary font-bold">{contest.prize}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Players</dt><dd>{contest.totalPlayers.toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Your Team</dt><dd className="text-accent">{contest.teamName}</dd></div>
              </dl>
            </div>

            <div className="bg-panel border border-border-dim p-5">
              <h3 className="font-display text-2xl uppercase mb-3">Compare</h3>
              <div className="border border-border-dim p-3 mb-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">You</div>
                <div className="flex justify-between items-end">
                  <div className="font-bold">{profile.username}</div>
                  <div className="font-display text-2xl tabular-nums">{contest.points.toFixed(1)}</div>
                </div>
                <div className="text-xs text-muted-foreground">Rank #{contest.rank}</div>
              </div>
              {above && (
                <div className="border border-border-dim p-3 mb-3">
                  <div className="text-[10px] uppercase tracking-widest text-accent">Above You</div>
                  <div className="flex justify-between items-end">
                    <div className="font-bold">{above.user}</div>
                    <div className="font-display text-2xl tabular-nums">{above.points.toFixed(1)}</div>
                  </div>
                  <div className="text-xs text-primary">+{(above.points - contest.points).toFixed(1)} pts to overtake</div>
                </div>
              )}
              <div className="border border-border-dim p-3">
                <div className="text-[10px] uppercase tracking-widest text-primary">Leader</div>
                <div className="flex justify-between items-end">
                  <div className="font-bold flex items-center gap-1"><Crown className="w-3 h-3 text-accent" />{leader.user}</div>
                  <div className="font-display text-2xl tabular-nums">{leader.points.toFixed(1)}</div>
                </div>
                <div className="text-xs text-muted-foreground">{(leader.points - contest.points).toFixed(1)} pts ahead</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContestDetail;
