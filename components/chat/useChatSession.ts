// components/chat/useChatSession.ts
"use client";

import { useRef, useState, useCallback } from "react";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minute
const INACTIVITY_MESSAGE = "⚠ Sesiune închisă automat după 5 minute de inactivitate.";

type SendOptions = {
  sessionId: string;
  onAgentReply: (text: string) => void;
  onInactivityExit: (message: string) => void;
  onExit: () => void;
};

export function useChatSession() {
  const [isLoading, setIsLoading] = useState(false);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionsRef = useRef<SendOptions | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (!optionsRef.current) return;
    const { onInactivityExit, onExit } = optionsRef.current;
    inactivityTimerRef.current = setTimeout(() => {
      onInactivityExit(INACTIVITY_MESSAGE);
      onExit();
    }, INACTIVITY_TIMEOUT_MS);
  }, []);

  const startSession = useCallback(
    (options: SendOptions) => {
      optionsRef.current = options;
      resetInactivityTimer();
    },
    [resetInactivityTimer]
  );

  const stopSession = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    optionsRef.current = null;
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!optionsRef.current) return;
      const { sessionId, onAgentReply } = optionsRef.current;

      resetInactivityTimer();
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, sessionId }),
          signal: AbortSignal.timeout(30_000),
        });

        if (!res.ok) {
          const status = res.status;
          if (status === 400) {
            onAgentReply("⚠ Mesajul este prea lung (max 500 caractere).");
          } else if (status === 504) {
            onAgentReply("⚠ Agentul nu răspunde. Încearcă din nou.");
          } else {
            onAgentReply("⚠ Serviciul de chat nu este disponibil momentan.");
          }
          return;
        }

        const data = await res.json();
        if (typeof data?.reply === "string") {
          onAgentReply(data.reply);
        } else {
          onAgentReply("⚠ Răspuns neașteptat. Încearcă din nou.");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "TimeoutError") {
          onAgentReply("⚠ Agentul nu răspunde. Încearcă din nou.");
        } else {
          onAgentReply("⚠ Serviciul de chat nu este disponibil momentan.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [resetInactivityTimer]
  );

  return { isLoading, startSession, stopSession, sendMessage };
}
