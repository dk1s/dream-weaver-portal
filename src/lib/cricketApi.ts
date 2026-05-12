// Direct CricAPI client. The CricAPI free key is treated as a publishable key
// (rate-limited per project) since cricketdata.org's servers reject Supabase
// edge IPs. CORS is enabled (`*`) so calling directly from the browser is fine.

const API_KEY = "e3a3523d-e59d-43c5-b352-aa163067b7fb";
const BASE = "https://api.cricapi.com/v1";

export type ApiMatch = {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo?: { name: string; shortname: string; img: string }[];
  score?: { r: number; w: number; o: number; inning: string }[];
  matchStarted: boolean;
  matchEnded: boolean;
};

const get = async <T>(endpoint: string, extra: Record<string, string> = {}): Promise<T> => {
  const params = new URLSearchParams({ apikey: API_KEY, offset: "0", ...extra });
  const r = await fetch(`${BASE}${endpoint}?${params.toString()}`);
  const json = await r.json();
  if (json.status && json.status !== "success") {
    throw new Error(json.reason || json.status);
  }
  return json.data as T;
};

export const fetchCurrentMatches = () => get<ApiMatch[]>("/currentMatches");
export const fetchMatches = () => get<ApiMatch[]>("/matches");
export const fetchMatchInfo = (id: string) => get<ApiMatch>("/match_info", { id });
