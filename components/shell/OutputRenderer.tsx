"use client";

import { Output } from "./useTerminal";
import TypedOutput from "./TypedOutput";

type Props = {
  outputs: Output[];
  onUpdate?: () => void;
};

export default function OutputRenderer({ outputs, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      {outputs.map((output, i) => {
        const isLatest = i === outputs.length - 1;
        return (
          <div key={i} className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
            <p className="mb-2" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: "var(--accent)" }}>&gt;</span> {output.command}
            </p>
            <div>
              {isLatest && output.plainText ? (
                <TypedOutput
                  content={output.content}
                  plainText={output.plainText}
                  onUpdate={onUpdate}
                />
              ) : (
                output.content
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
