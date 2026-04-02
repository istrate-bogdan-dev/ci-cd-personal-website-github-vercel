"use client";

import { useRef, useEffect } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export default function CommandInput({ value, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on input so user can type immediately
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const trimmed = value.trim();
      if (trimmed) onSubmit(trimmed);
    }
  }

  return (
    <div
      className="flex items-center px-6 py-4 border-t"
      style={{ borderColor: "var(--border)" }}
      onClick={() => inputRef.current?.focus()}
    >
      <span style={{ color: "var(--accent)", marginRight: "8px", userSelect: "none" }}>
        &gt;
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none font-mono text-base"
        style={{ color: "var(--text-primary)", caretColor: "var(--accent)" }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Type a command... try /help"
      />
    </div>
  );
}
