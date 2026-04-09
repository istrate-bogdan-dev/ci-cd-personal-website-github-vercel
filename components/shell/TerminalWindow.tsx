// components/shell/TerminalWindow.tsx
"use client";

import { useRef, useEffect } from "react";
import { Output, TerminalMode, ChatMessage as ChatMessageType } from "./useTerminal";
import CommandInput from "./CommandInput";
import OutputRenderer from "./OutputRenderer";
import ChatMessage from "@/components/chat/ChatMessage";

const ASCII_BANNER = `
 ____   ___   ____ ____    _    _   _
| __ ) / _ \\ / ___|  _ \\  / \\  | \\ | |
|  _ \\| | | | |  _| | | |/ _ \\ |  \\| |
| |_) | |_| | |_| | |_| / ___ \\| |\\  |
|____/ \\___/ \\____|____/_/   \\_\\_| \\_|

 ___ ____ _____ ____    _  _____ _____
|_ _/ ___|_   _|  _ \\  / \\|_   _| ____|
 | |\\___ \\ | | | |_) |/ _ \\ | | |  _|
 | | ___) || | |  _ // ___ \\| | | |___
|___|____/ |_| |_| \\_\\_/   \\_|_| |_____|`.trim();

function HeroContent({ onCommand }: { onCommand: (cmd: string) => void }) {
  return (
    <div className="mb-6">
      {/* ASCII banner — hidden on mobile */}
      <pre
        className="hidden sm:block text-sm leading-tight mb-4"
        style={{ color: "var(--accent)" }}
      >
        {ASCII_BANNER}
      </pre>
      {/* Mobile fallback */}
      <p
        className="sm:hidden text-xl font-bold mb-4"
        style={{ color: "var(--accent)" }}
      >
        BOGDAN ISTRATE
      </p>

      <p style={{ color: "var(--text-primary)" }} className="mb-1">
        Cloud Solutions Architect · AWS · DevOps · FinOps
      </p>
      <p style={{ color: "var(--text-secondary)" }} className="mb-4">
        Bucharest, Romania · Open to new opportunities
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {["AWS Certified SAA-C03", "Terraform", "AWS DMS", "FinOps", "IAM / Security"].map(
          (tag) => (
            <span
              key={tag}
              className="text-sm px-3 py-1 rounded"
              style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
            >
              {tag}
            </span>
          )
        )}
      </div>

      <p style={{ color: "var(--text-muted)" }}>
        Type or click{" "}
        <span
          onClick={() => onCommand("/help")}
          style={{ color: "var(--accent)", cursor: "pointer" }}
          title="Run /help"
        >
          /help
        </span>
        {" "}to see all available commands.
      </p>
      <p style={{ color: "var(--text-muted)" }}>
        Try{" "}
        <span
          onClick={() => onCommand("/deploy")}
          style={{ color: "var(--accent)", cursor: "pointer" }}
          title="Run /deploy"
        >
          /deploy
        </span>
        {" "}for a surprise.
      </p>
    </div>
  );
}

function ChatArea({ messages, isLoading }: { messages: ChatMessageType[]; isLoading: boolean }) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
        bogdan@cloud ~ /chat
      </p>
      <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
        Mod chat activ. Pune orice întrebare despre Bogdan. Tastează{" "}
        <span style={{ color: "var(--accent)" }}>/exit</span> pentru a ieși.
      </p>
      <p style={{ color: "var(--border)" }} className="font-mono text-sm">{"─".repeat(50)}</p>
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          message={msg}
          animate={msg.role === "agent" && i === messages.length - 1}
        />
      ))}
      {isLoading && (
        <p className="font-mono text-sm" style={{ paddingLeft: "16px", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--accent)" }}>●</span> gândesc...
        </p>
      )}
    </div>
  );
}

type Props = {
  outputs: Output[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
  mode?: TerminalMode;
  chatMessages?: ChatMessageType[];
  isLoading?: boolean;
};

export default function TerminalWindow({
  outputs,
  input,
  onInputChange,
  onSubmit,
  mode = "IDLE",
  chatMessages = [],
  isLoading = false,
}: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom after React paints new output
  useEffect(() => {
    requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [outputs, chatMessages, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-animated">
      <div
        className="w-full rounded-lg overflow-hidden flex flex-col"
        style={{
          maxWidth: "1000px",
          height: "85vh",
          background: "var(--bg-glass)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
        >
          {/* Traffic lights — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 mr-4">
            <span className="w-4 h-4 rounded-full bg-red-500 inline-block" />
            <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block" />
            <span className="w-4 h-4 rounded-full bg-green-500 inline-block" />
          </div>
          <span
            className="text-sm mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {mode === "CHAT_MODE" ? "bogdan@cloud ~ /chat" : "bogdan@cloud ~ /portfolio"}
          </span>
        </div>

        {/* Body — flex-grow fills remaining space, scrolls internally */}
        <div
          ref={bodyRef}
          className="px-6 py-8 overflow-y-auto flex-grow"
        >
          {mode === "CHAT_MODE" ? (
            <ChatArea messages={chatMessages} isLoading={isLoading} />
          ) : (
            <>
              <HeroContent onCommand={onSubmit} />
              <OutputRenderer outputs={outputs} />
            </>
          )}
        </div>

        {/* Input bar */}
        <CommandInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
          mode={mode}
          disabled={mode === "CHAT_MODE" && isLoading}
        />
      </div>
    </div>
  );
}
