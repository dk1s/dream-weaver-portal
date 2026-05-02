import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { useMemo, useState } from "react";
import { portalStore, usePortal } from "@/lib/portalStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Star, Crown } from "lucide-react";

type Player = { id: string; name: string; team: "VAL" | "IRN"; role: "BAT" | "BOWL" | "AR" | "WK"; credit: number };

const POOL: Player[] = [
  { id: "p1", name: "R. Stokes", team: "VAL", role: "AR", credit: 10.5 },
  { id: "p2", name: "K. Williams", team: "VAL", role: "BAT", credit: 11 },
  { id: "p3", name: "J. Buttler", team: "VAL", role: "WK", credit: 10 },
  { id: "p4", name: "A. Khan", team: "VAL", role: "BOWL", credit: 9 },
  { id: "p5", name: "T. Boult", team: "VAL", role: "BOWL", credit: 9.5 },
  { id: "p6", name: "M. Ali", team: "VAL", role: "AR", credit: 8.5 },
  { id: "p7", name: "S. Curran", team: "VAL", role: "BOWL", credit: 8 },
  { id: "p8", name: "B. Azam", team: "IRN", role: "BAT", credit: 11 },
  { id: "p9", name: "M. Rizwan", team: "IRN", role: "WK", credit: 10 },
  { id: "p10", name: "S. Afridi", team: "IRN", role: "BOWL", credit: 9.5 },
  { id: "p11", name: "H. Ali", team: "IRN", role: "BOWL", credit: 9 },
  { id: "p12", name: "I. Wasim", team: "IRN", role: "AR", credit: 8.5 },
  { id: "p13", name: "F. Zaman", team: "IRN", role: "BAT", credit: 9.5 },
  { id: "p14", name: "N. Shah", team: "IRN", role: "BOWL", credit: 8 },
];

const CAP = 100;
const MAX = 11;

const CreateTeam = () => {
  const nav = useNavigate();
  const { teams } = usePortal();
  const [selected, setSelected] = useState<string[]>([]);
  const [captain, setCaptain] = useState<string | null>(null);
  const [vc, setVc] = useState<string | null>(null);
  const [name, setName] = useState("");

  const used = useMemo(() => POOL.filter((p) => selected.includes(p.id)).reduce((s, p) => s + p.credit, 0), [selected]);

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
    setSelected([...selected, id]);
  };

  const save = () => {
    if (selected.length !== 11) return toast.error("Pick exactly 11 players");
    if (!captain || !vc) return toast.error("Choose captain & vice-captain");
    if (!name.trim()) return toast.error("Name your team");
    portalStore.addTeam({
      name,
      match: "VAL vs IRN",
      captain: POOL.find((p) => p.id === captain)!.name,
      viceCaptain: POOL.find((p) => p.id === vc)!.name,
      players: selected.map((id) => POOL.find((p) => p.id === id)!.name),
    });
    toast.success("Team created!");
    nav("/my-contests");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-display text-6xl uppercase">Create Team</h1>
        <p className="text-muted-foreground mb-8">VAL vs IRN • T20 World Cup</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-panel border border-border-dim p-6">
            <div className="grid grid-cols-3 mb-6 text-center border border-border-dim">
              <div className="p-3 border-r border-border-dim">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Players</div>
                <div className="font-display text-3xl">{selected.length}/11</div>
              </div>
              <div className="p-3 border-r border-border-dim">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Credits</div>
                <div className="font-display text-3xl text-accent">{(CAP - used).toFixed(1)}</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest">VAL / IRN</div>
                <div className="font-display text-3xl">
                  {selected.filter((id) => POOL.find((p) => p.id === id)?.team === "VAL").length} /{" "}
                  {selected.filter((id) => POOL.find((p) => p.id === id)?.team === "IRN").length}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              {POOL.map((p) => {
                const sel = selected.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className={`p-3 border flex items-center justify-between cursor-pointer ${sel ? "border-accent bg-accent/5" : "border-border-dim hover:border-foreground/30"}`}
                    onClick={() => toggle(p.id)}
                  >
                    <div>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.team} • {p.role}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sel && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCaptain(captain === p.id ? null : p.id);
                              if (vc === p.id) setVc(null);
                            }}
                            className={`p-1.5 border ${captain === p.id ? "bg-primary text-primary-foreground border-primary" : "border-border-dim"}`}
                            title="Captain (2x)"
                          >
                            <Crown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setVc(vc === p.id ? null : p.id);
                              if (captain === p.id) setCaptain(null);
                            }}
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

          <div className="bg-panel border border-border-dim p-6 h-fit sticky top-24">
            <h3 className="font-display text-3xl uppercase mb-4">Save Team</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Team name"
              className="w-full bg-background border border-border-dim px-3 py-3 focus:border-accent outline-none mb-4"
            />
            <div className="text-xs text-muted-foreground space-y-1 mb-4">
              <div>• Captain earns 2x points</div>
              <div>• Vice-Captain earns 1.5x points</div>
              <div>• Max 7 players from one side</div>
            </div>
            <button onClick={save} className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wider py-4">
              Save Team
            </button>
            <div className="text-xs text-center text-muted-foreground mt-3">{teams.length} team(s) created</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTeam;
