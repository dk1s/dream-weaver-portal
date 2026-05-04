// Cricket match data + player pools per match.
export type Role = "WK" | "BAT" | "AR" | "BOWL";

export type Player = {
  id: string;
  name: string;
  team: string; // team short code
  role: Role;
  credit: number;
};

export type CricketMatch = {
  id: string;
  league: string;
  status: "LIVE" | "UPCOMING";
  detail: string;
  teamA: string;
  teamAName: string;
  teamB: string;
  teamBName: string;
  prize: string;
  startsIn?: string;
  players: Player[];
};

// 11-player lineup per team: 1 WK, 4 BAT, 2 AR, 4 BOWL
const LINEUP_A = [
  { role: "WK" as Role, names: ["J. Buttler"] },
  { role: "BAT" as Role, names: ["K. Williams", "D. Malan", "P. Salt", "J. Root"] },
  { role: "AR" as Role, names: ["B. Stokes", "M. Ali"] },
  { role: "BOWL" as Role, names: ["A. Khan", "T. Boult", "S. Curran", "M. Wood"] },
];

const LINEUP_B = [
  { role: "WK" as Role, names: ["M. Rizwan"] },
  { role: "BAT" as Role, names: ["B. Azam", "F. Zaman", "S. Masood", "I. Khan"] },
  { role: "AR" as Role, names: ["I. Wasim", "S. Aslam"] },
  { role: "BOWL" as Role, names: ["S. Afridi", "H. Ali", "N. Shah", "M. Wasim"] },
];

const buildPool = (a: string, b: string): Player[] => {
  const out: Player[] = [];
  LINEUP_A.forEach((g) =>
    g.names.forEach((n, i) =>
      out.push({ id: `${a}-${g.role}-${i}`, name: n, team: a, role: g.role, credit: 9 })
    )
  );
  LINEUP_B.forEach((g) =>
    g.names.forEach((n, i) =>
      out.push({ id: `${b}-${g.role}-${i}`, name: n, team: b, role: g.role, credit: 9 })
    )
  );
  return out;
};

export const matches: CricketMatch[] = [
  { id: "val-irn", league: "T20 World Cup", status: "LIVE", detail: "Q3 • 14.2 OV", teamA: "VAL", teamAName: "Valkyries", teamB: "IRN", teamBName: "Ironclads", prize: "$5M", players: buildPool("VAL", "IRN") },
  { id: "mon-cor", league: "IPL 2026", status: "LIVE", detail: "12.4 OV", teamA: "MON", teamAName: "Monarchs", teamB: "COR", teamBName: "Corsairs", prize: "$2M", players: buildPool("MON", "COR") },
  { id: "tit-rgr", league: "BBL", status: "UPCOMING", detail: "Starts in 2h", teamA: "TIT", teamAName: "Titans", teamB: "RGR", teamBName: "Rangers", prize: "$1.5M", players: buildPool("TIT", "RGR") },
  { id: "apx-crd", league: "PSL", status: "UPCOMING", detail: "Starts in 5h", teamA: "APX", teamAName: "Apex", teamB: "CRD", teamBName: "Cardinals", prize: "$500K", players: buildPool("APX", "CRD") },
];

export const getMatch = (id: string | null) => matches.find((m) => m.id === id) ?? matches[0];

export const matchContests = (matchId: string) => [
  { key: `${matchId}-mega`, name: "Mega Showdown", entry: 49, prize: "$5M", totalPlayers: 50000, winners: "65%" },
  { key: `${matchId}-grand`, name: "Grand League", entry: 25, prize: "$1M", totalPlayers: 20000, winners: "55%" },
  { key: `${matchId}-h2h`, name: "Head to Head", entry: 10, prize: "$18", totalPlayers: 2, winners: "1 win" },
  { key: `${matchId}-prac`, name: "Practice (Free)", entry: 0, prize: "Glory", totalPlayers: 1000, winners: "Top 10" },
];
