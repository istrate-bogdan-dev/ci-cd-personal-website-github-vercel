"use client";

import { useRef, useState } from "react";
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
  const historyRef = useRef<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Saves the in-progress input when navigating history
  const draftRef = useRef("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const trimmed = value.trim();
      if (trimmed) {
        historyRef.current = [trimmed, ...historyRef.current].slice(0, 50);
        setHistoryIndex(-1);
        draftRef.current = "";
        onSubmit(trimmed);
        inputRef.current?.blur();
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const history = historyRef.current;
      if (history.length === 0) return;
      if (historyIndex === -1) draftRef.current = value;
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      onChange(history[next]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        onChange(draftRef.current);
        return;
      }
      const next = historyIndex - 1;
      setHistoryIndex(next);
      onChange(historyRef.current[next]);
      return;
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
        onChange={(e) => {
          setHistoryIndex(-1);
          onChange(e.target.value);
        }}
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
