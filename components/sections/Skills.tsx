import CommandLine from "@/components/terminal/CommandLine";

interface Skill {
  name: string;
  level: number; // 0–12
  label: string;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

const SKILLS: SkillCategory[] = [
  {
    category: "// Cloud",
    skills: [
      { name: "AWS", level: 11, label: "expert" },
      { name: "Azure", level: 7, label: "mid" },
    ],
  },
  {
    category: "// IaC & Containers",
    skills: [
      { name: "Terraform", level: 11, label: "expert" },
      { name: "Kubernetes", level: 8, label: "mid" },
      { name: "Docker", level: 11, label: "expert" },
    ],
  },
  {
    category: "// CI/CD & Security",
    skills: [
      { name: "GitHub Actions", level: 10, label: "advanced" },
      { name: "IAM / DevSecOps", level: 9, label: "advanced" },
    ],
  },
  {
    category: "// Observability",
    skills: [
      { name: "CloudWatch", level: 9, label: "advanced" },
      { name: "Prometheus/Grafana", level: 7, label: "mid" },
    ],
  },
  {
    category: "// Scripting",
    skills: [
      { name: "Python", level: 8, label: "mid" },
      { name: "Bash", level: 12, label: "advanced" },
      { name: "PowerShell", level: 10, label: "mid" },
    ],
  },
];

function SkillBar({ level, delay }: { level: number; delay: number }) {
  const pct = Math.round((level / 12) * 100);
  return (
    <span className="relative inline-flex items-center w-28 h-3 group">
      {/* track */}
      <span className="absolute inset-0 rounded-sm bg-[#1a1a1a]" />
      {/* fill */}
      <span
        className="skill-bar-fill absolute left-0 top-0 bottom-0 rounded-sm bg-[#00ff41]"
        style={
          {
            "--skill-width": `${pct}%`,
            animationDelay: `${delay}ms`,
            boxShadow: "0 0 6px rgba(0,255,65,0.5)",
          } as React.CSSProperties
        }
      />
      {/* tooltip */}
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-[#00ff41] opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d0d0d] px-1.5 py-0.5 rounded border border-[#1a1a1a] whitespace-nowrap pointer-events-none">
        {level}/12
      </span>
    </span>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="px-6 sm:px-8 py-8 section-reveal">
      <CommandLine command="cat skills.json" />
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {SKILLS.map((cat) => (
          <div key={cat.category}>
            <p className="text-[#555] text-xs mb-3 tracking-wide">{cat.category}</p>
            <div className="space-y-3">
              {cat.skills.map((skill, i) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <span className="text-[#aaa] text-xs w-28 shrink-0">
                    {skill.name}
                  </span>
                  <SkillBar level={skill.level} delay={i * 80} />
                  <span className="text-[#555] text-xs">{skill.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
