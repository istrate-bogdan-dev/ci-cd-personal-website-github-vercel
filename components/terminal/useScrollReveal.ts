"use client";

import { useEffect } from "react";

export function useScrollReveal(booted: boolean) {
  useEffect(() => {
    if (!booted) return;

    const elements = document.querySelectorAll<HTMLElement>(".section-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [booted]);
}

export function useSkillBarReveal(booted: boolean) {
  useEffect(() => {
    if (!booted) return;

    const bars = document.querySelectorAll<HTMLElement>(".skill-bar-fill");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach((bar) => observer.observe(bar));
    return () => observer.disconnect();
  }, [booted]);
}
