import { fetchGitHubProfile, GitHubError, GitHubProfile, Repo } from "@/lib/github";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortfolioHero from "@/components/PortfolioHero";
import ProjectsGrid from "@/components/ProjectsGrid";
import PortfolioFooter from "@/components/PortfolioFooter";
import GoProButton from "@/components/GoProButton";
import { isUserPro } from "@/lib/supabase";

// Always render fresh — isPro must reflect the latest Supabase state
export const dynamic = "force-dynamic";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const profile = await fetchGitHubProfile(params.username);
    return {
      title: `${profile.name || params.username} — DevPortfolio Quick`,
      description:
        profile.bio ||
        `${params.username}'s developer portfolio, built with DevPortfolio Quick.`,
    };
  } catch {
    return { title: "Portfolio — DevPortfolio Quick" };
  }
}

function PortfolioError({ message }: { message: string }) {
  return (
    <main
      style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}
      className="flex items-center justify-center p-6"
    >
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "#FF6B6B",
            fontSize: "0.875rem",
            marginBottom: "20px",
          }}
        >
          ✗ {message}
        </p>
        <a
          href="/"
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            color: "var(--accent)",
            textDecoration: "none",
            fontSize: "0.875rem",
            letterSpacing: "-0.01em",
          }}
        >
          ← back to home
        </a>
      </div>
    </main>
  );
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function buildRepos(profile: GitHubProfile, username: string): Promise<Repo[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/enhance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        name: profile.name,
        bio: profile.bio,
        repos: profile.repos.map((r) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stars,
        })),
      }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return profile.repos;

    const { enhanced } = await res.json();
    if (!Array.isArray(enhanced) || enhanced.length === 0) return profile.repos;

    const descMap = new Map<string, string>(
      enhanced.map((e: { name: string; description: string }) => [e.name, e.description])
    );

    return profile.repos.map((repo) => ({
      ...repo,
      description: descMap.get(repo.name) ?? repo.description,
      aiEnhanced: descMap.has(repo.name),
    }));
  } catch {
    return profile.repos;
  }
}

export default async function PortfolioPage({ params }: Props) {
  let profile: GitHubProfile;

  try {
    profile = await fetchGitHubProfile(params.username);
  } catch (err) {
    const error = err as GitHubError;
    if (error.type === "not_found") notFound();
    return <PortfolioError message={error.message} />;
  }

  const repos = await buildRepos(profile, params.username);
  const hasAIEnhancement = repos.some((r) => r.aiEnhanced);
  const isPro = await isUserPro(params.username);

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <PortfolioHero
        profile={profile}
        username={params.username}
        hasAIEnhancement={hasAIEnhancement}
      />
      <ProjectsGrid repos={repos} />
      <PortfolioFooter isPro={isPro} username={params.username} />
      {!isPro && <GoProButton username={params.username} />}
    </div>
  );
}
