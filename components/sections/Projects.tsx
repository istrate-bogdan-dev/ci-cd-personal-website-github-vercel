import CommandLine from "@/components/terminal/CommandLine";

interface Project {
  name: string;
  description: string;
  problem: string;
  tags: string[];
  githubUrl: string;
  year: string;
}

const PROJECTS: Project[] = [
  {
    name: "terraform-aws-vpc-ha-asg",
    description: "High-availability VPC with Auto Scaling Group on AWS",
    problem:
      "Provisions a production-grade AWS network topology with multi-AZ VPC, public/private subnets, NAT gateways, and an Auto Scaling Group — fully automated with Terraform, no manual console steps.",
    tags: ["Terraform", "AWS VPC", "ASG", "IAM", "IaC", "High Availability"],
    githubUrl: "https://github.com/istrate-bogdan-dev/terraform-aws-vpc-ha-asg",
    year: "2024",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="px-6 sm:px-8 py-8 section-reveal">
      <CommandLine command="git log --oneline projects/" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.map((project) => (
          <div
            key={project.name}
            className="project-card rounded-md p-5 bg-[#0d0d0d]"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-[#00ff41] font-medium text-sm glow-subtle">
                &#x25B6; {project.name}
              </span>
              <span className="text-[#555] text-xs">{project.year}</span>
            </div>
            <p className="text-[#aaa] text-xs mt-2">{project.description}</p>
            <p className="text-[#555] text-xs mt-2 leading-relaxed">
              {project.problem}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-[#00ff41] text-xs link-glow"
            >
              → {project.githubUrl.replace("https://", "")}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
