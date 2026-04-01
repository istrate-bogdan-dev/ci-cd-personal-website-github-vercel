interface CommandLineProps {
  prompt?: string;
  command: string;
  className?: string;
}

export default function CommandLine({
  prompt = "bogdan@cloud:~$",
  command,
  className = "",
}: CommandLineProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <span className="text-[#555]">{prompt}</span>
      <span className="text-[#00ff41] glow">{command}</span>
    </div>
  );
}
