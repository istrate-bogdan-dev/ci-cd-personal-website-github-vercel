// components/shell/TerminalWindow.tsx
"use client";

import { useRef, useEffect, useCallback } from "react";
import { Output, TerminalMode, ChatMessage as ChatMessageType } from "./useTerminal";
import CommandInput from "./CommandInput";
import OutputRenderer from "./OutputRenderer";
import ChatMessage from "@/components/chat/ChatMessage";

// figlet "Big Money-sw" font
const ASCII_BANNER = String.raw`
 _______    ______    ______   _______    ______   __    __
/       \  /      \  /      \ /       \  /      \ /  \  /  |
$$$$$$$  |/$$$$$$  |/$$$$$$  |$$$$$$$  |/$$$$$$  |$$  \ $$ |
$$ |__$$ |$$ |  $$ |$$ | _$$/ $$ |  $$ |$$ |__$$ |$$$  \$$ |
$$    $$< $$ |  $$ |$$ |/    |$$ |  $$ |$$    $$ |$$$$  $$ |
$$$$$$$  |$$ |  $$ |$$ |$$$$ |$$ |  $$ |$$$$$$$$ |$$ $$ $$ |
$$ |__$$ |$$ \__$$ |$$ \__$$ |$$ |__$$ |$$ |  $$ |$$ |$$$$ |
$$    $$/ $$    $$/ $$    $$/ $$    $$/ $$ |  $$ |$$ | $$$ |
$$$$$$$/   $$$$$$/   $$$$$$/  $$$$$$$/  $$/   $$/ $$/   $$/

 ______   ______   ________  _______    ______   ________  ________
/      | /      \ /        |/       \  /      \ /        |/        |
$$$$$$/ /$$$$$$  |$$$$$$$$/ $$$$$$$  |/$$$$$$  |$$$$$$$$/ $$$$$$$$/
  $$ |  $$ \__$$/    $$ |   $$ |__$$ |$$ |__$$ |   $$ |   $$ |__
  $$ |  $$      \    $$ |   $$    $$< $$    $$ |   $$ |   $$    |
  $$ |   $$$$$$  |   $$ |   $$$$$$$  |$$$$$$$$ |   $$ |   $$$$$/
 _$$ |_ /  \__$$ |   $$ |   $$ |  $$ |$$ |  $$ |   $$ |   $$ |_____
/ $$   |$$    $$/    $$ |   $$ |  $$ |$$ |  $$ |   $$ |   $$       |
$$$$$$/  $$$$$$/     $$/    $$/   $$/ $$/   $$/    $$/    $$$$$$$$/`.trimStart();

function HeroContent({ onCommand }: { onCommand: (cmd: string) => void }) {
  return (
    <div className="mb-6">
      {/* ASCII banner — hidden on mobile */}
      <pre
        className="hidden sm:block mb-4"
        style={{
          color: "var(--accent)",
          fontSize: "9px",
          lineHeight: 1.0,
        }}
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

function ChatArea({ messages, isLoading, onUpdate }: { messages: ChatMessageType[]; isLoading: boolean; onUpdate: () => void }) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
        bogdan@cloud ~ /chat
      </p>
      <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
        Chat mode active. Ask anything about Bogdan. Type{" "}
        <span style={{ color: "var(--accent)" }}>/exit</span> to leave.
      </p>
      <p style={{ color: "var(--border)" }} className="font-mono text-sm">{"─".repeat(50)}</p>
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          message={msg}
          animate={msg.role === "agent" && i === messages.length - 1}
          onUpdate={onUpdate}
        />
      ))}
      {isLoading && (
        <p className="font-mono text-sm" style={{ paddingLeft: "16px", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--accent)" }}>●</span> thinking...
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

  const scrollToBottom = useCallback(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Scroll to bottom after React paints new output
  useEffect(() => {
    requestAnimationFrame(scrollToBottom);
  }, [outputs, chatMessages, isLoading, scrollToBottom]);

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
          <div className="hidden sm:flex items-center gap-2 mr-6">
            <span className="w-4 h-4 rounded-full bg-red-500 inline-block" />
            <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block" />
            <span className="w-4 h-4 rounded-full bg-green-500 inline-block" />
          </div>
          <span
            className="text-sm"
            style={{ color: "var(--text-secondary)", marginLeft: "16px" }}
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
            <ChatArea messages={chatMessages} isLoading={isLoading} onUpdate={scrollToBottom} />
          ) : (
            <>
              <HeroContent onCommand={onSubmit} />
              <OutputRenderer outputs={outputs} onUpdate={scrollToBottom} />
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
