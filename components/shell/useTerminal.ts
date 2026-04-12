// components/shell/useTerminal.ts
"use client";

import { useState, useCallback, ReactNode } from "react";

export type ChatMessage = {
  role: "user" | "agent";
  text: string;
};

export type Output = {
  command: string;
  content: ReactNode;
  plainText?: string;
};

export type TerminalMode = "IDLE" | "CHAT_MODE";

export type TerminalState = {
  input: string;
  outputs: Output[];
  booted: boolean;
  mode: TerminalMode;
  sessionId: string | null;
  chatMessages: ChatMessage[];
};

type Action =
  | { type: "BOOT_COMPLETE" }
  | { type: "TYPE"; value: string }
  | { type: "SUBMIT"; command: string; content: ReactNode; plainText?: string }
  | { type: "CLEAR" }
  | { type: "ENTER_CHAT"; sessionId: string }
  | { type: "EXIT_CHAT" }
  | { type: "CHAT_ADD_USER_MESSAGE"; text: string }
  | { type: "CHAT_ADD_AGENT_MESSAGE"; text: string };

function reduce(state: TerminalState, action: Action): TerminalState {
  switch (action.type) {
    case "BOOT_COMPLETE":
      return { ...state, booted: true };
    case "TYPE":
      return { ...state, input: action.value };
    case "SUBMIT":
      return {
        ...state,
        input: "",
        outputs: [
          ...state.outputs,
          { command: action.command, content: action.content, plainText: action.plainText },
        ],
      };
    case "CLEAR":
      return { ...state, outputs: [] };
    case "ENTER_CHAT":
      return {
        ...state,
        input: "",
        mode: "CHAT_MODE",
        sessionId: action.sessionId,
        chatMessages: [],
      };
    case "EXIT_CHAT":
      return {
        ...state,
        input: "",
        mode: "IDLE",
        sessionId: null,
        chatMessages: [],
      };
    case "CHAT_ADD_USER_MESSAGE":
      return {
        ...state,
        input: "",
        chatMessages: [
          ...state.chatMessages,
          { role: "user", text: action.text },
        ],
      };
    case "CHAT_ADD_AGENT_MESSAGE":
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          { role: "agent", text: action.text },
        ],
      };
    default:
      return state;
  }
}

export function useTerminal() {
  const [state, setState] = useState<TerminalState>({
    input: "",
    outputs: [],
    booted: false,
    mode: "IDLE",
    sessionId: null,
    chatMessages: [],
  });

  const dispatch = useCallback((action: Action) => {
    setState((prev) => reduce(prev, action));
  }, []);

  return { state, dispatch };
}
