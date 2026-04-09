"use client";

import { useRef, useEffect } from "react";
import { TerminalMode } from "./useTerminal";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  mode?: TerminalMode;
  disabled?: boolean;
};

export default function CommandInput({ value, onChange, onSubmit, mode = "IDLE", disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on input so user can type immediately
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Refocus after loading finishes (disabled → enabled transition)
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const trimmed = value.trim();
      if (trimmed) onSubmit(trimmed);
    }
  }

  const placeholder =
    mode === "CHAT_MODE"
      ? "Type a message... (/exit to leave)"
      : "Type a command... try /help";

  return (
    <div
      className="flex items-center px-6 py-4 border-t"
      style={{ borderColor: "var(--border)" }}
      onClick={() => !disabled && inputRef.current?.focus()}
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
        disabled={disabled}
        className="flex-1 bg-transparent outline-none font-mono text-base"
        style={{
          color: disabled ? "var(--text-muted)" : "var(--text-primary)",
          caretColor: "var(--accent)",
          opacity: disabled ? 0.5 : 1,
        }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={placeholder}
      />
      {disabled && (
        <span
          className="font-mono text-xs ml-2"
          style={{ color: "var(--text-muted)" }}
        >
          ●●●
        </span>
      )}
    </div>
  );
}
