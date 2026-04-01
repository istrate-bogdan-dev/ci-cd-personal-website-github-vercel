# Personal Portfolio — Bogdan Istrate

![CI](https://github.com/istrate-bogdan-dev/ci-cd-personal-website-github-vercel/actions/workflows/ci.yml/badge.svg)

Terminal-style personal portfolio for a Cloud Engineer / DevOps / DevSecOps professional.

**Live:** [bogdanistrate.vercel.app](https://bogdanistrate.vercel.app)

---

## Overview

A single-page portfolio built with a terminal / hacker aesthetic. It features a boot sequence animation on load, scroll-triggered section reveals, animated skill bars, and a sticky scroll-spy navigation bar.

Sections: **About · Skills · Certifications · Projects · Experience · Contact**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | JetBrains Mono |
| Hosting | Vercel |
| CI | GitHub Actions |

---

## Project Structure

```
app/
  layout.tsx          # Root layout, font loading, metadata
  page.tsx            # Main page — boot gate + section assembly
  globals.css         # Global styles, animations, CSS variables

components/
  terminal/
    NavBar.tsx        # Sticky top nav with scroll spy
    TerminalWindow.tsx # Terminal chrome (traffic lights, title bar)
    BootSequence.tsx  # Animated boot sequence on first load
    CommandLine.tsx   # Reusable prompt-style command line
    useScrollReveal.ts # Scroll-triggered animation hooks
  sections/
    Hero.tsx          # Name, title, summary
    About.tsx         # Background and background info
    Skills.tsx        # Animated skill bars
    Certifications.tsx # AWS and other certs
    Projects.tsx      # Project cards with links
    Experience.tsx    # Work history
    Contact.tsx       # Links and contact info
```

---

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## CI / CD

GitHub Actions runs on every push to `main` and `dev`, and on pull requests targeting `main`:

1. **Lint** — ESLint
2. **Build** — `next build`
3. **Type check** — `tsc --noEmit`

Vercel is connected via GitHub integration:
- Push to `main` → production deployment
- Pull request → automatic preview URL

---

## License

MIT — see [LICENSE](./LICENSE).
