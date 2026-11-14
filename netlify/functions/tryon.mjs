// POST /api/tryon  -> inicia una prueba virtual en FASHN (Try-On Max)
// La clave FASHN_API_KEY vive solo en el servidor (variable de entorno de Netlify).

const FASHN = "https://api.fashn.ai/v1";

const PROMPTS = {
  top: "Replace only the upper-body garment. Keep pants, skirt, face, hair, body shape and pose unchanged.",
  bottom: "Replace only the lower-body garment (pants, jeans, shorts or skirt). Keep the top, face, body shape and pose unchanged.",
  dress: "The person wears this full-length one-piece garment. Keep face, hair, body shape and pose unchanged.",
  outer: "Layer this jacket or coat over the current outfit. Keep face, body shape and pose unchanged.",
  full: "The person wears this complete outfit. Keep face, hair, body shape and pose unchanged.",
};

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Usa POST" });

  const key = process.env.FASHN_API_KEY;
  if (!key) {
    return json(500, {
      error: "Falta configurar FASHN_API_KEY en Netlify (Site configuration > Environment variables).",
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "La solicitud no es JSON válido." });
  }

  const { model_image, product_image, category = "top", note = "", mode = "fast" } = body || {};
  const isImg = (s) => typeof s === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(s);
  if (!isImg(model_image) || !isImg(product_image)) {
    return json(400, { error: "Faltan la foto de tu cuerpo o la de la prenda." });
  }

  const extra = String(note).slice(0, 200).trim();
  const prompt = [PROMPTS[category] || PROMPTS.top, extra && `Styling note from the user: ${extra}`]
    .filter(Boolean)
    .join(" ");

  const res = await fetch(`${FASHN}/run`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model_name: "tryon-max",
      inputs: {
        model_image,
        product_image,
        prompt,
        resolution: "1k",
        generation_mode: mode === "balanced" ? "balanced" : "fast",
        num_images: 1,
        output_format: "jpeg",
        return_base64: true,
      },
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error || !data.id) {
    const msg = (data.error && (data.error.message || data.error)) || `FASHN respondió ${res.status}`;
    return json(502, { error: String(msg) });
  }
  return json(200, { id: data.id });
};

export const config = { path: "/api/tryon" };
