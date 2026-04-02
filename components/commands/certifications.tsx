// components/commands/certifications.tsx
import { registerCommand } from "./index";

function CertificationsOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /certifications</p>
      <p>
        <span style={{ color: "var(--accent)" }}>✓</span>
        <span style={{ color: "var(--text-primary)", marginLeft: "8px" }}>
          AWS Certified Solutions Architect – Associate (SAA-C03)
        </span>
      </p>
      <p>
        <span style={{ color: "var(--text-muted)" }}>○</span>
        <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>
          [ next certification — in progress ]
        </span>
      </p>
    </div>
  );
}

registerCommand("/certifications", {
  description: "Certifications & credentials",
  handler: () => <CertificationsOutput />,
});
