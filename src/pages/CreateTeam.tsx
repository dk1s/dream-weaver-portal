import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { useMemo, useState } from "react";
import { portalStore, usePortal } from "@/lib/portalStore";
import { toast } from "sonner";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Star, Crown } from "lucide-react";
import { getMatch, Role } from "@/lib/matchData";

const CAP = 100;
const MAX = 11;

const ROLE_META: { key: Role; label: string; min: number; max: number }[] = [
  { key: "WK", label: "Wicket-Keepers", min: 1, max: 4 },
  { key: "BAT", label: "Batters", min: 3, max: 6 },
  { key: "AR", label: "All-Rounders", min: 1, max: 4 },
  { key: "BOWL", label: "Bowlers", min: 3, max: 6 },
];

const CreateTeam = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const match = getMatch(params.get("match"));
  const POOL = match.players;

  const { teams } = usePortal();
  const [selected, setSelected] = useState<string[]>([]);
  const [captain, setCaptain] = useState<string | null>(null);
  const [vc, setVc] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [activeTeam, setActiveTeam] = useState<string>(match.teamA);

  const used = useMemo(
    () => POOL.filter((p) => selected.includes(p.id)).reduce((s, p) => s + p.credit, 0),
    [selected, POOL]
  );

  const countByRole = (r: Role) =>
    selected.filter((id) => POOL.find((p) => p.id === id)?.role === r).length;
  const countByTeam = (t: string) =>
    selected.filter((id) => POOL.find((p) => p.id === id)?.team === t).length;

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
      if (captain === id) setCaptain(null);
      if (vc === id) setVc(null);
      return;
    }
    if (selected.length >= MAX) return toast.error("Max 11 players");
    const p = POOL.find((x) => x.id === id)!;
    if (used + p.credit > CAP) return toast.error("Not enough credits");
    const roleMax = ROLE_META.find((r) => r.key === p.role)!.max;
    if (countByRole(p.role) >= roleMax) return toast.error(`Max ${roleMax} ${p.role}`);
    if (countByTeam(p.team) >= 7) return toast.error("Max 7 from one side");
    setSelected([...selected, id]);
  };

  const save = () => {
    if (selected.length !== 11) return toast.error("Pick exactly 11 players");
    for (const r of ROLE_META) {
      if (countByRole(r.key) < r.min) return toast.error(`Need at least ${r.min} ${r.label}`);
    }
    if (!captain || !vc) return toast.error("Choose captain & vice-captain");
    if (!name.trim()) return toast.error("Name your team");
    portalStore.addTeam({
      name,
      matchId: match.id,
      match: `${match.teamA} vs ${match.teamB}`,
      captain: POOL.find((p) => p.id === captain)!.name,
      viceCaptain: POOL.find((p) => p.id === vc)!.name,
      players: selected.map((id) => POOL.find((p) => p.id === id)!.name),
    });
    toast.success("Team saved! Now pick a contest.");
    nav(`/contests?match=${match.id}`);
  };

  const visiblePlayers = POOL.filter((p) => p.team === activeTeam);
  const teamMatchTeams = teams.filter((t) => t.matchId === match.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="text-[10px] uppercase tracking-widest text-accent">{match.league}</div>
        <h1 className="font-display text-5xl md:text-6xl uppercase mt-1">
          {match.teamA} <span className="text-muted-foreground">vs</span> {match.teamB}
        </h1>
        <p className="text-muted-foreground mb-8">
          {match.teamAName} vs {match.teamBName} • {match.detail}
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-panel border border-border-dim p-6">
            <div className="grid grid-cols-3 mb-6 text-center border border-border-dim">
              <div className="p-3 border-r border-border-dim">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Players</div>
                <div className="font-display text-3xl">{selected.length}/11</div>
              </div>
              <div className="p-3 border-r border-border-dim">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Credits left</div>
                <div className="font-display text-3xl text-accent">{(CAP - used).toFixed(1)}</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">{match.teamA} / {match.teamB}</div>
                <div className="font-display text-3xl">
                  {countByTeam(match.teamA)} / {countByTeam(match.teamB)}
                </div>
              </div>
            </div>

            {/* Team toggle */}
            <div className="flex border border-border-dim mb-4">
              {[match.teamA, match.teamB].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTeam(t)}
                  className={`flex-1 py-3 font-display text-2xl uppercase ${
                    activeTeam === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t} ({countByTeam(t)})
                </button>
              ))}
            </div>

            {/* Role groups */}
            {ROLE_META.map((r) => {
              const players = visiblePlayers.filter((p) => p.role === r.key);
              const c = countByRole(r.key);
              const ok = c >= r.min;
              return (
                <div key={r.key} className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-display text-xl uppercase tracking-wide">
                      {r.label} <span className="text-xs text-muted-foreground">(min {r.min}, max {r.max})</span>
                    </h3>
                    <span className={`text-xs font-bold ${ok ? "text-accent" : "text-primary"}`}>
                      Picked: {c}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {players.map((p) => {
                      const sel = selected.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          className={`p-3 border flex items-center justify-between cursor-pointer ${sel ? "border-accent bg-accent/5" : "border-border-dim hover:border-foreground/30"}`}
                          onClick={() => toggle(p.id)}
                        >
                          <div>
                            <div className="font-bold">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.team} • {p.role}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {sel && (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setCaptain(captain === p.id ? null : p.id); if (vc === p.id) setVc(null); }}
                                  className={`p-1.5 border ${captain === p.id ? "bg-primary text-primary-foreground border-primary" : "border-border-dim"}`}
                                  title="Captain (2x)"
                                >
                                  <Crown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setVc(vc === p.id ? null : p.id); if (captain === p.id) setCaptain(null); }}
                                  className={`p-1.5 border ${vc === p.id ? "bg-accent text-accent-foreground border-accent" : "border-border-dim"}`}
                                  title="Vice-Captain (1.5x)"
                                >
                                  <Star className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            <span className="font-display text-xl tabular-nums w-10 text-right">{p.credit}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 h-fit lg:sticky lg:top-24">
            <div className="bg-panel border border-border-dim p-6">
              <h3 className="font-display text-3xl uppercase mb-4">Save Team</h3>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team name"
                className="w-full bg-background border border-border-dim px-3 py-3 focus:border-accent outline-none mb-4"
              />
              <div className="text-xs text-muted-foreground space-y-1 mb-4">
                <div>• At least 1 from each role</div>
                <div>• Captain earns 2x, V-Captain 1.5x</div>
                <div>• Max 7 players from one side</div>
              </div>
              <button onClick={save} className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wider py-4">
                Save & Pick Contest
              </button>
            </div>

            {teamMatchTeams.length > 0 && (
              <div className="bg-panel border border-border-dim p-6">
                <h3 className="font-display text-2xl uppercase mb-3">Your Teams ({teamMatchTeams.length})</h3>
                <div className="space-y-2">
                  {teamMatchTeams.map((t) => (
                    <div key={t.id} className="border border-border-dim p-3 text-sm">
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">C: {t.captain} • VC: {t.viceCaptain}</div>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/contests?match=${match.id}`}
                  className="mt-4 block text-center border border-accent text-accent text-xs font-bold uppercase tracking-wider py-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Join Contest →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTeam;
