// components/commands/logs.tsx
import { registerCommand } from "./index";

type LogEntryProps = {
  period: string;
  role: string;
  company: string;
  bullets: string[];
};

function LogEntry({ period, role, company, bullets }: LogEntryProps) {
  return (
    <div className="mb-3">
      <p>
        <span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px", fontSize: "12px" }}>
          {period}
        </span>
        <span style={{ color: "var(--accent)", fontWeight: "bold" }}>{role}</span>
        <span style={{ color: "var(--text-muted)" }}> @ {company}</span>
      </p>
      {bullets.map((b, i) => (
        <p key={i} style={{ color: "var(--text-primary)", paddingLeft: "128px" }}>
          <span style={{ color: "var(--text-muted)" }}>▸ </span>{b}
        </p>
      ))}
    </div>
  );
}

function LogsOutput() {
  return (
    <div>
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /logs --experience</p>
      <div className="mt-2">
        <LogEntry
          period="2024–present"
          role="Cloud Engineer"
          company="[Company]"
          bullets={[
            "Infrastructure as Code with Terraform",
            "CI/CD pipelines on GitHub Actions",
          ]}
        />
        <LogEntry
          period="2022–2024"
          role="DevOps Engineer"
          company="[Company]"
          bullets={[
            "Kubernetes cluster management",
            "AWS cost optimization -30%",
          ]}
        />
      </div>
    </div>
  );
}

registerCommand("/logs", {
  description: "Experience timeline",
  handler: () => <LogsOutput />,
});
