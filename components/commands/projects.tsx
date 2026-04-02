// components/commands/projects.tsx
import { registerCommand } from "./index";

function ProjectsOutput() {
  return (
    <div className="space-y-1">
      <p style={{ color: "var(--text-secondary)" }}>
        bogdan@cloud ~ git log --oneline projects/
      </p>
      <div className="mt-2 border rounded p-3" style={{ borderColor: "var(--border)" }}>
        <p>
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>a1b2c3d</span>
          <span style={{ color: "var(--accent)", marginLeft: "12px", fontWeight: "bold" }}>
            terraform-aws-vpc-ha-asg
          </span>
        </p>
        <p style={{ color: "var(--text-primary)", paddingLeft: "16px" }}>
          High-availability VPC with Auto Scaling Group on AWS
        </p>
        <p style={{ paddingLeft: "16px" }} className="mt-1">
          {["Terraform", "AWS VPC", "ASG", "IAM"].map((tag) => (
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
            href="https://github.com/istrate-bogdan-dev/terraform-aws-vpc-ha-asg"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
            className="hover:underline"
          >
            github.com/istrate-bogdan-dev/terraform-aws-vpc-ha-asg
          </a>
        </p>
      </div>
    </div>
  );
}

registerCommand("/projects", {
  description: "GitHub projects & case studies",
  handler: () => <ProjectsOutput />,
});
