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

const buildPool = (a: string, b: string): Player[] => [
  // Team A
  { id: `${a}-wk1`, name: "J. Buttler", team: a, role: "WK", credit: 10 },
  { id: `${a}-wk2`, name: "S. Billings", team: a, role: "WK", credit: 8 },
  { id: `${a}-bat1`, name: "K. Williams", team: a, role: "BAT", credit: 11 },
  { id: `${a}-bat2`, name: "D. Malan", team: a, role: "BAT", credit: 9.5 },
  { id: `${a}-bat3`, name: "P. Salt", team: a, role: "BAT", credit: 9 },
  { id: `${a}-ar1`, name: "B. Stokes", team: a, role: "AR", credit: 10.5 },
  { id: `${a}-ar2`, name: "M. Ali", team: a, role: "AR", credit: 8.5 },
  { id: `${a}-ar3`, name: "L. Livingstone", team: a, role: "AR", credit: 9 },
  { id: `${a}-bowl1`, name: "A. Khan", team: a, role: "BOWL", credit: 9 },
  { id: `${a}-bowl2`, name: "T. Boult", team: a, role: "BOWL", credit: 9.5 },
  { id: `${a}-bowl3`, name: "S. Curran", team: a, role: "BOWL", credit: 8 },
  { id: `${a}-bowl4`, name: "M. Wood", team: a, role: "BOWL", credit: 8.5 },
  // Team B
  { id: `${b}-wk1`, name: "M. Rizwan", team: b, role: "WK", credit: 10 },
  { id: `${b}-wk2`, name: "S. Khan", team: b, role: "WK", credit: 8 },
  { id: `${b}-bat1`, name: "B. Azam", team: b, role: "BAT", credit: 11 },
  { id: `${b}-bat2`, name: "F. Zaman", team: b, role: "BAT", credit: 9.5 },
  { id: `${b}-bat3`, name: "S. Masood", team: b, role: "BAT", credit: 9 },
  { id: `${b}-ar1`, name: "I. Wasim", team: b, role: "AR", credit: 8.5 },
  { id: `${b}-ar2`, name: "S. Aslam", team: b, role: "AR", credit: 8 },
  { id: `${b}-ar3`, name: "A. Ali", team: b, role: "AR", credit: 8.5 },
  { id: `${b}-bowl1`, name: "S. Afridi", team: b, role: "BOWL", credit: 9.5 },
  { id: `${b}-bowl2`, name: "H. Ali", team: b, role: "BOWL", credit: 9 },
  { id: `${b}-bowl3`, name: "N. Shah", team: b, role: "BOWL", credit: 8.5 },
  { id: `${b}-bowl4`, name: "M. Wasim", team: b, role: "BOWL", credit: 8 },
];

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
