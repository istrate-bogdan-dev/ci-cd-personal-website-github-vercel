import CommandLine from "@/components/terminal/CommandLine";

const CONTACT = {
  email: "istratebogdancosmin@gmail.com",
  github: "github.com/istrate-bogdan-dev",
  linkedin: "linkedin.com/in/bogdan-cosmin-istrate",
  openTo: ["full-time", "contract", "remote", "hybrid"],
};

export default function Contact() {
  return (
    <section id="contact" className="px-6 sm:px-8 py-8 section-reveal">
      <CommandLine command="cat contact.txt" />
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex gap-3">
          <span className="text-[#555] w-20 shrink-0">email:</span>
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-[#00ff41] link-glow"
          >
            {CONTACT.email}
          </a>
        </div>
        <div className="flex gap-3">
          <span className="text-[#555] w-20 shrink-0">github:</span>
          <a
            href={`https://${CONTACT.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff41] link-glow"
          >
            {CONTACT.github}
          </a>
        </div>
        <div className="flex gap-3">
          <span className="text-[#555] w-20 shrink-0">linkedin:</span>
          <a
            href={`https://${CONTACT.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff41] link-glow"
          >
            {CONTACT.linkedin}
          </a>
        </div>
        <div className="flex gap-3 pt-2">
          <span className="text-[#555] w-20 shrink-0">open_to:</span>
          <span className="text-[#aaa]">
            [{CONTACT.openTo.map((o, i) => (
              <span key={o}>
                {o}{i < CONTACT.openTo.length - 1 ? ", " : ""}
              </span>
            ))}]
          </span>
        </div>
      </div>

      {/* Blinking cursor */}
      <div className="mt-10 flex gap-2 text-xs text-[#555]">
        <span>bogdan@cloud:~$</span>
        <span className="cursor-blink text-[#00ff41]">{"\u2588"}</span>
      </div>
    </section>
  );
}
