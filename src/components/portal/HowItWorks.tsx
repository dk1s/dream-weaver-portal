const steps = [
  { n: "01", t: "Pick a Match", d: "Choose from live and upcoming sports across cricket, football, basketball and more." },
  { n: "02", t: "Draft Your XI", d: "Use 100 credits to build your dream team. Pick a captain (2x) and vice-captain (1.5x)." },
  { n: "03", t: "Join Contests", d: "Enter mega contests, head-to-head battles or free practice leagues." },
  { n: "04", t: "Win Big", d: "Earn points from every move on the field. Climb the leaderboard. Cash out instantly." },
];

const HowItWorks = () => (
  <section id="how" className="py-24 px-4 md:px-8 bg-background border-t border-border-dim">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">Get in the Game</div>
        <h2 className="font-display text-5xl md:text-7xl text-foreground uppercase tracking-tight leading-none">
          How it <span className="text-stroke">Works</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border-dim border border-border-dim">
        {steps.map((s) => (
          <div key={s.n} className="bg-background p-8 hover:bg-panel transition-colors group">
            <div className="font-display text-7xl text-primary leading-none mb-6 group-hover:text-accent transition-colors">{s.n}</div>
            <h3 className="font-display text-3xl text-foreground uppercase tracking-tight leading-none mb-3">{s.t}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
