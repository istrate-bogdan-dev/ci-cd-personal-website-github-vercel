# Bogdan-Cosmin Istrate — Interactive Terminal Portfolio

![CI](https://github.com/istrate-bogdan-dev/ci-cd-personal-website-github-vercel/actions/workflows/ci.yml/badge.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

A terminal-style interactive portfolio for a Cloud Solutions Architect & DevOps professional. Visitors navigate the site by typing — or clicking — commands in a fully functional browser-based terminal.

**Live:** [ci-cd-personal-website-github-verce.vercel.app](https://ci-cd-personal-website-github-verce.vercel.app)  
**GitHub:** [github.com/istrate-bogdan-dev](https://github.com/istrate-bogdan-dev)

---

## Overview

The portfolio renders as a macOS-style terminal window with an animated boot sequence on load. All content is accessible via interactive commands — designed to impress technical recruiters while remaining navigable for non-technical HR through clickable command hints.

### Available Commands

| Command | Description |
|---------|-------------|
| `/help` | List all available commands (clickable) |
| `/about` | Professional summary & background |
| `/skills` | Expertise across Cloud, DevOps & DevSecOps |
| `/certifications` | AWS SAA-C03 certification & credentials |
| `/logs` | Full work experience timeline |
| `/projects` | GitHub projects & case studies |
| `/status` | Current availability & preferences |
| `/contact` | Email, GitHub & LinkedIn |
| `/deploy` | Easter egg 🚀 |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Font | JetBrains Mono (Google Fonts) |
| Hosting | Vercel |
| CI/CD | GitHub Actions |

---

## Project Structure

```
app/
  layout.tsx              # Root layout, font loading, metadata
  page.tsx                # Entry point — renders TerminalShell
  globals.css             # CSS variables, animations, scrollbar

components/
  shell/
    TerminalShell.tsx     # Top-level orchestrator — boot gate + command dispatch
    TerminalWindow.tsx    # Terminal chrome (title bar, traffic lights, body)
    BootScreen.tsx        # Animated boot sequence on first load
    CommandInput.tsx      # Controlled input bar with auto-focus
    OutputRenderer.tsx    # Renders command output history
    useTerminal.ts        # State machine — boot, type, submit, clear

  commands/
    registry.tsx          # All command definitions + exported registry object
    index.ts              # CommandEntry / CommandRegistry types + registerCommand
```

---

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# Clone the repository
git clone https://github.com/istrate-bogdan-dev/ci-cd-personal-website-github-vercel.git
cd ci-cd-personal-website-github-vercel

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and type `/help` to get started.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## CI / CD Pipeline

GitHub Actions runs automatically on every push to `main` and `dev`, and on pull requests targeting `main`:

1. **Lint** — ESLint with React hooks rules
2. **Build** — `next build` (Turbopack)
3. **Type check** — `tsc --noEmit`

Vercel is connected via GitHub integration:
- Push to `main` → production deployment
- Pull request → automatic preview URL

---

## License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.  
Personal data (name, contact info, work history) belongs to Bogdan-Cosmin Istrate and must be replaced if you fork this project.
