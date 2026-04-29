"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = ["torvalds", "gvanrossum", "dhh"];

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function parseUsername(raw: string): string {
    const trimmed = raw.trim();
    const match = trimmed.match(/(?:github\.com\/)?@?([a-zA-Z0-9-]+)\/?$/);
    return match ? match[1] : trimmed;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const username = parseUsername(input);
    if (!username) {
      setError("Enter a GitHub username.");
      return;
    }
    router.push(`/generate?username=${encodeURIComponent(username)}`);
  }

  return (
    <main
      style={{ backgroundColor: "var(--bg-primary)" }}
      className="min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Top nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 32px",
          display: "flex",
          justifyContent: "flex-end",
          zIndex: 10,
        }}
      >
        <a
          href="/pricing"
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
            transition: "color 200ms ease-out",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
          }}
        >
          Pricing
        </a>
      </nav>
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8">

        <h1
          className="animate-fade-in-up delay-0"
          style={{
            fontFamily: "var(--font-instrument-serif), serif",
            fontSize: "clamp(2.75rem, 6vw, 5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            fontWeight: 400,
          }}
        >
          Turn your GitHub<br />
          <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
            into a portfolio.
          </span>
        </h1>

        <p
          className="animate-fade-in-up delay-80"
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "1.0625rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            letterSpacing: "-0.01em",
          }}
        >
          30 seconds.&nbsp; Zero design skills.&nbsp; Built for developers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-in-up delay-160 w-full flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder="github.com/yourusername"
            spellCheck={false}
            autoComplete="off"
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              fontSize: "0.9375rem",
              padding: "14px 18px",
              outline: "none",
              transition: "border-color 200ms ease-out, box-shadow 200ms ease-out",
            }}
            className="flex-1 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-muted)]"
          />
          <button
            type="submit"
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              backgroundColor: "var(--accent)",
              color: "#0E0E10",
              borderRadius: "4px",
              fontSize: "0.9375rem",
              fontWeight: 600,
              padding: "14px 28px",
              border: "none",
              cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "background-color 200ms ease-out, transform 200ms ease-out",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Generate →
          </button>
        </form>

        {error && (
          <p
            className="animate-fade-in-up delay-0"
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              color: "#FF6B6B",
              fontSize: "0.875rem",
              marginTop: "-16px",
            }}
          >
            {error}
          </p>
        )}

        <div
          className="animate-fade-in-up delay-240 flex items-center gap-4"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            letterSpacing: "0.01em",
          }}
        >
          {EXAMPLES.map((user, i) => (
            <span key={user} className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/generate?username=${user}`)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "inherit",
                  padding: 0,
                  transition: "color 200ms ease-out",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              >
                {user}
              </button>
              {i < EXAMPLES.length - 1 && (
                <span style={{ color: "var(--border-hover)" }}>/</span>
              )}
            </span>
          ))}
        </div>

      </div>
    </main>
  );
}
