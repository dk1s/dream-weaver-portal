// Lightweight global store with localStorage persistence + subscriptions.
import { useSyncExternalStore } from "react";

export type JoinedContest = {
  id: string;
  match: string;
  contestName: string;
  entry: number;
  prize: string;
  rank: number;
  totalPlayers: number;
  points: number;
  teamName: string;
};

export type UserTeam = {
  id: string;
  name: string;
  matchId: string;
  match: string;
  captain: string;
  viceCaptain: string;
  players: string[];
  createdAt: number;
};

export type Bet = {
  id: string;
  match: string;
  pickedTeam: string;
  amount: number;
  odds: number;
  status: "pending" | "won" | "lost";
  createdAt: number;
};

export type Tx = {
  id: string;
  type: "deposit" | "withdraw" | "entry" | "winning" | "bet";
  amount: number;
  note: string;
  createdAt: number;
};

export type PortalState = {
  balance: number;
  profile: { name: string; username: string; email: string; phone: string; avatar: string };
  contests: JoinedContest[];
  teams: UserTeam[];
  bets: Bet[];
  txs: Tx[];
};

const KEY = "apexdraft.state.v1";

const seed: PortalState = {
  balance: 1482,
  profile: {
    name: "Arjun Mehra",
    username: "@apex_arjun",
    email: "arjun@apexdraft.gg",
    phone: "+91 98765 43210",
    avatar: "AM",
  },
  contests: [
    {
      id: "c1",
      match: "VAL vs IRN",
      contestName: "Mega Showdown",
      entry: 49,
      prize: "$5M",
      rank: 1284,
      totalPlayers: 50000,
      points: 612.5,
      teamName: "Thunder XI",
    },
    {
      id: "c2",
      match: "MON vs COR",
      contestName: "Head-to-Head",
      entry: 25,
      prize: "$50",
      rank: 2,
      totalPlayers: 4,
      points: 88.0,
      teamName: "Striker Squad",
    },
  ],
  teams: [],
  bets: [],
  txs: [
    { id: "t1", type: "deposit", amount: 500, note: "UPI deposit", createdAt: Date.now() - 86400000 },
    { id: "t2", type: "entry", amount: -49, note: "Mega Showdown", createdAt: Date.now() - 3600000 },
  ],
};

const load = (): PortalState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    return { ...seed, ...JSON.parse(raw) };
  } catch {
    return seed;
  }
};

let state: PortalState = load();
const listeners = new Set<() => void>();

const persist = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
};

const emit = () => {
  persist();
  listeners.forEach((l) => l());
};

export const portalStore = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  set: (patch: Partial<PortalState>) => {
    state = { ...state, ...patch };
    emit();
  },
  deposit: (amount: number) => {
    state = {
      ...state,
      balance: state.balance + amount,
      txs: [{ id: crypto.randomUUID(), type: "deposit", amount, note: "Wallet top-up", createdAt: Date.now() }, ...state.txs],
    };
    emit();
  },
  withdraw: (amount: number) => {
    state = {
      ...state,
      balance: state.balance - amount,
      txs: [{ id: crypto.randomUUID(), type: "withdraw", amount: -amount, note: "Bank withdrawal", createdAt: Date.now() }, ...state.txs],
    };
    emit();
  },
  addTeam: (team: Omit<UserTeam, "id" | "createdAt">) => {
    state = {
      ...state,
      teams: [{ ...team, id: crypto.randomUUID(), createdAt: Date.now() }, ...state.teams],
    };
    emit();
  },
  placeBet: (bet: Omit<Bet, "id" | "createdAt" | "status">) => {
    if (bet.amount > state.balance) return false;
    state = {
      ...state,
      balance: state.balance - bet.amount,
      bets: [{ ...bet, id: crypto.randomUUID(), status: "pending", createdAt: Date.now() }, ...state.bets],
      txs: [{ id: crypto.randomUUID(), type: "bet", amount: -bet.amount, note: `Bet on ${bet.pickedTeam}`, createdAt: Date.now() }, ...state.txs],
    };
    emit();
    return true;
  },
  joinContest: (c: Omit<JoinedContest, "id" | "rank" | "points">) => {
    if (c.entry > state.balance) return false;
    state = {
      ...state,
      balance: state.balance - c.entry,
      contests: [
        {
          ...c,
          id: crypto.randomUUID(),
          rank: Math.floor(Math.random() * c.totalPlayers) + 1,
          points: 0,
        },
        ...state.contests,
      ],
      txs: [{ id: crypto.randomUUID(), type: "entry", amount: -c.entry, note: c.contestName, createdAt: Date.now() }, ...state.txs],
    };
    emit();
    return true;
  },
};

export const usePortal = () => useSyncExternalStore(portalStore.subscribe, portalStore.get, portalStore.get);
