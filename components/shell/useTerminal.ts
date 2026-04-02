// components/shell/useTerminal.ts
"use client";

import { useState, useCallback, ReactNode } from "react";

export type Output = {
  command: string;
  content: ReactNode;
};

export type TerminalState = {
  input: string;
  outputs: Output[];
  booted: boolean;
};

type Action =
  | { type: "BOOT_COMPLETE" }
  | { type: "TYPE"; value: string }
  | { type: "SUBMIT"; command: string; content: ReactNode }
  | { type: "CLEAR" };

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
          { command: action.command, content: action.content },
        ],
      };
    case "CLEAR":
      return { ...state, outputs: [] };
    default:
      return state;
  }
}

export function useTerminal() {
  const [state, setState] = useState<TerminalState>({
    input: "",
    outputs: [],
    booted: false,
  });

  const dispatch = useCallback((action: Action) => {
    setState((prev) => reduce(prev, action));
  }, []);

  return { state, dispatch };
}
