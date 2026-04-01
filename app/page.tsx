"use client";

import { useState, useCallback } from "react";
import NavBar from "@/components/terminal/NavBar";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import BootSequence from "@/components/terminal/BootSequence";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Certifications from "@/components/sections/Certifications";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import { useScrollReveal, useSkillBarReveal } from "@/components/terminal/useScrollReveal";

export default function Home() {
  const [booted, setBooted] = useState(false);

  useScrollReveal(booted);
  useSkillBarReveal(booted);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <>
      <a href="#hero" className="skip-link">
        Skip to content
      </a>
      <NavBar />
      <main className="min-h-screen pt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <TerminalWindow>
            {!booted ? (
              <BootSequence onComplete={handleBootComplete} />
            ) : (
              <>
                <Hero />
                <hr className="section-separator" />
                <About />
                <hr className="section-separator" />
                <div className="section-alt">
                  <Skills />
                </div>
                <hr className="section-separator" />
                <Certifications />
                <hr className="section-separator" />
                <div className="section-alt">
                  <Projects />
                </div>
                <hr className="section-separator" />
                <Experience />
                <hr className="section-separator" />
                <Contact />
              </>
            )}
          </TerminalWindow>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[#333] text-xs border-t border-[#1a1a1a] pt-4">
          <span>&copy; {new Date().getFullYear()} Bogdan Istrate</span>
          <span>
            Built with Next.js &middot; Deployed on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555] hover:text-[#00ff41] transition-colors"
            >
              Vercel
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
