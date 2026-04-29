"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GitHubProfile } from "@/lib/github";

interface Line {
  text: string;
  color: string;
  large?: boolean;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function getStaticLines(username: string): Line[] {
  return [
    { text: `$ fetching github.com/${username}...`, color: "var(--text-secondary)" },
    { text: "✓ profile loaded", color: "#4ADE80" },
  ];
}

function getDynamicLines(profile: GitHubProfile): Line[] {
  return [
    { text: `✓ ${profile.repos.length} repositories found`, color: "#4ADE80" },
    {
      text: profile.readme ? "✓ README detected" : "○ no README found",
      color: profile.readme ? "#4ADE80" : "var(--text-muted)",
    },
    { text: "⚡ generating portfolio...", color: "var(--accent)", large: true },
  ];
}

function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";

  const [completedLines, setCompletedLines] = useState<Line[]>([]);
  const [activeLine, setActiveLine] = useState<Line | null>(null);
  const [activeText, setActiveText] = useState("");
  const [showWaitCursor, setShowWaitCursor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const fetchDataRef = useRef<GitHubProfile | null>(null);
  const fetchDoneRef = useRef(false);
  const fetchErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!username) {
      router.push("/");
      return;
    }

    mountedRef.current = true;
    fetchDoneRef.current = false;
    fetchDataRef.current = null;
    fetchErrorRef.current = null;

    // Kick off server-side fetch (via API route) in parallel with animation.
    // Must go through the API route — fetchGitHubProfile uses a server-only
    // env var (GITHUB_TOKEN) that is never exposed to the browser.
    fetch(`/api/github/${encodeURIComponent(username)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          fetchErrorRef.current = data.error ?? "Something went wrong.";
        } else {
          fetchDataRef.current = data as GitHubProfile;
        }
        fetchDoneRef.current = true;
      })
      .catch(() => {
        fetchErrorRef.current = "Network error. Please try again.";
        fetchDoneRef.current = true;
      });

    const startTime = Date.now();

    async function typeLine(line: Line, prev: Line[]): Promise<Line[]> {
      if (!mountedRef.current) return prev;
      setActiveLine(line);
      setActiveText("");
      for (let i = 1; i <= line.text.length; i++) {
        if (!mountedRef.current) return prev;
        setActiveText(line.text.slice(0, i));
        await sleep(28);
      }
      if (!mountedRef.current) return prev;
      const next = [...prev, line];
      setCompletedLines(next);
      setActiveLine(null);
      setActiveText("");
      return next;
    }

    async function run() {
      let completed: Line[] = [];

      // Phase 1: type static lines
      for (const line of getStaticLines(username)) {
        if (!mountedRef.current) return;
        completed = await typeLine(line, completed);
        await sleep(380);
      }

      // Phase 2: wait for fetch + enforce 2.5s minimum
      setShowWaitCursor(true);
      while (!fetchDoneRef.current && mountedRef.current) {
        await sleep(80);
      }
      const elapsed = Date.now() - startTime;
      if (elapsed < 2500) await sleep(2500 - elapsed);
      if (!mountedRef.current) return;
      setShowWaitCursor(false);

      // Handle error
      if (fetchErrorRef.current) {
        setError(fetchErrorRef.current);
        return;
      }
      if (!fetchDataRef.current || !mountedRef.current) return;

      // Phase 3: type dynamic lines with real data
      for (const line of getDynamicLines(fetchDataRef.current)) {
        if (!mountedRef.current) return;
        completed = await typeLine(line, completed);
        await sleep(350);
      }

      await sleep(500);
      if (mountedRef.current) {
        router.push(`/portfolio/${username}`);
      }
    }

    run();

    return () => {
      mountedRef.current = false;
    };
  }, [username, router]);

  if (!username) return null;

  return (
    <main
      style={{ backgroundColor: "var(--bg-primary)" }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          boxShadow: "0 0 40px rgba(212, 255, 61, 0.08)",
          width: "100%",
          maxWidth: "580px",
          overflow: "hidden",
        }}
      >
        {/* Terminal title bar */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((color) => (
              <div
                key={color}
                style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color }}
              />
            ))}
          </div>
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              letterSpacing: "0.02em",
            }}
          >
            generating portfolio...
          </span>
        </div>

        {/* Terminal body */}
        <div
          style={{
            padding: "24px 24px 32px",
            minHeight: "220px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            lineHeight: 1.75,
          }}
        >
          {/* Fully typed lines */}
          {completedLines.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.color,
                fontSize: line.large ? "1rem" : "0.875rem",
                fontWeight: line.large ? 500 : 400,
              }}
            >
              {line.text}
            </div>
          ))}

          {/* Currently typing line */}
          {activeLine && (
            <div
              style={{
                color: activeLine.color,
                fontSize: activeLine.large ? "1rem" : "0.875rem",
                fontWeight: activeLine.large ? 500 : 400,
              }}
            >
              {activeText}
              <span style={{ color: "var(--accent)", animation: "blink 0.8s step-end infinite" }}>
                █
              </span>
            </div>
          )}

          {/* Waiting cursor between static and dynamic phases */}
          {showWaitCursor && !activeLine && (
            <div>
              <span style={{ color: "var(--accent)", animation: "blink 0.8s step-end infinite" }}>
                █
              </span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  color: "#FF6B6B",
                  fontSize: "0.875rem",
                  marginBottom: "16px",
                }}
              >
                ✗ {error}
              </div>
              <button
                onClick={() => router.push("/")}
                style={{
                  fontFamily: "var(--font-geist), sans-serif",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  transition: "border-color 200ms ease-out",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                }}
              >
                ← try another username
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <main
          style={{ backgroundColor: "var(--bg-primary)" }}
          className="min-h-screen flex items-center justify-center"
        >
          <span style={{ color: "var(--accent)", animation: "blink 0.8s step-end infinite", fontSize: "1.5rem" }}>
            █
          </span>
        </main>
      }
    >
      <GenerateContent />
    </Suspense>
  );
}
