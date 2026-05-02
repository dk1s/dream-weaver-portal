const winners = [
  { name: "Rohit S.", city: "Mumbai", amount: "$1,000,000", contest: "T20 Mega" },
  { name: "Aisha K.", city: "Bangalore", amount: "$500,000", contest: "Premier" },
  { name: "Vikram P.", city: "Delhi", amount: "$250,000", contest: "Champions" },
  { name: "Sara M.", city: "Chennai", amount: "$100,000", contest: "Pro Series" },
  { name: "Arjun T.", city: "Pune", amount: "$75,000", contest: "Weekend Mega" },
  { name: "Neha R.", city: "Kolkata", amount: "$50,000", contest: "Daily Cup" },
];

const ticker = [...winners, ...winners];

const Winners = () => (
  <section id="winners" className="py-24 px-4 md:px-8 bg-surface border-t border-border-dim overflow-hidden">
    <div className="max-w-7xl mx-auto mb-12">
      <div className="text-center">
        <div className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4">Hall of Glory</div>
        <h2 className="font-display text-5xl md:text-7xl text-foreground uppercase tracking-tight leading-none mb-4">
          Real Winners
        </h2>
        <p className="text-muted-foreground font-medium">Over <span className="text-accent font-display text-xl">$120M</span> paid out this season.</p>
      </div>
    </div>

    <div className="relative w-full">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
      <div className="flex gap-5 animate-ticker w-max">
        {ticker.map((w, i) => (
          <div key={i} className="bg-panel border border-border-dim p-6 w-72 shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-fire flex items-center justify-center font-display text-2xl text-primary-foreground">
                {w.name[0]}
              </div>
              <div>
                <div className="font-bold text-foreground">{w.name}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{w.city}</div>
              </div>
            </div>
            <div className="font-display text-4xl text-accent tabular-nums leading-none mb-2">{w.amount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">won {w.contest}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Winners;
