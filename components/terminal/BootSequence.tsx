"use client";

import { useState, useEffect } from "react";

interface BootLine {
  text: string;
  color: string;
  delay: number;
  typing?: boolean;
}

const BOOT_LINES: BootLine[] = [
  { text: "System boot sequence...", color: "#555", delay: 0 },
  { text: "Loading modules: [aws] [k8s] [terraform] [cicd] ✓", color: "#555", delay: 500 },
  { text: "Checking certificates... AWS SAA-C03 valid ✓", color: "#555", delay: 1050 },
  { text: "Portfolio v1.0.0 ready.", color: "#555", delay: 1550 },
  { text: "", color: "", delay: 1800 },
  { text: "bogdan@cloud:~$ whoami", color: "#00ff41", delay: 2000, typing: true },
];

const CHAR_SPEED = 38; // ms per character

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  // Reveal non-typing lines
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, index) => {
      if (line.typing) return;
      const t = setTimeout(() => setVisibleLines(index + 1), line.delay);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Type the last line character by character
  useEffect(() => {
    const lastLine = BOOT_LINES[BOOT_LINES.length - 1];
    if (!lastLine.typing) return;

    const startDelay = setTimeout(() => {
      setVisibleLines(BOOT_LINES.length);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTypedText(lastLine.text.slice(0, i));
        if (i >= lastLine.text.length) {
          clearInterval(interval);
          setTypingDone(true);
          setTimeout(onComplete, 500);
        }
      }, CHAR_SPEED);

      return () => clearInterval(interval);
    }, lastLine.delay);

    return () => clearTimeout(startDelay);
  }, [onComplete]);

  return (
    <div className="p-6 sm:p-8 space-y-1 text-sm">
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
        const isTypingLine = line.typing;
        const displayText = isTypingLine ? typedText : line.text;

        return (
          <div
            key={i}
            className="line-appear"
            style={{ color: line.color || "transparent" }}
          >
            {displayText || "\u00A0"}
            {isTypingLine && !typingDone && (
              <span className="cursor-blink" style={{ color: "#00ff41" }}>█</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
