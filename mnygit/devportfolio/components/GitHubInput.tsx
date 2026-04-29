"use client";

// Reusable GitHub username input — used on landing and generate pages
interface GitHubInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function GitHubInput({ value, onChange, onSubmit, loading }: GitHubInputProps) {
  return (
    <div className="flex gap-3 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder="github.com/yourusername"
        spellCheck={false}
        autoComplete="off"
        disabled={loading}
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          fontSize: "0.9375rem",
          padding: "14px 18px",
          outline: "none",
          flex: 1,
          transition: "border-color 200ms ease-out, box-shadow 200ms ease-out",
          opacity: loading ? 0.6 : 1,
        }}
        className="placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-muted)]"
      />
      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          backgroundColor: "var(--accent)",
          color: "#0E0E10",
          borderRadius: "4px",
          fontSize: "0.9375rem",
          fontWeight: 600,
          padding: "14px 28px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "background-color 200ms ease-out, transform 200ms ease-out",
        }}
      >
        {loading ? "Loading..." : "Generate →"}
      </button>
    </div>
  );
}
