import { toast } from "sonner";

const contests = [
  { tag: "Confirmed", tagColor: "accent", label: "Mega Prize Pool", prize: "$5,000,000", first: "$1M", winners: "65%", joined: 850241, total: 1000000, entry: "$25" },
  { tag: "High Roller", tagColor: "primary", label: "Winner Takes All", prize: "$100,000", first: "$100K", winners: "1%", joined: 42, total: 100, entry: "$1,000" },
  { tag: "Practice", tagColor: "muted", label: "Free Entry", prize: "$2,500", first: "$500", winners: "30%", joined: 12453, total: 50000, entry: "FREE" },
  { tag: "H2H", tagColor: "muted", label: "Head to Head", prize: "$500", first: "$500", winners: "50%", joined: 1, total: 2, entry: "$275" },
];

const Contests = () => {
  return (
    <section id="contests" className="py-24 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
          <div>
            <h2 className="font-display text-5xl md:text-6xl text-foreground uppercase tracking-tight leading-none mb-2">
              Featured Contests
            </h2>
            <p className="text-muted-foreground font-medium">High stakes. Massive payouts.</p>
          </div>
          <button className="text-accent text-sm font-bold uppercase tracking-widest hover:text-foreground transition-colors">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {contests.map((c, i) => {
            const pct = Math.round((c.joined / c.total) * 100);
            const tagBg = c.tagColor === "accent" ? "bg-accent text-accent-foreground" : c.tagColor === "primary" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground";
            const barColor = c.tagColor === "accent" ? "bg-accent" : c.tagColor === "primary" ? "bg-primary" : "bg-muted-foreground";
            return (
              <div key={i} className="bg-panel border border-border-dim hover:border-accent/50 transition-all relative overflow-hidden flex flex-col group">
                <div className={`absolute top-0 right-0 ${tagBg} text-[10px] font-bold uppercase tracking-widest px-3 py-1`}>
                  {c.tag}
                </div>
                <div className="p-5 flex-grow">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">{c.label}</div>
                  <div className="font-display text-5xl text-foreground leading-none mb-3 tabular-nums">{c.prize}</div>
                  <div className="flex justify-between items-center border-b border-border-dim pb-3 mb-4 text-xs">
                    <span className="text-muted-foreground">1st: <span className="text-foreground font-bold">{c.first}</span></span>
                    <span className="text-muted-foreground">{c.winners} win</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-background h-1.5 overflow-hidden">
                      <div className={`${barColor} h-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground tabular-nums uppercase">
                      <span>{c.joined.toLocaleString()} joined</span>
                      <span>{c.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-background border-t border-border-dim flex justify-between items-center">
                  <span className="font-display text-2xl text-muted-foreground tabular-nums">{c.entry}</span>
                  <button
                    onClick={() => toast.success(`Joined: ${c.label}`)}
                    className="bg-foreground text-background text-xs font-bold uppercase tracking-wider px-5 py-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contests;
