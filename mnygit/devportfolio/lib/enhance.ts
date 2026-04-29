export interface EnhancedDesc {
  name: string;
  description: string;
}

interface RepoLike {
  name: string;
  description: string | null;
  language: string | null;
}

const SYSTEM_PROMPT = `You are a developer portfolio copywriter. You write punchy, specific, human-sounding project descriptions for developer portfolios. You avoid buzzwords like leveraging, robust, scalable, seamless. You write like a smart developer explaining their work to another developer. Keep descriptions under 20 words. Be specific about what the project actually does.`;

export async function enhanceDescriptions(
  username: string,
  name: string | null,
  bio: string | null,
  repos: RepoLike[]
): Promise<EnhancedDesc[]> {
  if (!process.env.ANTHROPIC_API_KEY) return [];

  const repoList = repos
    .map((r) => `name: ${r.name}, language: ${r.language ?? "unknown"}, current description: ${r.description ?? "none"}`)
    .join("\n");

  const userPrompt = `Developer: ${name || username}
Bio: ${bio || "Not provided"}
Write enhanced one-line descriptions for these repos.
Return ONLY a JSON array in this exact format, no markdown, no backticks, no explanation, just the raw JSON array:
[
  {"name": "repo-name", "description": "enhanced description"},
  ...
]
For repos with no description, infer from the repo name and language.
Keep each description under 20 words. Sound human, not AI generated.

Repos:
${repoList}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    if (!res.ok) return [];

    const data = await res.json();
    const raw: string = data.content?.[0]?.text?.trim() ?? "";

    // Strip any accidental markdown code fences before parsing
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    return JSON.parse(jsonMatch[0]) as EnhancedDesc[];
  } catch {
    clearTimeout(timer);
    return [];
  }
}
