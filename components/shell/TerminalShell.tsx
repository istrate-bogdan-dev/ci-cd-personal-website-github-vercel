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

  // registryRef is stable — registry object never changes after module init
  const runCommand = useCallback(
    (command: string) => {
      const entry = registry[command];
      if (entry) {
        // Pass a stable executor so /help clickable commands work
        dispatch({
          type: "SUBMIT",
          command,
          content: entry.handler((cmd: string) => {
            const inner = registry[cmd];
            if (inner) {
              dispatch({
                type: "SUBMIT",
                command: cmd,
                content: inner.handler(),
              });
            }
          }),
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
      onSubmit={runCommand}
    />
  );
}
