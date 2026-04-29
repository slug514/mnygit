"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const FEATURES = [
  "Remove DevPortfolio branding",
  "Export portfolio as PDF",
  "Priority AI description generation",
  "Custom domain setup guide",
  "All future premium themes included",
  "Lifetime updates, no extra charge",
];

function PricingCard() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      // Step 1: obtain a CSRF token (also sets the httpOnly cookie)
      const csrfRes = await fetch("/api/csrf", { credentials: "include" });
      const { csrfToken } = await csrfRes.json();

      // Step 2: POST with the token in the header — browser sends the cookie automatically
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1)" : "scale(0.97)",
        transition: "opacity 400ms ease-out, transform 400ms ease-out",
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "48px",
        maxWidth: "420px",
        width: "100%",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ color: "var(--accent)" }}>●</span>
        PRO
      </div>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-instrument-serif), serif",
            fontSize: "96px",
            lineHeight: 1,
            color: "var(--text-primary)",
            fontWeight: 400,
          }}
        >
          $9
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "16px",
            color: "var(--text-muted)",
            paddingBottom: "14px",
          }}
        >
          .00 USD
        </span>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          fontSize: "15px",
          color: "var(--text-secondary)",
          textAlign: "center",
          marginBottom: "0",
        }}
      >
        Yours forever. No subscription. No expiry.
      </p>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          backgroundColor: "var(--border)",
          margin: "24px 0",
        }}
      />

      {/* Features */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {FEATURES.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-geist), sans-serif",
              fontSize: "15px",
              color: "var(--text-secondary)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--accent)",
                flexShrink: 0,
              }}
            >
              ✦
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          backgroundColor: "var(--border)",
          margin: "24px 0",
        }}
      />

      {/* CTA */}
      <style>{`
        @keyframes pulse-lime {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,255,61,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(212,255,61,0); }
        }
        .pro-btn {
          animation: pulse-lime 2s infinite;
          transition: background-color 200ms ease-out, transform 200ms ease-out;
        }
        .pro-btn:hover:not(:disabled) {
          background-color: var(--accent-hover) !important;
          transform: translateY(-1px);
          animation: none;
        }
        .pro-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="pro-btn"
        style={{
          width: "100%",
          height: "48px",
          borderRadius: "4px",
          backgroundColor: "var(--accent)",
          color: "var(--bg-primary)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "14px",
          fontWeight: 600,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: "0.01em",
        }}
      >
        {loading ? "Creating checkout..." : "Get Pro — $9 →"}
      </button>

      {error && (
        <p
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "13px",
            color: "#FF6B6B",
            textAlign: "center",
            marginTop: "12px",
          }}
        >
          {error}
        </p>
      )}

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          color: "var(--text-muted)",
          textAlign: "center",
          marginTop: "12px",
          letterSpacing: "0.01em",
        }}
      >
        🔒 Secured by Lemon Squeezy · No account needed
      </p>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-primary)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "13px",
            color: "var(--accent)",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          DevPortfolio
        </a>
        <span
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            cursor: "not-allowed",
          }}
        >
          Sign in
        </span>
      </nav>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <Suspense fallback={<div />}>
          <PricingCard />
        </Suspense>
      </main>
    </div>
  );
}
