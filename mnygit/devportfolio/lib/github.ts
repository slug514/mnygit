import { purifyString } from "@/lib/purify";

export interface Repo {
  name: string;
  description: string | null;
  stars: number;
  language: string | null;
  url: string;
  aiEnhanced?: boolean;
}

export interface GitHubProfile {
  name: string | null;
  bio: string | null;
  avatar: string;
  location: string | null;
  website: string | null;
  publicRepos: number;
  repos: Repo[];
  readme: string | null;
}

export type GitHubError =
  | { type: "not_found"; message: string }
  | { type: "rate_limit"; message: string }
  | { type: "network"; message: string };

function githubHeaders(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export async function fetchGitHubProfile(
  username: string
): Promise<GitHubProfile> {
  const headers = githubHeaders();

  const userRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    { headers, next: { revalidate: 300 } }
  );

  if (userRes.status === 404) {
    throw { type: "not_found", message: `GitHub user "${username}" not found.` } as GitHubError;
  }
  if (userRes.status === 403 || userRes.status === 429) {
    throw { type: "rate_limit", message: "GitHub rate limit reached. Please try again in a few minutes." } as GitHubError;
  }
  if (!userRes.ok) {
    throw { type: "network", message: `GitHub API error: ${userRes.statusText}` } as GitHubError;
  }

  const user = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=stars&direction=desc&per_page=6&type=owner`,
    { headers, next: { revalidate: 300 } }
  );

  let repos: Repo[] = [];
  if (reposRes.ok) {
    const repoData = await reposRes.json();
    repos = repoData
      .filter((r: any) => !r.fork)
      .slice(0, 6)
      .map((r: any) => ({
        name: purifyString(r.name ?? ""),
        description: r.description ? purifyString(r.description) : null,
        stars: r.stargazers_count,
        language: r.language ? purifyString(r.language) : null,
        url: r.html_url,
      }));
  }

  // raw.githubusercontent.com doesn't use the GitHub API token
  let readme: string | null = null;
  const readmeRes = await fetch(
    `https://raw.githubusercontent.com/${encodeURIComponent(username)}/${encodeURIComponent(username)}/main/README.md`,
    { next: { revalidate: 300 } }
  );
  if (readmeRes.ok) {
    readme = await readmeRes.text();
  } else {
    const fallback = await fetch(
      `https://raw.githubusercontent.com/${encodeURIComponent(username)}/${encodeURIComponent(username)}/master/README.md`,
      { next: { revalidate: 300 } }
    );
    if (fallback.ok) readme = await fallback.text();
  }

  return {
    name: user.name ? purifyString(user.name) : null,
    bio: user.bio ? purifyString(user.bio) : null,
    avatar: user.avatar_url,
    location: user.location ? purifyString(user.location) : null,
    website: user.blog ?? null,
    publicRepos: user.public_repos ?? 0,
    repos,
    readme,
  };
}
