const cols = [
  { t: "Sports", l: ["Cricket", "Football", "Basketball", "Kabaddi", "Hockey"] },
  { t: "Play", l: ["Mega Contests", "Head to Head", "Practice", "Private Leagues", "Tournaments"] },
  { t: "Company", l: ["About", "Careers", "Press", "Responsible Gaming", "Contact"] },
  { t: "Help", l: ["Support", "FAQs", "Rules", "Terms", "Privacy"] },
];

const Footer = () => (
  <footer className="bg-surface border-t border-border-dim px-4 md:px-8 pt-16 pb-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2">
          <div className="font-display text-4xl font-bold text-foreground uppercase mb-4">
            Apex<span className="text-primary">Draft</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            India's most rewarding fantasy sports platform. Play responsibly. 18+ only.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.t}>
            <div className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">{c.t}</div>
            <ul className="space-y-2">
              {c.l.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border-dim pt-6 flex flex-wrap gap-4 justify-between text-xs text-muted-foreground uppercase tracking-widest">
        <span>© 2026 ApexDraft. All rights reserved.</span>
        <span>This game involves financial risk and may be addictive. Play responsibly.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
