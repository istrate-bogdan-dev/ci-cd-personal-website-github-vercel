// components/commands/about.tsx
import { registerCommand } from "./index";

function AboutOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /about</p>
      <p style={{ color: "var(--border)" }}>{"─".repeat(42)}</p>
      <p style={{ color: "var(--text-primary)" }}>
        Cloud Engineer &amp; DevOps practitioner focused on
      </p>
      <p style={{ color: "var(--text-primary)" }}>
        scalable infrastructure, security, and automation.
      </p>
      <p></p>
      <p style={{ color: "var(--text-primary)" }}>
        Dual background: Computer Science + Economic Sciences —
      </p>
      <p style={{ color: "var(--text-primary)" }}>
        I understand both the technical stack and the business context.
      </p>
      <p></p>
      <p style={{ color: "var(--accent)" }}>
        Philosophy: cost-aware, security-first, observable infrastructure.
      </p>
      <p style={{ color: "var(--border)" }}>{"─".repeat(42)}</p>
    </div>
  );
}

registerCommand("/about", {
  description: "Who is Bogdan Istrate?",
  handler: () => <AboutOutput />,
});
