// Edge function: proxies CricAPI (cricketdata.org) to keep the API key server-side.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const target = `${BASE}${endpoint}?${params.toString()}`;
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(target, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; ApexDraft/1.0)",
            "Accept": "application/json",
          },
        });
        const data = await r.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        lastErr = e;
        await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error("Upstream fetch failed");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
