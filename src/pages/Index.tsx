import Navbar from "@/components/portal/Navbar";
import Hero from "@/components/portal/Hero";
import LiveMatches from "@/components/portal/LiveMatches";
import Contests from "@/components/portal/Contests";
import Leaderboard from "@/components/portal/Leaderboard";
import HowItWorks from "@/components/portal/HowItWorks";
import Winners from "@/components/portal/Winners";
import CTA from "@/components/portal/CTA";
import Footer from "@/components/portal/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <LiveMatches />
        <Contests />
        <Leaderboard />
        <HowItWorks />
        <Winners />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
