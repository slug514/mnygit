"use client";

import { Repo } from "@/lib/github";
import ProjectCard from "./ProjectCard";

interface Props {
  repos: Repo[];
}

function getColSpan(index: number, total: number): boolean {
  if (index === 0) return true;
  if (index === total - 1 && (total - 1) % 2 === 1) return true;
  return false;
}

export default function ProjectsGrid({ repos }: Props) {
  if (repos.length === 0) return null;

  return (
    <section style={{ padding: "96px 48px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Section label */}
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "0.6875rem",
            color: "var(--text-muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          Selected Work
        </div>

        {/* Asymmetric grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }}
        >
          {repos.map((repo, i) => (
            <ProjectCard
              key={repo.name}
              repo={repo}
              index={i}
              colSpan2={getColSpan(i, repos.length)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
