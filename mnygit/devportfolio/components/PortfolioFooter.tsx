"use client";

interface PortfolioFooterProps {
  isPro: boolean;
  username?: string;
}

export default function PortfolioFooter({ isPro, username = "" }: PortfolioFooterProps) {
  const isProUser = isPro === true;

  if (isProUser) {
    return (
      <footer
        style={{
          padding: "24px",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            color: "var(--text-muted)",
            letterSpacing: "0.02em",
          }}
        >
          ✦ devportfolioquick.com
        </span>
      </footer>
    );
  }

  return (
    <footer
      style={{
        padding: "24px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "12px",
          color: "var(--text-muted)",
          letterSpacing: "0.02em",
        }}
      >
        Built with DevPortfolio Quick
      </span>
      <a
        href={username ? `/pricing?username=${encodeURIComponent(username)}` : "/pricing"}
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "12px",
          color: "var(--accent)",
          textDecoration: "none",
        }}
      >
        Get yours →
      </a>
    </footer>
  );
}
