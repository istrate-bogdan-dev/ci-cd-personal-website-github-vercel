// components/commands/skills.tsx
import { registerCommand } from "./index";

type SkillRowProps = {
  category: string;
  name: string;
  filled: number;
  total?: number;
  percent: number;
};

function SkillRow({ category, name, filled, total = 10, percent }: SkillRowProps) {
  const bar = "█".repeat(filled) + "░".repeat(total - filled);
  return (
    <p style={{ color: "var(--text-primary)" }} className="font-mono text-sm">
      <span style={{ color: "var(--text-secondary)", display: "inline-block", width: "80px" }}>
        {category}
      </span>
      <span style={{ display: "inline-block", width: "160px" }}>{name}</span>
      <span style={{ color: "var(--accent)" }}>{bar}</span>
      <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>{percent}%</span>
    </p>
  );
}

function SkillsOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /skills</p>
      <SkillRow category="Cloud:" name="AWS" filled={8} percent={80} />
      <SkillRow category="" name="Azure" filled={5} percent={50} />
      <SkillRow category="IaC:" name="Terraform" filled={8} percent={80} />
      <SkillRow category="" name="Docker" filled={8} percent={80} />
      <SkillRow category="" name="Kubernetes" filled={6} percent={60} />
      <SkillRow category="CI/CD:" name="GitHub Actions" filled={7} percent={70} />
      <SkillRow category="Security:" name="IAM / DevSecOps" filled={8} percent={80} />
      <SkillRow category="Scripting:" name="Python" filled={6} percent={60} />
      <SkillRow category="" name="Bash" filled={7} percent={70} />
    </div>
  );
}

registerCommand("/skills", {
  description: "Expertise & capabilities",
  handler: () => <SkillsOutput />,
});
