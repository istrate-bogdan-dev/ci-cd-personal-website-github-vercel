// components/commands/help.tsx
import { registerCommand, registry } from "./index";

function HelpOutput() {
  // Read registry at render time so /help always reflects current commands
  const entries = Object.entries(registry).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /help</p>
      <p></p>
      <p style={{ color: "var(--text-primary)" }}>Available commands:</p>
      <p></p>
      {entries.map(([name, { description }]) => (
        <p key={name}>
          <span style={{ color: "var(--accent)", display: "inline-block", width: "200px" }}>
            {name}
          </span>
          <span style={{ color: "var(--text-secondary)" }}>{description}</span>
        </p>
      ))}
      <p></p>
      <p style={{ color: "var(--text-muted)" }}>Type any command to get started.</p>
    </div>
  );
}

registerCommand("/help", {
  description: "List all available commands",
  handler: () => <HelpOutput />,
});
