const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8" },
});

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!process.env.OPENAI_API_KEY) return json({ error: "AI service is not configured" }, 503);

  try {
    const { imageBase64, mimeType } = await request.json();
    if (!imageBase64 || !mimeType?.startsWith("image/")) return json({ error: "Invalid meal image" }, 400);
    if (imageBase64.length > 7_000_000) return json({ error: "Image is too large" }, 413);

    const prompt = `Analyze this meal photo for a consumer food journal. Return JSON only, with this exact shape:
{"items":[{"name":"string","estimated_grams":0,"kcal":0,"protein_g":0,"confidence":0}],"total_kcal":0,"total_protein_g":0,"note":"string"}
List separate visible foods where possible. Use conservative estimates, set confidence from 0 to 1, and say when portion size is uncertain. This is an estimate, not medical or dietary advice.`;
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: [{ role: "user", content: [
          { type: "input_text", text: prompt },
          { type: "input_image", image_url: `data:${mimeType};base64,${imageBase64}` },
        ] }],
      }),
    });
    if (!response.ok) return json({ error: "AI analysis failed" }, 502);
    const result = await response.json();
    const raw = result.output_text?.replace(/^```json\s*|\s*```$/g, "").trim();
    const analysis = JSON.parse(raw);
    return json({ ...analysis, estimated: true });
  } catch (error) {
    return json({ error: "Could not analyze this image" }, 500);
  }
};
