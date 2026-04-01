interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function TerminalWindow({
  title = "bogdan@cloud-engineer — portfolio",
  children,
  className = "",
}: TerminalWindowProps) {
  return (
    <div className={`rounded-lg overflow-hidden border border-[#1a1a1a] ${className}`}>
      {/* Window chrome — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#222]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[#555] text-xs">{title}</span>
      </div>
      <div className="bg-[#0d0d0d]">{children}</div>
    </div>
  );
}
