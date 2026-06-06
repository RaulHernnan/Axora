const TC_FALLBACK = 17.85;

export async function GET() {
  try {
    const res = await fetch("https://api.bitso.com/v3/ticker/?book=usd_mxn", {
      next: { revalidate: 300 }, // cache 5 min
    });

    if (!res.ok) throw new Error("Bitso no disponible");

    const data = await res.json();

    if (!data.success || !data.payload?.last) throw new Error("Respuesta inválida");

    const tc = parseFloat(data.payload.last);

    return Response.json({ tc, fuente: "bitso", actualizado: new Date().toISOString() });
  } catch {
    return Response.json({ tc: TC_FALLBACK, fuente: "fallback", actualizado: new Date().toISOString() });
  }
}
