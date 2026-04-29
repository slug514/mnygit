"use client";

import { useEffect, useRef, useState } from "react";
import { Repo } from "@/lib/github";

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  Python:     "#3572A5",
  Go:         "#00ADD8",
  Rust:       "#CE4A00",
  Ruby:       "#701516",
  Java:       "#B07219",
  "C":        "#555555",
  "C++":      "#F34B7D",
  "C#":       "#178600",
  PHP:        "#4F5D95",
  Swift:      "#FA7343",
  Kotlin:     "#7F52FF",
  Dart:       "#00B4AB",
  Shell:      "#89E051",
  Bash:       "#89E051",
  HTML:       "#E34C26",
  CSS:        "#563D7C",
  Vue:        "#41B883",
  Svelte:     "#FF3E00",
  Elixir:     "#6E4A7E",
  Scala:      "#DC322F",
  R:          "#198CE7",
  Lua:        "#000080",
};

interface Props {
  repo: Repo;
  index: number;
  colSpan2?: boolean;
}

export default function ProjectCard({ repo, index, colSpan2 }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "var(--text-muted)") : null;

  return (
    <div
      ref={ref}
      className="project-card"
      style={{
        position: "relative",
        gridColumn: colSpan2 ? "span 2" : undefined,
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease-out ${index * 60}ms, transform 0.5s ease-out ${index * 60}ms`,
      }}
    >
      {/* AI-enhanced indicator */}
      {repo.aiEnhanced && (
        <span
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            fontWeight: 500,
            color: "var(--text-muted)",
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "2px 6px",
            letterSpacing: "0.06em",
            userSelect: "none",
          }}
        >
          ✦ AI
        </span>
      )}

      {/* Language badge */}
      {repo.language && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: langColor ?? "var(--text-muted)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {repo.language}
          </span>
        </div>
      )}

      {/* Repo name */}
      <h3
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          fontSize: colSpan2 ? "1.125rem" : "1rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          paddingRight: repo.aiEnhanced ? "44px" : 0,
        }}
      >
        {repo.name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: colSpan2 ? 3 : 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {repo.description ?? "No description provided."}
      </p>

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "4px",
          paddingTop: "12px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ color: "#FEBC2E" }}>★</span>
          {repo.stars.toLocaleString()}
        </span>

        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "var(--accent)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
            transition: "color 200ms ease-out",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
          }}
        >
          View repo →
        </a>
      </div>
    </div>
  );
}
