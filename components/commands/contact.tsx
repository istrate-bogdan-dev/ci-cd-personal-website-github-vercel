// components/commands/contact.tsx
import { registerCommand } from "./index";

function ContactOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /contact</p>
      {[
        ["email:", "istratebogdancosmin@gmail.com", "mailto:istratebogdancosmin@gmail.com"],
        ["github:", "github.com/istrate-bogdan-dev", "https://github.com/istrate-bogdan-dev"],
        ["linkedin:", "linkedin.com/in/bogdan-cosmin-istrate", "https://www.linkedin.com/in/bogdan-cosmin-istrate"],
      ].map(([key, label, href]) => (
        <p key={key}>
          <span style={{ color: "var(--text-muted)", display: "inline-block", width: "100px" }}>
            {key}
          </span>
          <a
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
            className="hover:underline"
          >
            {label}
          </a>
        </p>
      ))}
    </div>
  );
}

registerCommand("/contact", {
  description: "Get in touch",
  handler: () => <ContactOutput />,
});
