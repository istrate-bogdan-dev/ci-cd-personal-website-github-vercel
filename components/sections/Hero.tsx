import CommandLine from "@/components/terminal/CommandLine";

export default function Hero() {
  return (
    <section id="hero" className="px-6 sm:px-8 pt-10 pb-10 section-reveal">
      <CommandLine command="whoami" />
      <div className="mt-5">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-widest glow-subtle">
          BOGDAN-COSMIN ISTRATE
        </h1>
        <p className="text-[#00ff41] glow text-sm mt-2 tracking-wide">
          Cloud Engineer &middot; DevOps &middot; DevSecOps
        </p>
        <p className="text-[#555] text-xs mt-1.5 tracking-wide">
          Bucharest, Romania &middot; Open to work
        </p>
      </div>

      <div className="mt-8">
        <CommandLine command="cat tagline.txt" className="mb-3" />
        <p className="text-[#aaa] text-sm leading-relaxed max-w-xl">
          Infrastructure that scales. Security by design.
          <br />
          Business context included — dual background in CS &amp; Economics.
        </p>
      </div>

      <div className="mt-8">
        <CommandLine command="cat links.txt" className="mb-3" />
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 text-xs">
          <a
            href="https://github.com/istrate-bogdan-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff41] link-glow"
          >
            → github.com/istrate-bogdan-dev
          </a>
          <a
            href="https://www.linkedin.com/in/bogdan-cosmin-istrate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff41] link-glow"
          >
            → linkedin.com/in/bogdan-cosmin-istrate
          </a>
        </div>
      </div>
    </section>
  );
}
