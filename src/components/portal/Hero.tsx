import heroImg from "@/assets/hero-stadium.jpg";
import { useState } from "react";
import { toast } from "sonner";

const Hero = () => {
  const [overs, setOvers] = useState("18.4");

  return (
    <section className="relative pt-20 pb-32 px-4 md:px-8 flex flex-col items-center justify-center min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImg} alt="Stadium night lights" width={1920} height={1080} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <div className="inline-block border border-primary/40 bg-primary/10 px-3 py-1 mb-6">
            <span className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <div className="size-2 bg-primary animate-pulse-glow" />
              Live Championship
            </span>
          </div>
          <h1 className="font-display text-6xl sm:text-7xl md:text-9xl font-bold text-foreground uppercase leading-[0.85] tracking-tight mb-6">
            The Final <br />
            <span className="text-transparent bg-clip-text bg-gradient-fire">Showdown</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-[45ch] font-medium leading-relaxed mb-8">
            The stadium is lit. The pitch is ready. Draft your ultimate XI and compete for the largest prize pool of the season.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => toast.success("Mega contest joined! Build your team now.")}
              className="bg-primary hover:bg-primary-glow text-primary-foreground font-display text-2xl md:text-3xl uppercase tracking-wider px-8 py-4 transition-all hover:shadow-fire"
            >
              Enter Mega Contest
            </button>
            <button className="border border-border-dim hover:border-accent text-foreground font-display text-2xl md:text-3xl uppercase tracking-wider px-8 py-4 transition-colors">
              How it Works
            </button>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto bg-panel/80 backdrop-blur-xl border border-border-dim relative overflow-hidden animate-fade-up">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">T20 Finals — 2nd Innings</span>
              <span className="text-accent font-bold text-sm tracking-wider animate-pulse-glow">Overs: {overs}</span>
            </div>
            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <div className="font-display text-5xl font-bold text-foreground leading-none">VAL</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Valkyries</div>
              </div>
              <div className="text-muted-foreground/40 font-display text-3xl">VS</div>
              <div className="text-center">
                <div className="font-display text-5xl font-bold text-foreground leading-none">IRN</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Ironclads</div>
              </div>
            </div>
            <div className="bg-background border border-border-dim p-4 flex justify-between items-center">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Target</div>
                <div className="font-display text-2xl text-foreground leading-none tabular-nums">194</div>
              </div>
              <div className="w-px h-8 bg-border-dim" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Current</div>
                <div className="font-display text-2xl text-accent leading-none tabular-nums">178/4</div>
              </div>
            </div>
            <button
              onClick={() => { setOvers((parseFloat(overs) + 0.1).toFixed(1)); toast("Refreshed live score"); }}
              className="mt-4 w-full text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors py-2 border border-border-dim"
            >
              ↻ Refresh Live Score
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
