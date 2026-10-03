type ScriptPayload = Record<string, unknown>;

export async function postToAppsScript(payload: ScriptPayload) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) return null;

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
    cache: "no-store",
  });

  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { ok: response.ok, raw: text };
  }
}
