// Edge function: proxies CricAPI (cricketdata.org) to keep the API key server-side.
import { corsHeaders } from "../_shared/cors.ts";

const BASE = "https://api.cricapi.com/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const apikey = Deno.env.get("CRICAPI_KEY");
  if (!apikey) {
    return new Response(JSON.stringify({ error: "CRICAPI_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "currentMatches";
    const id = url.searchParams.get("id");

    let endpoint = "";
    const params = new URLSearchParams({ apikey });

    if (action === "currentMatches") {
      endpoint = "/currentMatches";
      params.set("offset", "0");
    } else if (action === "matches") {
      endpoint = "/matches";
      params.set("offset", "0");
    } else if (action === "match_info" && id) {
      endpoint = "/match_info";
      params.set("id", id);
    } else if (action === "match_scorecard" && id) {
      endpoint = "/match_scorecard";
      params.set("id", id);
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const r = await fetch(`${BASE}${endpoint}?${params.toString()}`);
    const data = await r.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
