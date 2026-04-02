// components/commands/deploy.tsx
import { registerCommand } from "./index";

function DeployOutput() {
  const lines = [
    { text: "Initializing deployment sequence...", color: "var(--text-secondary)" },
    { text: "► kubectl apply -f bogdan-istrate.yaml", color: "var(--text-primary)" },
    { text: "► Pod/bogdan-istrate created", color: "var(--text-primary)" },
    { text: "► Readiness probe: PASSING", color: "var(--accent)" },
    { text: "► Health check:    PASSING", color: "var(--accent)" },
    { text: "✓ bogdan@cloud deployed successfully. 🚀", color: "var(--accent)" },
    { text: "  Ready to handle production traffic.", color: "var(--text-primary)" },
  ];

  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /deploy</p>
      <p></p>
      {lines.map((line, i) => (
        <p key={i} style={{ color: line.color }}>
          {line.text}
        </p>
      ))}
    </div>
  );
}

registerCommand("/deploy", {
  description: "...",
  handler: () => <DeployOutput />,
});
