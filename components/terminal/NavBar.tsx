"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "/about", href: "#about" },
  { label: "/skills", href: "#skills" },
  { label: "/projects", href: "#projects" },
  { label: "/contact", href: "#contact" },
];

const SECTION_IDS = ["hero", "about", "skills", "certifications", "projects", "experience", "contact"];

export default function NavBar() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 h-10 flex items-center justify-between">
        {/* Traffic lights + title — desktop only */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[#555] text-xs">bogdan@cloud-engineer</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-5 text-xs ml-auto">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${
                active === link.href
                  ? "text-[#00ff41] active"
                  : "text-[#555]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile: title left, hamburger right */}
        <span className="sm:hidden text-[#555] text-xs">bogdan@cloud</span>
        <button
          className="sm:hidden text-[#555] hover:text-[#00ff41] transition-colors text-xs px-2 py-1 border border-[#1a1a1a] rounded"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#1a1a1a] bg-[#0d0d0d]/98">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`block px-6 py-3 text-xs border-b border-[#1a1a1a] transition-colors duration-150 ${
                active === link.href
                  ? "text-[#00ff41]"
                  : "text-[#555] hover:text-[#00ff41]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
