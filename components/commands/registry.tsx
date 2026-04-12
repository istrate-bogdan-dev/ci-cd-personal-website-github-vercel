// components/commands/registry.tsx
"use client";

import { ReactNode } from "react";

export type CommandEntry = {
  description: string;
  handler: (onCommand?: (cmd: string) => void) => ReactNode;
};

export type CommandRegistry = Record<string, CommandEntry>;

// ─── /about ──────────────────────────────────────────────────────────────────

function AboutOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /about</p>
      <p style={{ color: "var(--border)" }}>{"─".repeat(50)}</p>
      <p style={{ color: "var(--text-primary)" }}>
        Cloud Solutions Architect with over 6 years of experience
      </p>
      <p style={{ color: "var(--text-primary)" }}>
        in IT infrastructure and a dual background in Computer
      </p>
      <p style={{ color: "var(--text-primary)" }}>
        Science and Economics.
      </p>
      <p></p>
      <p style={{ color: "var(--text-primary)" }}>
        Expert in end-to-end AWS migrations, transitioning on-premises
      </p>
      <p style={{ color: "var(--text-primary)" }}>
        databases and legacy infrastructure to scalable, secure cloud
      </p>
      <p style={{ color: "var(--text-primary)" }}>
        environments.
      </p>
      <p></p>
      <p style={{ color: "var(--text-primary)" }}>
        Proven track record as a{" "}
        <span style={{ color: "var(--accent)" }}>Group-level Trusted Advisor</span>
        , bridging the gap
      </p>
      <p style={{ color: "var(--text-primary)" }}>
        between technical engineering and business value across
      </p>
      <p style={{ color: "var(--text-primary)" }}>
        diverse business units.
      </p>
      <p></p>
      <p style={{ color: "var(--accent)" }}>
        Philosophy: cost-aware, security-first, observable infrastructure.
      </p>
      <p style={{ color: "var(--border)" }}>{"─".repeat(50)}</p>
    </div>
  );
}

// ─── /certifications ─────────────────────────────────────────────────────────

function CertificationsOutput() {
  return (
    <div className="space-y-2">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /certifications</p>
      <p></p>
      <p>
        <span style={{ color: "var(--accent)" }}>✓</span>
        <span style={{ color: "var(--text-primary)", marginLeft: "8px", fontWeight: "bold" }}>
          AWS Certified Solutions Architect – Associate (SAA-C03)
        </span>
      </p>
      <p style={{ color: "var(--text-muted)", paddingLeft: "20px", fontSize: "14px" }}>
        Issued: Feb 2026 · Validation: ee1e08f2a2fa40aea43cf39154ef3e3a
      </p>
      <p style={{ paddingLeft: "20px" }}>
        <a
          href="https://www.credly.com/badges/92cd9181-8bb7-4564-b950-53d06a370bac/public_url"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)" }}
          className="hover:underline"
        >
          → View badge on Credly
        </a>
      </p>
      <p></p>
      <p>
        <span style={{ color: "var(--text-muted)" }}>○</span>
        <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>
          [ next certification — in progress ]
        </span>
      </p>
    </div>
  );
}

// ─── /contact ────────────────────────────────────────────────────────────────

function ContactOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /contact</p>
      <p></p>
      {[
        ["email:", "istratebogdancosmin@gmail.com", "mailto:istratebogdancosmin@gmail.com"],
        ["github:", "github.com/istrate-bogdan-dev", "https://github.com/istrate-bogdan-dev"],
        ["linkedin:", "linkedin.com/in/bogdan-cosmin-istrate", "https://www.linkedin.com/in/bogdan-cosmin-istrate"],
      ].map(([key, label, href]) => (
        <p key={key}>
          <span style={{ color: "var(--text-muted)", display: "inline-block", width: "110px" }}>
            {key}
          </span>
          <a
            href={href}
            target={href.startsWith("mailto") || href.startsWith("tel") ? undefined : "_blank"}
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
            className="hover:underline"
          >
            {label}
          </a>
        </p>
      ))}
    </div>
  );
}

// ─── /deploy ─────────────────────────────────────────────────────────────────

function DeployOutput() {
  const lines = [
    { text: "Initializing deployment sequence...", color: "var(--text-secondary)" },
    { text: "► kubectl apply -f bogdan-istrate.yaml", color: "var(--text-primary)" },
    { text: "► Pod/bogdan-istrate created", color: "var(--text-primary)" },
    { text: "► Readiness probe: PASSING", color: "var(--accent)" },
    { text: "► Health check:    PASSING", color: "var(--accent)" },
    { text: "✓ bogdan@cloud deployed successfully. 🚀", color: "var(--accent)" },
    { text: "  Ready to handle production traffic.", color: "var(--text-primary)" },
  ];

  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /deploy</p>
      <p></p>
      {lines.map((line, i) => (
        <p key={i} style={{ color: line.color }}>
          {line.text}
        </p>
      ))}
    </div>
  );
}

// ─── /logs ───────────────────────────────────────────────────────────────────

type LogEntryProps = {
  period: string;
  role: string;
  company: string;
  location: string;
  bullets: string[];
};

function LogEntry({ period, role, company, location, bullets }: LogEntryProps) {
  return (
    <div className="mb-4">
      <p>
        <span style={{ color: "var(--text-muted)", display: "inline-block", width: "130px", fontSize: "13px" }}>
          {period}
        </span>
        <span style={{ color: "var(--accent)", fontWeight: "bold" }}>{role}</span>
        <span style={{ color: "var(--text-muted)" }}> @ {company}</span>
      </p>
      <p style={{ color: "var(--text-muted)", paddingLeft: "130px", fontSize: "13px" }}>
        {location}
      </p>
      {bullets.map((b, i) => (
        <p key={i} style={{ color: "var(--text-primary)", paddingLeft: "130px" }}>
          <span style={{ color: "var(--text-muted)" }}>▸ </span>{b}
        </p>
      ))}
    </div>
  );
}

function LogsOutput() {
  return (
    <div>
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /logs --experience</p>
      <p></p>
      <LogEntry
        period="2022–2025"
        role="Cloud Solutions Architect"
        company="E-INFRA"
        location="Bucharest, Hybrid"
        bullets={[
          "Lead architectural authority for holding's subsidiaries (AWS well-architected reviews)",
          "Led migration of critical industrial assets from on-premises to AWS using DMS & Terraform",
          "FinOps: cost-allocation tags + lifecycle policies → 20% reduction in monthly AWS spend",
          "Engineered multi-AZ architectures ensuring 99.9% uptime with automated DR protocols",
          "Presented ROI analyses and technical roadmaps to Board of Directors",
        ]}
      />
      <LogEntry
        period="2017–2022"
        role="Cloud Engineer"
        company="HTSS"
        location="Bucharest, Hybrid"
        bullets={[
          "Managed high-traffic AWS environments supporting millions of concurrent users (ALB/NLB, ASG)",
          "Primary technical contact for Tier-1 enterprise clients during pre-launch & post-migration",
          "Python & Bash automation: patching, snapshots, security audits → 30% less manual overhead",
          "Optimized RDS & DynamoDB via indexing + ElastiCache caching layers",
          "Led RCA for complex infrastructure failures; proactive CloudWatch alerting",
        ]}
      />
      <LogEntry
        period="2010–2016"
        role="Systems & Network Administrator"
        company="G&G Romania"
        location="Constanta"
        bullets={[
          "Full overhaul of IT stack: physical on-premise → modernized hybrid infrastructure",
          "VLAN segmentation, firewall rules, secure VPN tunnels for remote offices",
          "24/7 business continuity for critical ERP and email systems",
        ]}
      />
    </div>
  );
}

// ─── /projects ───────────────────────────────────────────────────────────────

type ProjectCardProps = {
  hash: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
};

function ProjectCard({ hash, name, description, tags, url }: ProjectCardProps) {
  return (
    <div className="border rounded p-3" style={{ borderColor: "var(--border)" }}>
      <p>
        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{hash}</span>
        <span style={{ color: "var(--accent)", marginLeft: "12px", fontWeight: "bold" }}>
          {name}
        </span>
      </p>
      <p style={{ color: "var(--text-primary)", paddingLeft: "16px" }}>{description}</p>
      <p style={{ paddingLeft: "16px" }} className="mt-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="mr-2 text-xs px-2 py-0.5 rounded"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            {tag}
          </span>
        ))}
      </p>
      <p style={{ paddingLeft: "16px" }} className="mt-1">
        <span style={{ color: "var(--text-muted)" }}>→ </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)" }}
          className="hover:underline"
        >
          {url.replace("https://", "")}
        </a>
      </p>
    </div>
  );
}

function ProjectsOutput() {
  return (
    <div className="space-y-3">
      <p style={{ color: "var(--text-secondary)" }}>
        bogdan@cloud ~ git log --oneline projects/
      </p>
      <p></p>
      <ProjectCard
        hash="a1b2c3d"
        name="terraform-aws-vpc-ha-asg"
        description="High-availability VPC with Auto Scaling Group, ALB, and multi-AZ deployment on AWS"
        tags={["Terraform", "AWS VPC", "ASG", "ALB", "IAM"]}
        url="https://github.com/istrate-bogdan-dev/terraform-aws-vpc-ha-asg"
      />
      <ProjectCard
        hash="9b1a095"
        name="ci-cd-personal-website-github-vercel"
        description="Terminal-style portfolio with AI chat agent, CI/CD via GitHub Actions, deployed on Vercel. n8n on AWS EC2 via Terraform."
        tags={["Next.js", "Vercel", "GitHub Actions", "n8n", "AWS EC2", "Terraform"]}
        url="https://github.com/istrate-bogdan-dev/ci-cd-personal-website-github-vercel"
      />
    </div>
  );
}

// ─── /education ──────────────────────────────────────────────────────────────

function EducationOutput() {
  return (
    <div>
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /education</p>
      <p></p>
      <div className="mb-4">
        <p>
          <span style={{ color: "var(--text-muted)", display: "inline-block", width: "130px", fontSize: "13px" }}>
            2021–2024
          </span>
          <span style={{ color: "var(--accent)", fontWeight: "bold" }}>B.Sc. Computer Science</span>
        </p>
        <p style={{ color: "var(--text-muted)", paddingLeft: "130px", fontSize: "13px" }}>
          &quot;Ovidius&quot; University of Constanța · Faculty of Mathematics and Computer Science
        </p>
      </div>
      <div className="mb-4">
        <p>
          <span style={{ color: "var(--text-muted)", display: "inline-block", width: "130px", fontSize: "13px" }}>
            2001–2005
          </span>
          <span style={{ color: "var(--accent)", fontWeight: "bold" }}>B.Sc. Economics</span>
        </p>
        <p style={{ color: "var(--text-muted)", paddingLeft: "130px", fontSize: "13px" }}>
          &quot;Ovidius&quot; University of Constanța · Faculty of Economic Sciences
        </p>
      </div>
    </div>
  );
}

// ─── /skills ─────────────────────────────────────────────────────────────────

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
      <span style={{ color: "var(--text-secondary)", display: "inline-block", width: "120px", flexShrink: 0 }}>
        {category}
      </span>
      <span style={{ display: "inline-block", width: "220px" }}>{name}</span>
      <span style={{ color: "var(--accent)" }}>{bar}</span>
      <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>{percent}%</span>
    </p>
  );
}

function SkillSectionHeader({ label }: { label: string }) {
  return (
    <p style={{ color: "var(--text-secondary)", marginTop: "8px", marginBottom: "2px" }}>
      ── {label}
    </p>
  );
}

function SkillsOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /skills</p>
      <p></p>

      <SkillSectionHeader label="Cloud" />
      <SkillRow category="AWS:" name="EC2 / VPC / S3 / IAM" filled={10} percent={95} />
      <SkillRow category="" name="Lambda / ELB / CloudFront" filled={9} percent={90} />
      <SkillRow category="" name="RDS / Aurora / DynamoDB" filled={9} percent={90} />
      <SkillRow category="" name="Multi-AZ / HA Architecture" filled={10} percent={95} />
      <SkillRow category="Azure:" name="Core Services / Networking" filled={6} percent={60} />
      <SkillRow category="" name="Hybrid Cloud Integration" filled={6} percent={60} />

      <SkillSectionHeader label="DevOps" />
      <SkillRow category="IaC:" name="Terraform" filled={9} percent={90} />
      <SkillRow category="CI/CD:" name="GitHub Actions" filled={8} percent={80} />
      <SkillRow category="Containers:" name="Docker" filled={8} percent={80} />
      <SkillRow category="" name="Kubernetes" filled={7} percent={70} />
      <SkillRow category="Migration:" name="AWS DMS / Migration Hub" filled={9} percent={90} />
      <SkillRow category="" name="Snowball / SMS" filled={8} percent={80} />
      <SkillRow category="Scripting:" name="Python" filled={7} percent={70} />
      <SkillRow category="" name="Bash" filled={8} percent={80} />

      <SkillSectionHeader label="DevSecOps" />
      <SkillRow category="Identity:" name="IAM / AWS SSO" filled={9} percent={90} />
      <SkillRow category="Protection:" name="WAF / Shield / KMS" filled={9} percent={90} />
      <SkillRow category="Network:" name="Direct Connect / VPN / SG" filled={8} percent={80} />
      <SkillRow category="Audit:" name="CloudTrail / CloudWatch" filled={9} percent={90} />
      <SkillRow category="" name="AWS Secrets Manager" filled={8} percent={80} />

      <SkillSectionHeader label="FinOps & Leadership" />
      <SkillRow category="FinOps:" name="Cost Optimization" filled={9} percent={90} />
      <SkillRow category="" name="Tagging / Lifecycle Policies" filled={9} percent={90} />
      <SkillRow category="Leadership:" name="Stakeholder Management" filled={9} percent={90} />
      <SkillRow category="" name="Pre-sales / Roadmaps" filled={8} percent={80} />
    </div>
  );
}

// ─── /status ─────────────────────────────────────────────────────────────────

function StatusOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /status</p>
      <p></p>
      {[
        ["open_to_work:", "true"],
        ["role:", "Cloud Solutions Architect / Cloud Engineer"],
        ["experience:", "6+ years"],
        ["availability:", "immediately"],
        ["preferred:", "remote / hybrid"],
        ["location:", "Bucharest, Romania"],
        ["languages:", "Romanian (native) · English (C1)"],
      ].map(([key, val]) => (
        <p key={key}>
          <span style={{ color: "var(--text-muted)", display: "inline-block", width: "160px" }}>
            {key}
          </span>
          <span style={{ color: key === "open_to_work:" ? "var(--accent)" : "var(--text-primary)" }}>
            {val}
          </span>
        </p>
      ))}
    </div>
  );
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const registry: CommandRegistry = {
  "/chat": {
    description: "Chat with Bogdan's AI assistant",
    handler: () => null,
  },
  "/about": {
    description: "Who is Bogdan Istrate?",
    handler: () => <AboutOutput />,
  },
  "/certifications": {
    description: "Certifications & credentials",
    handler: () => <CertificationsOutput />,
  },
  "/contact": {
    description: "Get in touch",
    handler: () => <ContactOutput />,
  },
  "/deploy": {
    description: "...",
    handler: () => <DeployOutput />,
  },
  "/education": {
    description: "Academic background & degrees",
    handler: () => <EducationOutput />,
  },
  "/logs": {
    description: "Experience timeline",
    handler: () => <LogsOutput />,
  },
  "/projects": {
    description: "GitHub projects & case studies",
    handler: () => <ProjectsOutput />,
  },
  "/skills": {
    description: "Expertise & capabilities",
    handler: () => <SkillsOutput />,
  },
  "/status": {
    description: "Availability status",
    handler: () => <StatusOutput />,
  },
  "/help": {
    description: "List all available commands",
    handler: (onCommand) => <HelpOutput onCommand={onCommand} />,
  },
};

// ─── /help (defined last so it can reference the registry) ───────────────────

function HelpOutput({ onCommand }: { onCommand?: (cmd: string) => void }) {
  const entries = Object.entries(registry).sort(([a], [b]) => a.localeCompare(b));
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>bogdan@cloud ~ /help</p>
      <p></p>
      <p style={{ color: "var(--text-primary)" }}>Available commands:</p>
      <p></p>
      {entries.map(([name, { description }]) => (
        <p key={name}>
          <span
            onClick={() => onCommand?.(name)}
            style={{
              color: name === "/chat" ? "#ef4444" : "var(--accent)",
              display: "inline-block",
              width: "200px",
              cursor: onCommand ? "pointer" : "default",
              fontWeight: name === "/chat" ? "bold" : undefined,
            }}
            title={onCommand ? `Run ${name}` : undefined}
          >
            {name}
          </span>
          <span style={{ color: "var(--text-secondary)" }}>{description}</span>
        </p>
      ))}
      <p></p>
      <p style={{ color: "var(--text-muted)" }}>
        Click a command or type it to get started.
      </p>
    </div>
  );
}
