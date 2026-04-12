"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type Props = {
  content: ReactNode;
  plainText: string;
  onUpdate?: () => void;
};

// Animates plainText character by character, then swaps in the real JSX content
export default function TypedOutput({ content, plainText, onUpdate }: Props) {
  const [phase, setPhase] = useState<"typing" | "done">("typing");
  const [displayed, setDisplayed] = useState("");
  const iRef = useRef(0);

  useEffect(() => {
    iRef.current = 0;
    setDisplayed("");
    setPhase("typing");

    const interval = setInterval(() => {
      iRef.current++;
      const next = plainText.slice(0, iRef.current);
      setDisplayed(next);
      onUpdate?.();
      if (iRef.current >= plainText.length) {
        clearInterval(interval);
        setPhase("done");
        onUpdate?.();
      }
    }, 18);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plainText]);

  if (phase === "done") {
    return <>{content}</>;
  }

  return (
    <pre
      style={{
        fontFamily: "inherit",
        fontSize: "inherit",
        color: "var(--text-primary)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        margin: 0,
      }}
    >
      {displayed}
      <span style={{ color: "var(--accent)" }}>▌</span>
    </pre>
  );
}
