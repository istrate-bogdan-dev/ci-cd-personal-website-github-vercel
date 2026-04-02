"use client";

import { Output } from "./useTerminal";

type Props = {
  outputs: Output[];
};

export default function OutputRenderer({ outputs }: Props) {
  return (
    <div className="space-y-4">
      {outputs.map((output, i) => (
        <div key={i} className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
          <p className="mb-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: "var(--accent)" }}>&gt;</span> {output.command}
          </p>
          <div className="text-sm">{output.content}</div>
        </div>
      ))}
    </div>
  );
}
