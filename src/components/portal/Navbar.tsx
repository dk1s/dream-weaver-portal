import { Wallet, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePortal } from "@/lib/portalStore";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { balance } = usePortal();
  const loc = useLocation();
  const nav = useNavigate();

  const links = [
    { label: "Lobby", to: "/" },
    { label: "Live Score", to: "/live" },
    { label: "My Contests", to: "/my-contests" },
    { label: "Create Team", to: "/create-team" },
    { label: "Bet on Match", to: "/bet" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border-dim px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Link to="/" className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-wide uppercase leading-none mt-1">
          Apex<span className="text-primary">Draft</span>
        </Link>
        <div className="hidden lg:flex gap-7 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`${active ? "text-foreground" : ""} hover:text-accent transition-colors`}>
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/wallet" className="hidden sm:flex bg-panel border border-border-dim px-4 py-2 items-center gap-3 hover:border-accent transition-colors">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="font-display text-2xl text-accent leading-none mt-1 tabular-nums">${balance.toLocaleString()}</span>
        </Link>
        <button onClick={() => nav("/wallet")} className="bg-foreground text-background font-bold uppercase tracking-wider text-xs md:text-sm px-5 py-3 hover:bg-accent hover:text-accent-foreground transition-colors">
          Add Funds
        </button>
        <Link to="/profile" className="p-2 border border-border-dim hover:border-accent transition-colors" aria-label="Profile">
          <User className="w-5 h-5" />
        </Link>
        <button className="lg:hidden p-2 border border-border-dim" onClick={() => setOpen(!open)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-surface border-b border-border-dim flex flex-col lg:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-6 py-4 border-b border-border-dim text-sm font-semibold uppercase tracking-wider hover:bg-panel">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
