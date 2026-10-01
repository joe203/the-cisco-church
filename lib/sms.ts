/**
 * Direct Telnyx text — one API call is not orchestration, so no n8n. Same
 * shape as EasyCaseload's helper. Config only: TELNYX_API_KEY and
 * TELNYX_FROM_NUMBER.
 */
export async function sendSms(to: string, text: string): Promise<boolean> {
  const apiKey = process.env.TELNYX_API_KEY;
  const from = process.env.TELNYX_FROM_NUMBER;
  if (!apiKey || !from) return false;
  try {
    const res = await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from, to, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
