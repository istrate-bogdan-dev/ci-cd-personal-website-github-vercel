import CommandLine from "@/components/terminal/CommandLine";

export default function About() {
  return (
    <section id="about" className="px-6 sm:px-8 py-8 border-b border-[#1a1a1a] section-reveal">
      <CommandLine command="cat about.md" />
      <div className="mt-4 space-y-2 text-sm leading-relaxed max-w-2xl">
        <p className="text-[#00ff41]"># About</p>
        <p className="text-[#aaa]">
          Cloud Architect with 6+ years in IT infrastructure. Expert in managing
          AWS environments for Enterprise customers, focusing on Operational Health,
          Cost Optimization, and Technical Advocacy.
        </p>
        <p className="text-[#aaa]">
          Rare combination: deep technical expertise in cloud infrastructure paired
          with a degree in Economic Sciences. I bridge engineering with business
          value — cost-benefit analysis, FinOps, and C-suite communication are part
          of my toolkit alongside Terraform and Kubernetes.
        </p>
        <p className="text-[#aaa]">
          Proven Trusted Advisor: I turn complex architectural trade-offs into
          clear decisions. Complexity is fine. Confusion is the problem.
        </p>
        <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
          <p className="text-[#555] text-xs">
            <span className="text-[#00ff41]">education:</span> B.Sc. Computer Science (2021–2024) + B.A. Economic Sciences (2001–2005) — Ovidius University, Constanța
          </p>
          <p className="text-[#555] text-xs mt-1">
            <span className="text-[#00ff41]">open_to:</span> [full-time, contract, remote, hybrid]
          </p>
        </div>
      </div>
    </section>
  );
}
