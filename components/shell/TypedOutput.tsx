"use client";

import { useEffect, useState, ReactNode, isValidElement, Children, cloneElement, ReactElement } from "react";

type Props = {
  content: ReactNode;
  onUpdate?: () => void;
};

const LINE_DELAY_MS = 35;

// Reveals the children of the root element one by one, like a real terminal.
// Falls back to instant render if content is not a single element with children.
export default function TypedOutput({ content, onUpdate }: Props) {
  const lines: ReactNode[] = isValidElement(content)
    ? Children.toArray((content.props as { children?: ReactNode }).children)
    : [];

  const [visible, setVisible] = useState(lines.length === 0 ? Infinity : 0);

  useEffect(() => {
    if (lines.length === 0) return;
    setVisible(0);

    const interval = setInterval(() => {
      setVisible((v) => {
        const next = v + 1;
        onUpdate?.();
        if (next >= lines.length) clearInterval(interval);
        return next;
      });
    }, LINE_DELAY_MS);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (lines.length === 0 || !isValidElement(content)) {
    return <>{content}</>;
  }

  const element = content as ReactElement<{ children?: ReactNode }>;
  const revealed = lines.slice(0, visible);

  return cloneElement(element, { children: revealed });
}
