import { Wallet, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const links = ["Lobby", "My Contests", "Stats", "Rewards"];

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border-dim px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <a href="#" className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-wide uppercase leading-none mt-1">
          Apex<span className="text-primary">Draft</span>
        </a>
        <div className="hidden lg:flex gap-7 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {links.map((l, i) => (
            <a key={l} href="#" className={`${i === 0 ? "text-foreground" : ""} hover:text-accent transition-colors`}>
              {l}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex bg-panel border border-border-dim px-4 py-2 items-center gap-3">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="font-display text-2xl text-accent leading-none mt-1 tabular-nums">$1,482</span>
        </div>
        <button className="bg-foreground text-background font-bold uppercase tracking-wider text-xs md:text-sm px-5 py-3 hover:bg-accent hover:text-accent-foreground transition-colors">
          Add Funds
        </button>
        <button className="lg:hidden p-2 border border-border-dim" onClick={() => setOpen(!open)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-surface border-b border-border-dim flex flex-col lg:hidden">
          {links.map((l) => (
            <a key={l} href="#" className="px-6 py-4 border-b border-border-dim text-sm font-semibold uppercase tracking-wider hover:bg-panel">
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
