// components/shell/TerminalShell.tsx
"use client";

import { useCallback, useEffect } from "react";
import { useTerminal } from "./useTerminal";
import { useChatSession } from "@/components/chat/useChatSession";
import BootScreen from "./BootScreen";
import TerminalWindow from "./TerminalWindow";
import { registry } from "@/components/commands/registry";

export default function TerminalShell() {
  const { state, dispatch } = useTerminal();
  const { isLoading, startSession, stopSession, sendMessage } = useChatSession();

  const handleBootComplete = useCallback(() => {
    dispatch({ type: "BOOT_COMPLETE" });
  }, [dispatch]);

  const handleInputChange = useCallback(
    (value: string) => {
      dispatch({ type: "TYPE", value });
    },
    [dispatch]
  );

  // Start/stop inactivity timer when entering/exiting CHAT_MODE
  useEffect(() => {
    if (state.mode === "CHAT_MODE" && state.sessionId) {
      startSession({
        sessionId: state.sessionId,
        onAgentReply: (text) => dispatch({ type: "CHAT_ADD_AGENT_MESSAGE", text }),
        onInactivityExit: (message) =>
          dispatch({ type: "CHAT_ADD_AGENT_MESSAGE", text: message }),
        onExit: () => dispatch({ type: "EXIT_CHAT" }),
      });
    } else {
      stopSession();
    }
  }, [state.mode, state.sessionId, startSession, stopSession, dispatch]);

  // registryRef is stable — registry object never changes after module init
  const runCommand = useCallback(
    (command: string) => {
      if (state.mode === "CHAT_MODE") {
        if (command === "/exit") {
          stopSession();
          dispatch({ type: "EXIT_CHAT" });
        } else {
          dispatch({ type: "CHAT_ADD_USER_MESSAGE", text: command });
          sendMessage(command);
        }
        return;
      }

      if (command === "/chat") {
        dispatch({ type: "ENTER_CHAT", sessionId: crypto.randomUUID() });
        return;
      }

      const entry = registry[command];
      if (entry) {
        dispatch({
          type: "SUBMIT",
          command,
          content: entry.handler((cmd: string) => runCommand(cmd)),
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
    [state.mode, dispatch, stopSession, sendMessage]
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
      mode={state.mode}
      chatMessages={state.chatMessages}
      isLoading={isLoading}
    />
  );
}
