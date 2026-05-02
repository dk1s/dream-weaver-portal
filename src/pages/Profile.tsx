import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { usePortal, portalStore } from "@/lib/portalStore";
import { useState } from "react";
import { toast } from "sonner";
import { Trophy, Target, Wallet, Users } from "lucide-react";

const Profile = () => {
  const { profile, balance, contests, teams, bets } = usePortal();
  const [form, setForm] = useState(profile);
  const [edit, setEdit] = useState(false);

  const save = () => {
    portalStore.set({ profile: form });
    setEdit(false);
    toast.success("Profile updated");
  };

  const stats = [
    { icon: Trophy, label: "Contests Joined", value: contests.length },
    { icon: Users, label: "Teams Created", value: teams.length },
    { icon: Target, label: "Bets Placed", value: bets.length },
    { icon: Wallet, label: "Balance", value: `$${balance.toLocaleString()}` },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-display text-6xl uppercase mb-10">Profile</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-panel border border-border-dim p-6 flex flex-col items-center text-center">
            <div className="size-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display text-5xl text-background">
              {profile.avatar}
            </div>
            <div className="font-display text-3xl mt-4">{profile.name}</div>
            <div className="text-muted-foreground text-sm">{profile.username}</div>
            <button
              onClick={() => setEdit(!edit)}
              className="mt-6 w-full border border-border-dim py-3 text-xs uppercase tracking-widest font-bold hover:border-accent hover:text-accent"
            >
              {edit ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="lg:col-span-2 bg-panel border border-border-dim p-6">
            <h2 className="font-display text-3xl uppercase mb-6">Account Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {(["name", "username", "email", "phone"] as const).map((k) => (
                <div key={k}>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</label>
                  {edit ? (
                    <input
                      value={form[k]}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                      className="w-full bg-background border border-border-dim px-3 py-2 mt-1 focus:border-accent outline-none"
                    />
                  ) : (
                    <div className="mt-1 text-foreground font-medium">{profile[k]}</div>
                  )}
                </div>
              ))}
            </div>
            {edit && (
              <button onClick={save} className="mt-6 bg-primary text-primary-foreground font-bold uppercase text-xs tracking-wider px-6 py-3">
                Save Changes
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-panel border border-border-dim p-5">
              <s.icon className="w-5 h-5 text-accent mb-3" />
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
              <div className="font-display text-3xl mt-1">{s.value}</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
