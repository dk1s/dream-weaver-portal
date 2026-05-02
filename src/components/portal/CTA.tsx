import { useState } from "react";
import { toast } from "sonner";

const CTA = () => {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    toast.success("You're in. Welcome bonus dropped in your inbox.");
    setEmail("");
  };

  return (
    <section className="py-24 px-4 md:px-8 bg-background border-t border-border-dim">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-6">Ready Player One?</div>
        <h2 className="font-display text-5xl md:text-8xl text-foreground uppercase tracking-tight leading-[0.9] mb-6">
          Get <span className="text-transparent bg-clip-text bg-gradient-fire">$50</span> on signup
        </h2>
        <p className="text-muted-foreground text-lg max-w-[50ch] mx-auto mb-10">
          Join 4M+ fantasy strategists. Welcome bonus credited instantly. No deposit required.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-panel border border-border-dim px-5 py-4 text-foreground placeholder:text-muted-foreground focus:border-accent outline-none transition-colors"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-glow text-primary-foreground font-display text-2xl uppercase tracking-wider px-8 py-4 transition-all hover:shadow-fire"
          >
            Claim Bonus
          </button>
        </form>
      </div>
    </section>
  );
};

export default CTA;
