Deno.serve(async () => {
  const results: Record<string, string> = {};
  for (const url of [
    "https://api.cricapi.com/v1/currentMatches?apikey=" + Deno.env.get("CRICAPI_KEY") + "&offset=0",
    "https://www.google.com",
    "https://cricapi.com",
  ]) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "curl/8.0" } });
      results[url] = `OK ${r.status}`;
    } catch (e) {
      results[url] = "ERR " + (e instanceof Error ? e.message : String(e));
    }
  }
  return new Response(JSON.stringify(results, null, 2), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
});
