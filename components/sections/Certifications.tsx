import CommandLine from "@/components/terminal/CommandLine";

interface Certification {
  name: string;
  code: string;
  issuer: string;
  date: string;
  earned: boolean;
  verifyUrl?: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    name: "AWS Certified Solutions Architect \u2013 Associate",
    code: "SAA-C03",
    issuer: "Amazon Web Services",
    date: "Feb 2026",
    earned: true,
    verifyUrl: "https://www.credly.com/badges/92cd9181-8bb7-4564-b950-53d06a370bac/public_url",
  },
  {
    name: "[ next certification ]",
    code: "TBD",
    issuer: "",
    date: "",
    earned: false,
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="px-6 sm:px-8 py-8 section-reveal">
      <CommandLine command="ls -la certifications/" />
      <div className="mt-5 space-y-3">
        {CERTIFICATIONS.map((cert, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 text-sm ${
              cert.earned
                ? "cert-badge rounded-md p-4 bg-[#0d0d0d]"
                : "px-4 py-2"
            }`}
          >
            <span className={cert.earned ? "text-[#00ff41] text-base mt-0.5" : "text-[#333]"}>
              {cert.earned ? "\u2713" : "\u25CB"}
            </span>
            <div className="flex-1">
              {cert.earned ? (
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-white font-medium">{cert.name}</span>
                    <span className="text-[#555] text-xs">{cert.code}</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-1.5">
                    <span className="text-[#555] text-xs">{cert.issuer}</span>
                    <span className="text-[#555] text-xs">{cert.date}</span>
                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00ff41] text-xs link-glow"
                      >
                        verify →
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-[#333] text-xs italic">{cert.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
