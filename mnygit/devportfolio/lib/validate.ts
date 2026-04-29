// Strip HTML tags from a string
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

// GitHub username: alphanumeric + hyphens, max 39 chars, no leading/trailing hyphen
const USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$|^[a-zA-Z0-9]$/;

export function validateUsername(raw: string): string {
  const username = raw.trim().replace(/^@/, "");

  if (!username) throw new Error("Invalid GitHub username format");
  if (username.length > 39) throw new Error("Invalid GitHub username format");
  if (username.includes("/") || username.includes("..")) {
    throw new Error("Invalid GitHub username format");
  }
  if (!USERNAME_RE.test(username)) throw new Error("Invalid GitHub username format");

  return username;
}

export interface RepoInput {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
}

export interface EnhanceRequest {
  username: string;
  name: string;
  bio: string;
  repos: RepoInput[];
}

export function validateEnhanceRequest(body: unknown): EnhanceRequest {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Invalid request body");
  }

  const b = body as Record<string, unknown>;

  const username = validateUsername(typeof b.username === "string" ? b.username : "");

  const name =
    typeof b.name === "string"
      ? stripHtml(b.name).slice(0, 100)
      : "";

  const bio =
    typeof b.bio === "string"
      ? stripHtml(b.bio).slice(0, 500)
      : "";

  if (!Array.isArray(b.repos) || b.repos.length === 0) {
    throw new Error("repos must be a non-empty array");
  }
  if (b.repos.length > 6) throw new Error("Too many repos");

  const repos: RepoInput[] = (b.repos as unknown[]).map((r, i) => {
    if (!r || typeof r !== "object" || Array.isArray(r)) {
      throw new Error(`Invalid repo at index ${i}`);
    }
    const repo = r as Record<string, unknown>;

    const stars = Number(repo.stars);
    if (!Number.isFinite(stars) || stars < 0) {
      throw new Error(`Invalid stars at repo ${i}`);
    }

    return {
      name: typeof repo.name === "string" ? repo.name.slice(0, 100) : "",
      description:
        typeof repo.description === "string"
          ? stripHtml(repo.description).slice(0, 300)
          : null,
      language:
        typeof repo.language === "string"
          ? repo.language.slice(0, 50)
          : null,
      stars,
    };
  });

  return { username, name, bio, repos };
}
