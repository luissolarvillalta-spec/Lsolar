// GET /api/health -> la app lo usa para saber si está en un servidor real (y no en modo demo)
export default async () =>
  new Response(JSON.stringify({ ok: true, keyConfigured: Boolean(process.env.FASHN_API_KEY) }), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const config = { path: "/api/health" };
