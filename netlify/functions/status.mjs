// GET /api/status?id=...  -> consulta el estado de una prueba virtual en FASHN

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export default async (req) => {
  const key = process.env.FASHN_API_KEY;
  if (!key) return json(500, { error: "Falta configurar FASHN_API_KEY en Netlify." });

  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^[\w-]{8,80}$/.test(id)) return json(400, { error: "Id de prueba inválido." });

  const res = await fetch(`https://api.fashn.ai/v1/status/${id}`, {
    headers: { authorization: `Bearer ${key}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return json(502, { error: `FASHN respondió ${res.status}` });

  // status: starting | in_queue | processing | completed | failed
  const out = { status: data.status };
  if (data.status === "completed") out.image = Array.isArray(data.output) ? data.output[0] : null;
  if (data.status === "failed") {
    out.error = (data.error && (data.error.message || data.error.name)) || "La IA no pudo generar la imagen.";
  }
  return json(200, out);
};

export const config = { path: "/api/status" };
