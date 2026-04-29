"use client";

import { useState, useEffect } from "react";

interface GoProButtonProps {
  username: string;
}

export default function GoProButton({ username }: GoProButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gopro-btn {
          animation: slide-up 300ms ease-out forwards;
          transition: background-color 200ms ease-out, transform 200ms ease-out;
        }
        .gopro-btn:hover {
          background-color: rgba(212,255,61,0.08) !important;
          transform: translateY(-1px);
        }
      `}</style>

      {visible && (
        <a
          href={`/pricing?username=${encodeURIComponent(username)}`}
          className="gopro-btn"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            backgroundColor: "transparent",
            borderRadius: "4px",
            padding: "8px 16px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.02em",
            zIndex: 50,
          }}
        >
          ✦ Go Pro — $9
        </a>
      )}
    </>
  );
}
