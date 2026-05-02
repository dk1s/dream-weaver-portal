import Navbar from "@/components/portal/Navbar";
import Footer from "@/components/portal/Footer";
import { usePortal, portalStore } from "@/lib/portalStore";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDownToLine, ArrowUpFromLine, CreditCard, Building2 } from "lucide-react";

const Wallet = () => {
  const { balance, txs } = usePortal();
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");

  const submit = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return toast.error("Enter a valid amount");
    if (tab === "withdraw" && n > balance) return toast.error("Insufficient balance");
    if (tab === "deposit") {
      portalStore.deposit(n);
      toast.success(`Deposited $${n}`);
    } else {
      portalStore.withdraw(n);
      toast.success(`Withdrawal of $${n} initiated`);
    }
    setAmount("");
  };

  const presets = [100, 500, 1000, 5000];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-display text-6xl uppercase mb-10">Wallet</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary to-accent p-6 text-background">
            <div className="text-[10px] uppercase tracking-widest opacity-80">Available Balance</div>
            <div className="font-display text-6xl mt-2 tabular-nums">${balance.toLocaleString()}</div>
            <div className="text-xs mt-4 opacity-80">ApexDraft Wallet • USD</div>
          </div>

          <div className="lg:col-span-2 bg-panel border border-border-dim p-6">
            <div className="flex gap-2 mb-6">
              {(["deposit", "withdraw"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border ${
                    tab === t ? "bg-foreground text-background border-foreground" : "border-border-dim text-muted-foreground"
                  }`}
                >
                  {t === "deposit" ? <ArrowDownToLine className="inline w-4 h-4 mr-2" /> : <ArrowUpFromLine className="inline w-4 h-4 mr-2" />}
                  {t}
                </button>
              ))}
            </div>

            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-background border border-border-dim px-4 py-4 mt-1 font-display text-3xl focus:border-accent outline-none"
            />
            <div className="flex gap-2 mt-3">
              {presets.map((p) => (
                <button key={p} onClick={() => setAmount(String(p))} className="flex-1 border border-border-dim py-2 text-xs font-bold hover:border-accent">
                  ${p}
                </button>
              ))}
            </div>

            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-6 mb-2">Method</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "upi", label: "UPI / Card", icon: CreditCard },
                { id: "bank", label: "Bank Transfer", icon: Building2 },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-4 border flex items-center gap-3 ${method === m.id ? "border-accent text-accent" : "border-border-dim text-muted-foreground"}`}
                >
                  <m.icon className="w-5 h-5" />
                  <span className="font-bold uppercase text-xs tracking-wider">{m.label}</span>
                </button>
              ))}
            </div>

            <button onClick={submit} className="w-full mt-6 bg-primary text-primary-foreground font-bold uppercase tracking-wider py-4">
              Confirm {tab}
            </button>
          </div>
        </div>

        <h2 className="font-display text-4xl uppercase mt-12 mb-4">Transaction History</h2>
        <div className="border border-border-dim divide-y divide-border-dim">
          {txs.length === 0 && <div className="p-6 text-muted-foreground text-center">No transactions yet.</div>}
          {txs.map((t) => (
            <div key={t.id} className="p-4 flex justify-between items-center bg-panel">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.type}</div>
                <div className="font-medium">{t.note}</div>
                <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className={`font-display text-2xl tabular-nums ${t.amount >= 0 ? "text-accent" : "text-primary"}`}>
                {t.amount >= 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
