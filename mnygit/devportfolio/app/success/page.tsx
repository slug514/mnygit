"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

function SuccessContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      colors: ["#D4FF3D", "#FAFAF9", "#4ADE80"],
      origin: { y: 0.6 },
    });
  }, []);

  const tweetText = encodeURIComponent(
    `Just turned my GitHub into a portfolio in 30s with DevPortfolio Quick ✦\ndevportfolioquick.com/${username}`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "24px",
        maxWidth: "520px",
        width: "100%",
      }}
    >
      {/* Animated star */}
      <style>{`
        @keyframes star-in {
          0%   { opacity: 0; transform: scale(0.4); }
          60%  { opacity: 1; transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes star-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
        .success-star {
          animation: star-in 600ms ease-out forwards,
                     star-pulse 2.4s ease-in-out 600ms infinite;
        }
      `}</style>

      <span
        className="success-star"
        style={{
          fontSize: "64px",
          color: "var(--accent)",
          display: "block",
          marginBottom: "32px",
          opacity: 0,
        }}
      >
        ✦
      </span>

      <h1
        style={{
          fontFamily: "var(--font-instrument-serif), serif",
          fontSize: "clamp(2.5rem, 6vw, 3rem)",
          lineHeight: 1.1,
          color: "var(--text-primary)",
          fontWeight: 400,
          marginBottom: "16px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 400ms ease-out 200ms, transform 400ms ease-out 200ms",
        }}
      >
        You're Pro now.
      </h1>

      <p
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          fontSize: "16px",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: "40px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 400ms ease-out 350ms, transform 400ms ease-out 350ms",
        }}
      >
        Branding removed. PDF export unlocked.
        <br />
        Your portfolio is ready.
        <br />
        <span
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            display: "block",
            marginTop: "10px",
          }}
        >
          Pro features activate within 30 seconds. Refresh your
          portfolio if branding is still showing.
        </span>
      </p>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "320px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 400ms ease-out 500ms, transform 400ms ease-out 500ms",
        }}
      >
        <a
          href={username ? `/portfolio/${username}` : "/"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "48px",
            borderRadius: "4px",
            backgroundColor: "var(--accent)",
            color: "var(--bg-primary)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "0.01em",
            transition: "background-color 200ms ease-out, transform 200ms ease-out",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-hover)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
          }}
        >
          View My Portfolio →
        </a>

        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "48px",
            borderRadius: "4px",
            backgroundColor: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.01em",
            transition: "border-color 200ms ease-out, transform 200ms ease-out",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
          }}
        >
          Share on X →
        </a>
      </div>

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          color: "var(--text-muted)",
          marginTop: "24px",
          letterSpacing: "0.01em",
          opacity: mounted ? 1 : 0,
          transition: "opacity 400ms ease-out 700ms",
        }}
      >
        Receipt sent to your email · Powered by Lemon Squeezy
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main
      style={{
        backgroundColor: "var(--bg-primary)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Suspense fallback={<div />}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
