import { supabase } from "@/integrations/supabase/client";

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

const call = async <T>(action: string, id?: string): Promise<T> => {
  const params = new URLSearchParams({ action });
  if (id) params.set("id", id);
  const { data, error } = await supabase.functions.invoke(
    `cricket-scores?${params.toString()}`,
    { method: "GET" },
  );
  if (error) throw error;
  if (data?.status && data.status !== "success") {
    throw new Error(data.reason || data.status);
  }
  return data?.data as T;
};

export const fetchCurrentMatches = () => call<ApiMatch[]>("currentMatches");
export const fetchMatches = () => call<ApiMatch[]>("matches");
export const fetchMatchInfo = (id: string) => call<ApiMatch>("match_info", id);
