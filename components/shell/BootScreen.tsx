// components/shell/BootScreen.tsx
"use client";

import { useState, useEffect } from "react";

const BOOT_LINES = [
  "Initializing system...",
  "Loading modules: [aws] [k8s] [terraform] [cicd] ✓",
  "Mounting portfolio v2.0...",
  "[████████████████████] done",
  "",
  "bogdan@cloud ~ ready",
  "Press Enter to continue...",
];

type Props = {
  onComplete: () => void;
};

export default function BootScreen({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    function showNext() {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i];
        i++;
        setVisibleLines((prev) => [...prev, line]);
        setTimeout(showNext, line === "" ? 80 : 220);
      } else {
        setDone(true);
      }
    }
    const t = setTimeout(showNext, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!done) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Enter") onComplete();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [done, onComplete]);

  return (
    <div
      className="bg-animated flex items-center justify-center min-h-screen"
      onClick={done ? onComplete : undefined}
      style={{ cursor: done ? "pointer" : "default" }}
    >
      <div className="max-w-xl w-full px-6">
        {visibleLines.map((line, i) => (
          <p
            key={i}
            className="font-mono text-sm mb-1"
            style={{
              color:
                line.startsWith("Press") || line.startsWith("bogdan@cloud")
                  ? "var(--accent)"
                  : line.startsWith("[████")
                  ? "var(--text-secondary)"
                  : "var(--text-primary)",
            }}
          >
            {line || "\u00A0"}
          </p>
        ))}
        {done && (
          <span className="cursor-blink text-sm">▌</span>
        )}
      </div>
    </div>
  );
}
