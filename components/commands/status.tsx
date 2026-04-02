// components/commands/status.tsx
import { registerCommand } from "./index";

function StatusOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /status</p>
      {[
        ["open_to_work:", "true"],
        ["availability:", "immediately"],
        ["preferred:", "remote / hybrid"],
        ["location:", "Bucharest, Romania"],
      ].map(([key, val]) => (
        <p key={key}>
          <span style={{ color: "var(--text-muted)", display: "inline-block", width: "140px" }}>
            {key}
          </span>
          <span style={{ color: key === "open_to_work:" ? "var(--accent)" : "var(--text-primary)" }}>
            {val}
          </span>
        </p>
      ))}
    </div>
  );
}

registerCommand("/status", {
  description: "Availability status",
  handler: () => <StatusOutput />,
});
