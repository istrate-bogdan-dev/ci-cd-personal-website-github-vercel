// components/shell/TerminalWindow.tsx
"use client";

import { useRef, useEffect } from "react";
import { Output } from "./useTerminal";
import CommandInput from "./CommandInput";
import OutputRenderer from "./OutputRenderer";

const ASCII_BANNER = `
 ____   ___   ____ ____    _    _   _
| __ ) / _ \\ / ___|  _ \\  / \\  | \\ | |
|  _ \\| | | | |  _| | | |/ _ \\ |  \\| |
| |_) | |_| | |_| | |_| / ___ \\| |\\  |
|____/ \\___/ \\____|____/_/   \\_\\_| \\_|

 ___ ____ _____ ____    _  _____ _____
|_ _/ ___|_   _|  _ \\  / \\|_   _| ____|
 | |\\___ \\ | | | |_) |/ _ \\ | | |  _|
 | | ___) || | |  _ // ___ \\| | | |___
|___|____/ |_| |_| \\_\\_/   \\_|_| |_____|`.trim();

function HeroContent() {
  return (
    <div className="mb-6">
      {/* ASCII banner — hidden on mobile */}
      <pre
        className="hidden sm:block text-xs leading-tight mb-4"
        style={{ color: "var(--accent)" }}
      >
        {ASCII_BANNER}
      </pre>
      {/* Mobile fallback */}
      <p
        className="sm:hidden text-xl font-bold mb-4"
        style={{ color: "var(--accent)" }}
      >
        BOGDAN ISTRATE
      </p>

      <p style={{ color: "var(--text-primary)" }} className="mb-1">
        Cloud Engineer · DevOps · DevSecOps
      </p>
      <p style={{ color: "var(--text-secondary)" }} className="mb-4">
        Bucharest, Romania · Open to remote
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {["AWS Certified", "Terraform", "Kubernetes", "Docker", "GitHub Actions"].map(
          (tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded"
              style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
            >
              {tag}
            </span>
          )
        )}
      </div>

      <p style={{ color: "var(--text-muted)" }} className="text-sm">
        Type{" "}
        <span style={{ color: "var(--accent)" }}>/help</span>
        {" "}to see all available commands.
      </p>
      <p style={{ color: "var(--text-muted)" }} className="text-sm">
        Try{" "}
        <span style={{ color: "var(--accent)" }}>/deploy</span>
        {" "}for a surprise.
      </p>
    </div>
  );
}

type Props = {
  outputs: Output[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export default function TerminalWindow({
  outputs,
  input,
  onInputChange,
  onSubmit,
}: Props) {
  const outputEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest output
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputs]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-animated">
      <div
        className="w-full rounded-lg overflow-hidden"
        style={{
          maxWidth: "800px",
          background: "var(--bg-glass)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center px-4 py-3 border-b"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
        >
          {/* Traffic lights — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 mr-4">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          </div>
          <span
            className="text-xs mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            bogdan@cloud ~ /portfolio
          </span>
        </div>

        {/* Body */}
        <div
          className="px-4 py-6 overflow-y-auto"
          style={{ maxHeight: "70vh" }}
        >
          <HeroContent />
          <OutputRenderer outputs={outputs} />
          <div ref={outputEndRef} />
        </div>

        {/* Input bar */}
        <CommandInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
