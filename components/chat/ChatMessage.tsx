// components/chat/ChatMessage.tsx
"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
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

  const isAnimating = animate && displayed.length < message.text.length;

  return (
    <div className="font-mono text-sm" style={{ paddingLeft: "16px", color: "var(--text-secondary)" }}>
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p style={{ margin: "0 0 4px 0" }}>{children}</p>
          ),
          strong: ({ children }) => (
            <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>{children}</em>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: "4px 0", paddingLeft: "16px", listStyleType: "none" }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: "4px 0", paddingLeft: "16px" }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: "2px 0" }}>
              <span style={{ color: "var(--accent)", marginRight: "6px" }}>-</span>
              {children}
            </li>
          ),
          h1: ({ children }) => (
            <p style={{ color: "var(--accent)", fontWeight: 700, margin: "6px 0 2px 0" }}>{children}</p>
          ),
          h2: ({ children }) => (
            <p style={{ color: "var(--accent)", fontWeight: 700, margin: "6px 0 2px 0" }}>{children}</p>
          ),
          h3: ({ children }) => (
            <p style={{ color: "var(--text-primary)", fontWeight: 700, margin: "4px 0 2px 0" }}>{children}</p>
          ),
          code: ({ children }) => (
            <code style={{ color: "var(--accent)", background: "transparent", fontFamily: "inherit" }}>{children}</code>
          ),
          pre: ({ children }) => (
            <pre style={{ margin: "4px 0", background: "transparent", fontFamily: "inherit" }}>{children}</pre>
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>{children}</a>
          ),
        }}
      >
        {displayed}
      </ReactMarkdown>
      {isAnimating && (
        <span style={{ color: "var(--accent)" }}>▌</span>
      )}
    </div>
  );
}
