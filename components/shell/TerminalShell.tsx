// components/shell/TerminalShell.tsx
"use client";

import { useCallback } from "react";
import { useTerminal } from "./useTerminal";
import BootScreen from "./BootScreen";
import TerminalWindow from "./TerminalWindow";
import { registry } from "@/components/commands/registry";

export default function TerminalShell() {
  const { state, dispatch } = useTerminal();

  const handleBootComplete = useCallback(() => {
    dispatch({ type: "BOOT_COMPLETE" });
  }, [dispatch]);

  const handleInputChange = useCallback(
    (value: string) => {
      dispatch({ type: "TYPE", value });
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    (command: string) => {
      const entry = registry[command];
      if (entry) {
        dispatch({
          type: "SUBMIT",
          command,
          content: entry.handler(handleSubmit),
        });
      } else {
        dispatch({
          type: "SUBMIT",
          command,
          content: (
            <p style={{ color: "var(--text-muted)" }}>
              command not found:{" "}
              <span style={{ color: "var(--accent)" }}>{command}</span>
              {" "}— try{" "}
              <span style={{ color: "var(--accent)" }}>/help</span>
            </p>
          ),
        });
      }
    },
    [dispatch]
  );

  if (!state.booted) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <TerminalWindow
      outputs={state.outputs}
      input={state.input}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
}
