import CommandLine from "@/components/terminal/CommandLine";

interface ExperienceEntry {
  period: string;
  role: string;
  company: string;
  achievements: string[];
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    period: "2022 \u2013 2025",
    role: "Project Implementation Lead",
    company: "E-Infra",
    achievements: [
      "Led AWS distributed systems implementation for energy & telecom infrastructure, achieving 99.9% availability through automated monitoring and proactive scaling",
      "Reduced monthly cloud expenditure by 20% via FinOps practices: right-sizing, Spot Instances, and Savings Plans",
    ],
  },
  {
    period: "2017 \u2013 2022",
    role: "Cloud Engineer",
    company: "High Tech Systems & Software (HTSS)",
    achievements: [
      "Architected and maintained high-availability AWS environments (EC2, S3, RDS, DynamoDB) for Enterprise clients with millions of end-users",
      "Led incident response and post-mortems for complex service disruptions; served as Lead Technical Point of Contact for key customers",
    ],
  },
  {
    period: "2010 \u2013 2016",
    role: "Systems & Network Administrator",
    company: "G&G Romania",
    achievements: [
      "Owned full IT stack: networking, security, server fleets; transitioned company from on-premise to hybrid-ready infrastructure",
      "Engineered hybrid environments ensuring 24/7 stability for email, databases, and internal applications",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="px-6 sm:px-8 py-8 section-reveal">
      <CommandLine command="cat experience.log" />
      <div className="mt-5 space-y-1">
        {EXPERIENCE.map((entry, i) => (
          <div key={i} className="timeline-item py-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[#00ff41] font-medium text-sm">{entry.role}</span>
              <span className="text-[#555] text-xs">@ {entry.company}</span>
            </div>
            <span className="text-[#555] text-xs">{entry.period}</span>
            <ul className="mt-2 space-y-1.5">
              {entry.achievements.map((ach, j) => (
                <li key={j} className="text-[#aaa] text-xs flex gap-2">
                  <span className="text-[#555] shrink-0">└─</span>
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
