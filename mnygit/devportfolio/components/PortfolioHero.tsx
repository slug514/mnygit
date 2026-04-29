"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GitHubProfile } from "@/lib/github";

interface Props {
  profile: GitHubProfile;
  username: string;
  hasAIEnhancement?: boolean;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, spanRef };
}

function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "0.6875rem",
        color: "var(--text-muted)",
        padding: "4px 10px",
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export default function PortfolioHero({ profile, username, hasAIEnhancement }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(id);
  }, []);

  const displayName = profile.name || username;
  const words = displayName.trim().split(/\s+/);
  const hasMultipleWords = words.length > 1;
  const firstName = hasMultipleWords ? words.slice(0, -1).join(" ") : "";
  const lastName = hasMultipleWords ? words[words.length - 1] : words[0];
  const lastNameBody = lastName.slice(0, -1);
  const lastNameEnd = lastName.slice(-1);

  const totalStars = profile.repos.reduce((sum, r) => sum + r.stars, 0);
  const repos = useCountUp(profile.publicRepos || profile.repos.length);
  const stars = useCountUp(totalStars);

  const staggerStyle = (delayMs: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.55s ease-out ${delayMs}ms, transform 0.55s ease-out ${delayMs}ms`,
  });

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "64px 48px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* URL label */}
          <div style={staggerStyle(0)}>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "0.6875rem",
                color: "var(--text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              portfolio.devportfolioquick.com/{username}
            </span>
          </div>

          {/* Name */}
          <div style={staggerStyle(80)}>
            {hasMultipleWords && (
              <div
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontSize: "clamp(3rem, 6vw, 6rem)",
                  lineHeight: 1.0,
                  color: "var(--text-primary)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                {firstName}
              </div>
            )}
            <div
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                fontSize: "clamp(3rem, 6vw, 6rem)",
                lineHeight: 1.0,
                color: "var(--text-primary)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              {lastNameBody}
              <span
                style={{
                  color: "var(--accent)",
                  animation: "blink 1.2s step-end infinite",
                }}
              >
                {lastNameEnd}
              </span>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p
              style={{
                ...staggerStyle(160),
                fontFamily: "var(--font-geist), sans-serif",
                fontSize: "1.0625rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                maxWidth: "480px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {profile.bio}
            </p>
          )}

          {/* AI enhancement indicator */}
          {hasAIEnhancement && (
            <div style={staggerStyle(200)}>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                ✦ descriptions enhanced by AI
              </span>
            </div>
          )}

          {/* Stat pills */}
          <div
            style={{
              ...staggerStyle(240),
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <StatPill>
              <span ref={repos.spanRef} style={{ color: "var(--text-secondary)" }}>
                {repos.value}
              </span>{" "}
              repos
            </StatPill>

            <StatPill>
              <span ref={stars.spanRef} style={{ color: "var(--text-secondary)" }}>
                {stars.value.toLocaleString()}
              </span>{" "}
              stars
            </StatPill>

            {profile.location && (
              <StatPill>{profile.location}</StatPill>
            )}

            <StatPill>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                github.com/{username}
              </a>
            </StatPill>
          </div>

          {/* Action buttons */}
          <div
            style={{
              ...staggerStyle(320),
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-geist), sans-serif",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "12px 24px",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                transition: "border-color 200ms ease-out",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
              }}
            >
              View GitHub →
            </a>

            <button
              disabled
              title="Coming soon"
              style={{
                fontFamily: "var(--font-geist), sans-serif",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "#0E0E10",
                backgroundColor: "var(--accent)",
                border: "none",
                borderRadius: "4px",
                padding: "12px 24px",
                cursor: "not-allowed",
                opacity: 0.45,
                letterSpacing: "-0.01em",
              }}
            >
              Download PDF
            </button>
          </div>

        </div>

        {/* ── Right column — Avatar ── */}
        <div
          style={{
            ...staggerStyle(120),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", width: 260, height: 260 }}>
            {/* Dot grid background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, var(--border-hover) 1.5px, transparent 1.5px)",
                backgroundSize: "20px 20px",
                opacity: 0.7,
              }}
            />
            {/* Avatar */}
            <Image
              src={profile.avatar}
              alt={displayName}
              width={180}
              height={180}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                boxShadow:
                  "0 0 0 3px var(--bg-primary), 0 0 0 6px var(--accent)",
              }}
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
