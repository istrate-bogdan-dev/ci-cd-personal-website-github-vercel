// components/chat/ChatMessage.tsx
"use client";

import { useEffect, useState } from "react";
import { ChatMessage as ChatMessageType } from "@/components/shell/useTerminal";

type Props = {
  message: ChatMessageType;
  animate?: boolean;
  onUpdate?: () => void;
};

export default function ChatMessage({ message, animate = false, onUpdate }: Props) {
  const [displayed, setDisplayed] = useState(
    animate && message.role === "agent" ? "" : message.text
  );

  useEffect(() => {
    if (!animate || message.role !== "agent") return;

    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(message.text.slice(0, i));
      onUpdate?.();
      if (i >= message.text.length) clearInterval(interval);
    }, 12);

    return () => clearInterval(interval);
  }, [animate, message.role, message.text, onUpdate]);

  if (message.role === "user") {
    return (
      <p className="font-mono text-sm">
        <span style={{ color: "var(--accent)", marginRight: "8px" }}>&gt;</span>
        <span style={{ color: "var(--text-primary)" }}>{message.text}</span>
      </p>
    );
  }

  return (
    <p className="font-mono text-sm" style={{ paddingLeft: "16px", color: "var(--text-secondary)" }}>
      {displayed}
      {animate && displayed.length < message.text.length && (
        <span style={{ color: "var(--accent)" }}>▌</span>
      )}
    </p>
  );
}
